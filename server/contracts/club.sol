// SPDX-License-Identifier: UNLICENSED
//
pragma solidity ^0.8.13;

contract club {
    string private club_title;
    string private bank_account;
    string private bank_name;
    string private bank_holder;

    user private leader;
    user[] private members;

    uint private balance = 0;
    string[] private receipts;

    struct user {
        address account;
        string id;
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

    constructor (string memory _club_title, string memory _bank_account, string memory _bank_name, string memory _bank_holder, string memory _leader_id) {
        club_title = _club_title;
        bank_account = _bank_account;
        bank_name = _bank_name;
        bank_holder = _bank_holder;

        leader.id = _leader_id;
        leader.account = msg.sender;
        leader.department = "head";

        members.push(leader);
    }

    // getter functions
    function getClubTitle() public onlyLeader view returns(string memory) {
        return club_title;
    }

    function getBankAccount() public onlyLeader view returns(string memory) {
        return bank_account;
    }

    function getBankName() public onlyLeader view returns(string memory) {
        return bank_name;
    }

    function getBankHolder() public onlyLeader view returns(string memory) {
        return bank_holder;
    }

    function getLeader() public view returns (user memory) {
        return leader;
    }

    function getMembers() public view returns (user[] memory) {
        return members;
    }

    function getBalance() public view returns (uint) {
        return balance;
    }

    function getReceipts() public view returns (string[] memory){
        return receipts;
    }

    // setter functions
    function addMember(address account, string memory id, string memory department) public onlyLeader {
        members.push(user(account, id, department));
    }

    function addFee(uint fee) public onlyLeader {
        balance = balance + fee;
    }

    function addReceipt(string memory receipt) public onlyMember {
        receipts.push(receipt);
    }

    function calcBalance(uint payment) public {
        balance = balance - payment;
    }

    function checkPaymentAmount(uint payment) public view {
        if (balance < payment) { revert(); }
    }
}