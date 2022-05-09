// SPDX-License-Identifier: UNLICENSED
// 
pragma solidity ^0.8.13;

contract receipt {
    address private owner;

    string private place;
    string private date;
    string private detail;
    uint private amount;


    constructor (string memory _place, string memory _date, string memory _detail, uint _amount) {
        owner = msg.sender;

        place = _place;
        date = _date;
        detail = _detail;
        amount = _amount;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getPlace() public view returns (string memory) {
        return place;
    }

    function getDate() public view returns (string memory) {
        return date;
    }

    function getDetail() public view returns (string memory) {
        return detail;
    }

    function getAmount() public view returns (uint) {
        return amount;
    }
}