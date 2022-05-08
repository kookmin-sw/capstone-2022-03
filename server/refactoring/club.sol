// SPDX-License-Identifier: UNLICENSED
//
pragma solidity ^0.8.13;

contract club {
    user private leader;
    user[] private members;

    uint private balance = 0;
    string[] private receipts;

    struct user {
        address account;
        string name;
        string department;
    }

    modifier onlyLeader() {
        require(msg.sender == leader.account);
        _;
    }

    modifier onlyMember() {
        bool is_member = false;
        for(uint i=0; i<members.length; i++){
            if (msg.sender == members[i].account) {
                is_member = true;
            }
        }
        require(is_member == true);
        _;
    }

    constructor (string memory name) {
        leader.name = name;
        leader.account = msg.sender;
        leader.department = "head";

        members.push(leader);
    }

    function addMember(address account, string memory name, string memory department) public onlyLeader {
        members.push(user(account, name, department));
    }

    function addFee(uint fee) public onlyLeader {
        balance = balance + fee;
    }

    function getMoney() public view returns (uint) {
        return balance;
    }

    function getMembers() public view returns (user[] memory) {
        return members;
    }

    function addReceipt(string memory receipt) public onlyMember {
        receipts.push(receipt);
    }

    function getReceipts() public view returns (string[] memory){
        return receipts;
    }
}
