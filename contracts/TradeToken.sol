// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TradeToken {
    IERC20 public proxym;
    IERC20 public usdt;
    uint256 public rate = 100; // Initial rate: 100 PRX = 1 USDT (1 PRX = 0.01 USDT)

    constructor(address _proxym, address _usdt) {
        proxym = IERC20(_proxym);
        usdt = IERC20(_usdt);
    }

    // Buy tokens with USDT using CPMM logic
    function buyTokens(address from, uint256 usdtAmount) public {
        uint256 currentUSDT = usdt.balanceOf(address(this));
        uint256 currentPRX = proxym.balanceOf(address(this));
        require(currentUSDT > 0 && currentPRX > 0, "Pool is empty");

        // Calculate PRX to send based on constant product: k = PRX * USDT
        uint256 k = currentPRX * currentUSDT;
        uint256 newUSDT = currentUSDT + usdtAmount;
        uint256 newPRX = k / newUSDT; // New PRX balance after trade
        uint256 tokenAmount = currentPRX - newPRX; // PRX sent to user

        require(tokenAmount > 0, "Insufficient output amount");
        require(proxym.balanceOf(address(this)) >= tokenAmount, "Not enough tokens available");

        // Transfer USDT from the user to the contract
        usdt.transferFrom(from, address(this), usdtAmount);

        // Transfer PRX tokens to the user
        proxym.transfer(from, tokenAmount);

        // Update rate to reflect new price (PRX per USDT)
        updateExchangeRateForBuy();
    }

    // Sell tokens for USDT using CPMM logic
    function sellTokens(address from, uint256 tokenAmount) public {
        uint256 currentUSDT = usdt.balanceOf(address(this));
        uint256 currentPRX = proxym.balanceOf(address(this));
        require(currentUSDT > 0 && currentPRX > 0, "Pool is empty");

        // Calculate USDT to send based on constant product: k = PRX * USDT
        uint256 k = currentPRX * currentUSDT;
        uint256 newPRX = currentPRX + tokenAmount;
        uint256 newUSDT = k / newPRX; // New USDT balance after trade
        uint256 usdtAmount = currentUSDT - newUSDT; // USDT sent to user

        require(usdtAmount > 0, "Insufficient output amount");
        require(usdt.balanceOf(address(this)) >= usdtAmount, "Not enough USDT available");

        // Transfer PRX tokens from the user to the contract
        proxym.transferFrom(from, address(this), tokenAmount);

        // Transfer USDT to the user
        usdt.transfer(from, usdtAmount);

        // Update rate to reflect new price (PRX per USDT)
        updateExchangeRateForSell();
    }

    // Getter for Exchange rate
    function getRate() public view returns (uint256) {
        return rate; // PRX per USDT
    }

    // Setter for the Exchange Rate
    function setRate(uint256 newRate) public {
        rate = newRate;
    }

    // Transfer PRX tokens to another address
    function transferToken(address from, address to, uint256 tokenAmount) public {
        require(proxym.balanceOf(from) >= tokenAmount, "Not enough tokens to transfer");
        bool success = proxym.transferFrom(from, to, tokenAmount);
        require(success, "Token transfer failed");
    }

    function transferUSDT(address from, address to, uint256 tokenAmount) public {
        require(usdt.balanceOf(from) >= tokenAmount, "Not enough tokens to transfer");
        bool success = usdt.transferFrom(from, to, tokenAmount);
        require(success, "Token transfer failed");
    }

    // Update rate after a buy (called internally)
    function updateExchangeRateForBuy() internal {
        uint256 currentUSDT = usdt.balanceOf(address(this));
        uint256 currentPRX = proxym.balanceOf(address(this));
        require(currentUSDT > 0 && currentPRX > 0, "Pool is empty");
        rate = currentPRX / currentUSDT; // New rate: PRX per USDT
    }

    // Update rate after a sell (called internally)
    function updateExchangeRateForSell() internal {
        uint256 currentUSDT = usdt.balanceOf(address(this));
        uint256 currentPRX = proxym.balanceOf(address(this));
        require(currentUSDT > 0 && currentPRX > 0, "Pool is empty");
        rate = currentPRX / currentUSDT; // New rate: PRX per USDT
    }
}
