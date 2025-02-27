const MockUSDT = artifacts.require("MockUSDT");

module.exports = function (deployer) {
  deployer.deploy(MockUSDT,{gas: 6000000});
};