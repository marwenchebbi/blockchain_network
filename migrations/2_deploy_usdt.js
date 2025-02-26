const MockUSDT = artifacts.require("MockUSDT");

module.exports = function (deployer) {
  deployer.deploy(MockUSDT);
};