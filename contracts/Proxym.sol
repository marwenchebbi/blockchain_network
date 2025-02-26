// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Proxym is ERC20 {
    constructor() ERC20("Proxym", "PRX") {
        _mint(msg.sender, 1000 * 10**18); // 1M USDT with 6 decimals
    }
}