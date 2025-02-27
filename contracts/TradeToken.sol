// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TradeToken {
    IERC20 public proxym;
    IERC20 public usdt;
    uint256 public rate = 100; // 100 PRX = 1 USDT

    constructor(address _proxym, address _usdt) {
        proxym = IERC20(_proxym);
        usdt = IERC20(_usdt);
    }

    // Buy tokens with USDT
    function buyTokens(uint256 usdtAmount) public {
        uint256 tokenAmount = usdtAmount * rate;
        require(proxym.balanceOf(address(this)) >= tokenAmount, "Not enough tokens available");
        
        // Transfer USDT from the user to the contract
        usdt.transferFrom(msg.sender, address(this), usdtAmount);
        
        // Transfer PRX tokens to the user
        proxym.transfer(msg.sender, tokenAmount);
    }

    // Sell tokens for USDT
    function sellTokens(uint256 tokenAmount) public {
        uint256 usdtAmount = tokenAmount / rate;
        require(usdt.balanceOf(address(this)) >= usdtAmount, "Not enough USDT available");
        
        // Transfer PRX tokens from the user to the contract
        proxym.transferFrom(msg.sender, address(this), tokenAmount);
        
        // Transfer USDT to the user
        usdt.transfer(msg.sender, usdtAmount);
        
    }
    
    // Transfer PRX tokens to another address
    function transferToken(address from,address to, uint256 tokenAmount) public {
        // Ensure the sender has enough tokens
        require(proxym.balanceOf(from) >= tokenAmount, "Not enough tokens to transfer");
        // Transfer tokens from the sender to the recipient
        bool success = proxym.transferFrom(from, to, tokenAmount);
        require(success, "Token transfer failed");
    }
}
