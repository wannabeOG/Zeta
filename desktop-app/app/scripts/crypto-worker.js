self.window = self // This is required for the jsencrypt library to work within the webworker

// Import the jsencrypt library
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/2.3.1/jsencrypt.min.js');

let crypt = new JSEncrypt({default_key_size: 2056})
let privateKey = null

/** Webworker onmessage listener */
onmessage = function(e) {
  const [ messageType, messageId, text, key ] = e.data
  let result
  switch (messageType) {
    case 'generate-keys':
      result = generateKeypair()
      break
    case 'encrypt':
      result = encrypt(text, key)
      break
    case 'decrypt':
      result = decrypt(text)
      break
    case 'set-private':
      setPrivateKey(key)
      break
  }

  // Return result to the UI thread
  postMessage([ messageId, result ])
}

function setPrivateKey(key) {
  privateKey = key
}

/** Generate and store keypair */
function generateKeypair () {
  crypt = new JSEncrypt({default_key_size: 2056})
  // privateKey = crypt.getPrivateKey()

  // crypt.setPublicKey();

  // Only return the public key, keep the private key hidden
  // return crypt.getPublicKey()
}

/** Encrypt the provided string with the destination public key */
function encrypt (content, publicKey) {
  crypt.setKey(publicKey)
  return crypt.encrypt(content)
}

/** Decrypt the provided string with the local private key */
function decrypt (content) {
  crypt.setKey(privateKey)
  return crypt.decrypt(content)
}
