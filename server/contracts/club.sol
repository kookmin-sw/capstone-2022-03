// SPDX-License-Identifier: UNLICENSED
//
pragma solidity ^0.8.13;

contract club {
    string private club_title;
    uint private club_balance;

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
        uint user_size;
    }
    struct Receipt {
        string owner;
        string place;
        string date;
        uint cost;
        string[] detail;
    }

    constructor
    (string memory _club_title,
        string memory bank_name, string memory bank_account, string memory bank_holder,
        address leader_address, string memory leader_id, string memory leader_name) {
        club_title = _club_title;
        club_balance = 0;

        bank.name = bank_name;
        bank.account = bank_account;
        bank.holder = bank_holder;

        leader.addr = leader_address;
        leader.id = leader_id;
        leader.department = "head";
        leader.name = leader_name;

        members.push(leader);
        users.push(leader);
    }

    function clubInfo() public view returns (Info memory){
        Info memory temp;
        temp.title = club_title;
        temp.balance = club_balance;
        temp.name = leader.name;
        temp.user_size = users.length;

        return temp;
    }

    function receiptInfo() public view returns (Receipt[] memory){
        return receipts;
    }
    function userInfo() public view returns (User[] memory) {
        return users;
    }

    function addReceipt(string memory owner, string memory place,
        string memory date, uint amount, string[] memory detail)
    public {
        require(club_balance >= amount);
        receipts.push(Receipt(owner, place, date, amount, detail));
        club_balance = club_balance - amount;
    }

    function addUser(address addr, string memory id, string memory name,
        string memory department) public {
        users.push(User(addr, id, name, department));
    }
    function addMember(address addr, string memory id,
        string memory name, string memory department) public {
        members.push(User(addr, id, name, department));
    }
    function addBalance(uint fee) public {
        club_balance = club_balance + fee;
    }
    function getBalance() public view returns(uint) {
        return club_balance;
    }
}