var utils = require('./lib/index');

function encrypt(key, data, opts) { 
  return (isValidCreditCard && 
  		isValidData ? 
  		Promise.resolve(utils.common.encryptPaymentDataWithAdyen(key, data)) : 
  		Promise.reject()); 
}

function isValidCreditCard() {
  return true;
}

function isValidData() {
  return true;
}

module.exports = {
  encrypt : encrypt
};