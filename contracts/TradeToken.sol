// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TradeToken {
    IERC20 public proxym;
    IERC20 public usdt;

    constructor(address _proxym, address _usdt) {
        proxym = IERC20(_proxym);
        usdt = IERC20(_usdt);
    }

    // Buy PRX tokens with USDT
    function buyTokens(uint256 usdtAmount) external {
        require(usdtAmount > 0, "Amount must be greater than 0");

        uint256 usdtBalance = usdt.balanceOf(address(this));
        uint256 prxBalance = proxym.balanceOf(address(this));
        require(usdtBalance > 0 && prxBalance > 0, "Pool is empty");

        // Calculate PRX to send based on constant product: k = PRX * USDT
        uint256 k = usdtBalance * prxBalance;
        uint256 newUsdtBalance = usdtBalance + usdtAmount;
        uint256 newPrxBalance = k / newUsdtBalance;
        uint256 prxToSend = prxBalance - newPrxBalance;

        require(prxToSend > 0, "Insufficient output amount");

        // Transfer USDT from the user to the contract
        require(
            usdt.transferFrom(msg.sender, address(this), usdtAmount),
            "USDT transfer failed"
        );

        // Transfer PRX tokens to the user
        require(proxym.transfer(msg.sender, prxToSend), "PRX transfer failed");
    }

    // Sell PRX tokens for USDT
    function sellTokens(uint256 prxAmount) external {
        require(prxAmount > 0, "Amount must be greater than 0");

        uint256 usdtBalance = usdt.balanceOf(address(this));
        uint256 prxBalance = proxym.balanceOf(address(this));
        require(usdtBalance > 0 && prxBalance > 0, "Pool is empty");

        // Calculate USDT to send based on constant product: k = PRX * USDT
        uint256 k = usdtBalance * prxBalance;
        uint256 newPrxBalance = prxBalance + prxAmount;
        uint256 newUsdtBalance = k / newPrxBalance;
        uint256 usdtToSend = usdtBalance - newUsdtBalance;

        require(usdtToSend > 0, "Insufficient output amount");

        // Transfer PRX tokens from the user to the contract
        require(
            proxym.transferFrom(msg.sender, address(this), prxAmount),
            "PRX transfer failed"
        );

        // Transfer USDT to the user
        require(usdt.transfer(msg.sender, usdtToSend), "USDT transfer failed");
    }

    // Get the current price of PRX in USDT (with decimals considered)
    function getPrice() external view returns (uint256) {
        uint256 usdtBalance = usdt.balanceOf(address(this));
        uint256 prxBalance = proxym.balanceOf(address(this));
        require(usdtBalance > 0 && prxBalance > 0, "Pool is empty");

        // Price = USDT / PRX (adjusted for decimals if needed)
        return (usdtBalance * 1e18) / prxBalance; // Adjust for 18 decimals
    }

    // Helper function to get pool balances
    function getPoolBalances()
        external
        view
        returns (uint256 prxBalance, uint256 usdtBalance)
    {
        return (proxym.balanceOf(address(this)), usdt.balanceOf(address(this)));
    }

    // Transfer PRX tokens to another address
    function transferToken(
        address from,
        address to,
        uint256 tokenAmount
    ) public {
        require(
            proxym.balanceOf(from) >= tokenAmount,
            "Not enough tokens to transfer"
        );
        bool success = proxym.transferFrom(from, to, tokenAmount);
        require(success, "Token transfer failed");
    }

    // Transfer USDT to another address
    function transferUSDT(
        address from,
        address to,
        uint256 tokenAmount
    ) public {
        require(
            usdt.balanceOf(from) >= tokenAmount,
            "Not enough tokens to transfer"
        );
        bool success = usdt.transferFrom(from, to, tokenAmount);
        require(success, "Token transfer failed");
    }
}

