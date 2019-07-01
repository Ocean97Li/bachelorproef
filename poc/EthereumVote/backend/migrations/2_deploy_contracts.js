var Election = artifacts.require("./Election.sol");
// var LocalCrypto = artifacts.require("./LocalCrypto.sol");
// var AnonymousVoting = artifacts.require("./AnonymousVoting.sol");
module.exports = function(deployer) {
  deployer.deploy(Election);
  // deployer.deploy(LocalCrypto);
  // deployer.deploy(AnonymousVoting);
};
