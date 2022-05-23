// SPDX-License-Identifier: UNLICENSED
//
pragma solidity ^0.8.13;

contract club {
    string private club_title;
    uint private club_balance;
    uint timestamp;

    User private leader;
    User[] private members;
    User[] private users;
    Bank private bank;
    Receipt[] private receipts;

    struct User {
        address addr;
        string id;
        string name;
        string department;
    }
    struct Bank {
        string name;
        string account;
        string holder;
    }
    struct Info {
        string title;
        uint balance;
        string name;
        string id;
        uint user_size;
        uint deployed_time;
    }
    struct Receipt {
        string owner;
        string place;
        string date;
        uint cost;
        string image1;
        string image2;
        string mime;
        string[] detail;
    }

    modifier onlyLeader() {
        require(leader.addr == msg.sender);
        _;
    }
    modifier onlyMember() {
        bool flag = false;

        for(uint i=0; i < members.length; i ++) {
            if (members[i].addr == msg.sender) {
                flag = true;
                break;
            }
        }

        require(flag == true);
        _;
    }
    modifier onlyUser() {
        bool flag = false;

        for(uint i=0; i < users.length; i ++) {
            if (users[i].addr == msg.sender) {
                flag = true;
                break;
            }
        }

        require(flag == true);
        _;
    }

    constructor
    (string memory _club_title,
        string memory bank_name, string memory bank_account, string memory bank_holder,
        address leader_address, string memory leader_id, string memory leader_name) {
        club_title = _club_title;
        club_balance = 0;
        timestamp = block.timestamp;

        bank.name = bank_name;
        bank.account = bank_account;
        bank.holder = bank_holder;

        leader.addr = msg.sender;
        leader.id = leader_id;
        leader.department = "head";
        leader.name = leader_name;

        members.push(leader);
        users.push(leader);
    }

    function clubInfo() public onlyUser view returns (Info memory) {
        Info memory temp;
        temp.title = club_title;
        temp.balance = club_balance;
        temp.name = leader.name;
        temp.id = leader.id;
        temp.user_size = users.length;
        temp.deployed_time = timestamp;

        return temp;
    }

    function receiptInfo() public onlyUser view returns (Receipt[] memory){
        return receipts;
    }
    function userInfo() public onlyUser view returns (User[] memory) {
        return users;
    }
    function memberInfo() public onlyUser view returns (User[] memory) {
        return members;
    }
    function balanceInfo() public onlyUser view returns(uint) {
        return club_balance;
    }

    function addReceipt(string memory owner, string memory place,
        string memory date, uint amount, string memory image1, string memory image2, string memory mime, string[] memory detail)
    public onlyMember {
        require(club_balance >= amount);
        receipts.push(Receipt(owner, place, date, amount, image1, image2, mime, detail));
        club_balance = club_balance - amount;
    }

    function addUser(address addr, string memory id, string memory name,
        string memory department) public {
        users.push(User(addr, id, name, department));
    }
    function addMember(address addr, string memory id,
        string memory name, string memory department) public onlyLeader{
        members.push(User(addr, id, name, department));
    }
    function addBalance(uint fee) public onlyUser {
        club_balance = club_balance + fee;
    }

}