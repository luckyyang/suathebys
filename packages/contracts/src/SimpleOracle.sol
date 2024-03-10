// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract SimpleOracle {
  mapping(string => string) private prices;

  event PriceUpdated(string name, string price);

  function setPrice(string memory name, string memory price) public {
    prices[name] = price;
    emit PriceUpdated(name, price);
  }

  function getPrice(string memory name) view public returns (string memory) {
    return prices[name];
  }
}