// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TradeToken {
    ERC20 public prxToken;
    ERC20 public usdtToken;
    uint256 public rate = 100; // 1 PRX = 0.01 USDT

    constructor(address _prxToken, address _usdtToken) {
        prxToken = ERC20(_prxToken);
        usdtToken = ERC20(_usdtToken);
    }

    function buyPRX(uint256 usdtAmount) public {
        uint256 prxAmount = usdtAmount * rate;
        require(usdtToken.transferFrom(msg.sender, address(this), usdtAmount), "USDT transfer failed");
        require(prxToken.transfer(msg.sender, prxAmount), "PRX transfer failed");
    }

    function sellPRX(uint256 prxAmount) public {
        uint256 usdtAmount = prxAmount / rate;
        require(prxToken.transferFrom(msg.sender, address(this), prxAmount), "PRX transfer failed");
        require(usdtToken.transfer(msg.sender, usdtAmount), "USDT transfer failed");
    }

    function getPrice() public view returns (uint256) {
        return rate;
    }
}