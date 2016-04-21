var ADYEN_ENCRYPTION_VERSION = '0_1_6';

var sjcl = require('./sjcl-bytes');

// Should be refactored to a Object polyfill 
function joinObjects(obj1, obj2) {
  var completeObject = {};
  var args = Array.prototype.slice.call(arguments, 0);
  args.map(function(obj) {
    var key;
    var keys = Object.keys(obj);
    var n = keys.length;
    while (n--) {
      key = keys[n];
      completeObject[key] = obj[key];
    }
  });

  return completeObject;
}

/**
 * Use adyen client-side-encryption
 *
 * @param {Object} dataToEncrypt   Json that cointains number, holderName, cvc,
 *                                 expiryMonth and expiryYear of a credit card
 *
 * @return {String}                Adyen encrypted data
 **/
function encryptPaymentDataWithAdyen(key, dataToEncrypt) {
  var aesKey, iv, cipher, keybytes;
  var rsa, exponent, modulus, encrypted;
  var prefix;

  var timeJson = {
    generationtime: new Date().toISOString()
  };

  var stringData = JSON.stringify(joinObjects(dataToEncrypt, timeJson));

  // Cipher data with aes ccm
  aesKey = sjcl.random.randomWords(8, 0);
  iv = sjcl.random.randomWords(3, 0);
  cipher = aesEncryptionWithIv(aesKey, stringData, iv);

  // Rsa PKCS1 base64 key encryption
  keybytes = sjcl.codec.bytes.fromBits(aesKey);

  var k = key.split('|');
  exponent = k[0];
  modulus = k[1];

  encrypted = rsaEncryption(modulus, exponent, keybytes);

  // Adyen encryption
  prefix = 'adyenjs_' + ADYEN_ENCRYPTION_VERSION + '$';
  var adyenKey = [prefix, encrypted, '$', cipher].join('');

  return adyenKey;
}

function aesEncryptionWithIv(key, text, iv) {
  var aes, bits, cipher, cipherIV;

  aes = new sjcl.cipher.aes(key);
  bits = sjcl.codec.utf8String.toBits(text);
  cipher = sjcl.mode.ccm.encrypt(aes, bits, iv);
  cipherIV = sjcl.bitArray.concat(iv, cipher);
  return sjcl.codec.base64.fromBits(cipherIV);
}

function rsaEncryption(modulus, exponent, dataToEncrypt) {
  var rsa = require('./rsa/rsa.js');

  var pub = new rsa.Key();
  pub.setPublic(modulus, exponent);

  var encrypted = pub.encrypt_b64(dataToEncrypt); // jshint ignore:line

  return encrypted;
}

module.exports = {
  encryptPaymentDataWithAdyen: encryptPaymentDataWithAdyen,
};