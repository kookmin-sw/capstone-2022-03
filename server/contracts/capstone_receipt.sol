// SPDX-License-Identifier: UNLICENSED
// 
pragma solidity ^0.8.13;

contract capstone_receipt {
    uint private club_balance;

    user private leader;
    user[] private member_list;
    receipt[] private receipt_list;

    struct user {
        address user_address;
        string user_nickname;
        string department;
    }

    struct receipt {
        string payment_place;
        uint payment_amount;
        string payment_detail;
    }

    modifier onlyLeader() {
        require(msg.sender == leader.user_address);
        _;
    }

    modifier onlyMember() {
        bool is_member = false;
        for(uint i=0; i<member_list.length; i++){
            if (msg.sender == member_list[i].user_address) {
                is_member = true;
            }
        }
        require(is_member == true);
        _;
    }

    constructor (string memory _user_nickname) {
        club_balance = 0;

        leader.user_address = msg.sender;
        leader.user_nickname = _user_nickname;
        leader.department = "head";

        member_list.push(leader);
    }

    function addMember(address _user_address, string memory _user_nickname, string memory _department) public onlyLeader {
        member_list.push(user(_user_address, _user_nickname, _department));
    }

    function addMoney(uint _money) public onlyLeader {
        club_balance = club_balance + _money;
    }

    function addReceipt(string memory _payment_place, uint _payment_amount, string memory _payment_detail) public onlyMember {
        require(club_balance >= _payment_amount);

        club_balance = club_balance - _payment_amount;
        receipt_list.push(receipt(_payment_place, _payment_amount, _payment_detail));
    }

    function getMoney() public view returns(uint) {
        return club_balance;
    }

    function getMembers() public view returns(user[] memory) {
        return member_list;
    }

    function getReceipts() public view returns(receipt[] memory) {
        return receipt_list;
    }
}
