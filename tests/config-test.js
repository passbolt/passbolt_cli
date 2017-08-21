// Config test
var chai = require('chai');
chai.should();
var Config = require('./../app/models/config.js');

describe('Config', function() {
  it('A config file should be set', function() {
    var path = process.cwd() + '/app/config/';
    var getResult = Config.get('config.json', path);
    getResult.should.be.a('object');
    getResult.domain.should.be.a('object');
    getResult.domain.baseUrl.should.be.a('string');
    getResult.domain.publicKey.should.be.a('object');
    getResult.domain.publicKey.fingerprint.should.be.a('string');

    getResult.user.should.be.a('object');
    getResult.user.firstname.should.be.a('string');
    getResult.user.lastname.should.be.a('string');
    getResult.user.email.should.be.a('string');
    getResult.user.privateKey.should.be.a('object');
    getResult.user.privateKey.fingerprint.should.be.a('string');
  });
});
