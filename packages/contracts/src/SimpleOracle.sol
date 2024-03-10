// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract SimpleOracle {
  mapping(string => uint256) private prices;

  event PriceUpdated(string name, uint price);

  function setPrice(string memory name, uint price) public {
    prices[name] = price;
    emit PriceUpdated(name, price);
  }

  function getPrice(string memory name) view public returns (uint) {
    return prices[name];
  }
}