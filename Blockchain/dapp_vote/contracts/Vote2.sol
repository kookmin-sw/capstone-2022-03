// SPDX-License-Identifier: UNLICENSED
// 
pragma solidity ^0.8.13;
contract Vote2 {
    // attribute
    address administrator;
    enum State { Created, Active, Finished }

    State public state;
    vote_paper[] private ballot_box;
    // struct
    struct vote_paper {
        string user_address;
        bool pros_and_cons;
    }
    // mapping
    // 중복투표 불가능 하도록 설정하기 위한 사전 작업이다.
    mapping(address => bool) has_user_voted;

    // modifier
    modifier onlyAdministrator {
        require(msg.sender == administrator);
        _;
    }
    modifier inState(State _state) {
        require(state == _state);
        _;
    }
    modifier onlyVoter {
        require(msg.sender != administrator);
        _;
    }

    // constructor
    constructor() {
        administrator = msg.sender;
        state = State.Created;
    }

    // function
    function startVote() public onlyAdministrator inState(State.Created) {
        state = State.Active;
    }
    
    // 투표권을 행사하는 함수
    function makeVote(string memory _user_address, bool _pros_and_cons) public onlyVoter inState(State.Active) {
    
        // 유권자는 중복투표가 불가능하다.
        require(has_user_voted[msg.sender] == false);

        // 유권자가 투표권을 행사한다.
        ballot_box.push(vote_paper(_user_address, _pros_and_cons));
        // 유권자가 투표를 완료하여 더 이상 투표가 불가능하다.
        has_user_voted[msg.sender] = true;
    }

    // 투표를 종료하는 함수
    function finishVote() public onlyAdministrator inState(State.Active) {
        // 투표를 종료시킨다.
        state = State.Finished;
    }

    // 투표 결과를 확인하는 함수
    function resultVote() public onlyAdministrator inState(State.Finished) view returns (vote_paper[] memory){
        return ballot_box;
    }

    function voter_list() public onlyAdministrator inState(State.Finished) view returns (string[] memory){
        string[] memory voters = new string[](ballot_box.length);

        for(uint i=0; i<ballot_box.length; i++) {
            voters[i] = ballot_box[i].user_address;
        }
        return voters;
    }
}
