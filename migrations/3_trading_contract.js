const TokenExchange = artifacts.require("TradeToken");
const Proxym = artifacts.require("Proxym");
const USDT = artifacts.require("MockUSDT");

module.exports = async function (deployer) {
  deployer.deploy(TokenExchange, Proxym.address, USDT.address);
  

};