# Adyen Encryption

Compatible for NodeJS and browsers via browserify

## Installation

`npm install --save adyen-encrypt`

## Usage

First of all, get a public key from Adyen.

Then you can encrypt the card data.

```javascript
var CARD_DATA = {
    number: '5555444433331111',
    holderName: 'Test user',
    cvc: '737',
    expiryMonth: '06',
    expiryYear: '2016'
};
```

```javascript
var adyenEncrypt = require('adyen-encryption');

adyenEncrypt.encrypt(KEY, CARD_DATA)
	.then(function(dataEncrypted){
		//card data is secure now!
	});
```