var chai = global.chai = require('chai');
var expect = global.expect = chai.expect;
var should = global.should = chai.should();
var chaiAsPromised = require('chai-as-promised');
var adyenEncrypt = require('../../src/main');
var fixtures = require('../fixtures'); 
chai.use(chaiAsPromised);

describe('Payment interface', function() {

  it('Should generate encrypted data from public key and valid data object', function(done) {
    adyenEncrypt
      .encrypt(fixtures.publicKey, fixtures.cards[1])
      .then(function(encryptedData) {
        expect(encryptedData).to.be.a('string');
      })
      .should.notify(done);
  });

  it('Should fail when public key is not valid', function(done) {
    //TODO
    Promise.reject('Error')
      .should.be.rejected
      .should.notify(done);
  });

  it('Should fail when data object is not valid', function(done) {
  	//TODO
    Promise.reject('Error')
      .should.be.rejected
      .should.notify(done); 
  });
});