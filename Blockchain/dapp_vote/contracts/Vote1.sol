// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
contract Vote1 {
    // attribute
    address administrator;

    string private bill_title;
    uint private bill_id;
    bool private is_vote_live;

    vote_paper[] private ballot_box;
    // struct
    struct vote_paper {
        uint user_id;
        bool pros_and_cons;
    }
    // mapping
    // 중복투표 불가능 하도록 설정하기 위한 사전 작업이다.
    mapping(address => bool) has_user_voted;
    // modifier
    // onlyAdministrator 태그를 붙이면 관리자만 실행이 가능하다.
    modifier onlyAdministrator {
        require(msg.sender == administrator);
        _;
    }

    // constructor
    constructor(string memory _bill_title, uint _bill_id) {
        administrator = msg.sender;
        bill_title = _bill_title;
        bill_id = _bill_id;
        is_vote_live = true;
    }
    // function
    // 투표권을 행사하는 함수
    function makeVote(uint _user_id, bool _pros_and_cons) public {
        // 투표가 진행중인 법안이어야 한다.
        require(is_vote_live == true);
        // 관리자는 투표할 수 없어야 한다.
        if(msg.sender == administrator){
            revert();
        }
        // 유권자는 중복투표가 불가능하다.
        require(has_user_voted[msg.sender] == false);

        // 유권자가 투표권을 행사한다.
        ballot_box.push(vote_paper(_user_id, _pros_and_cons));
        // 유권자가 투표를 완료하여 더 이상 투표가 불가능하다.
        has_user_voted[msg.sender] = true;
    }

    // 투표를 종료하는 함수
    function finishVote() public onlyAdministrator {
        // 투표가 진행중인 법안이어야 한다.
        require(is_vote_live == true);
        // 투표를 종료시킨다.
        is_vote_live = false;
    }

    // 투표 결과를 확인하는 함수
    function resultVote() public view returns (vote_paper[] memory){
        return ballot_box;
    }

    function voter_list() public view returns (uint[] memory){
        uint[] memory voters = new uint[](ballot_box.length);

        for(uint i=0; i<ballot_box.length; i++) {
            voters[i] = ballot_box[i].user_id;
        }
        return voters;
    }
}