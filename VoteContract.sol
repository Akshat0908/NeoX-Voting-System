pragma solidity ^0.8.0;

contract VoteContract {
    mapping(address => bool) public voters;
    mapping(string => uint256) public votes;

    function registerVoter() public {
        require(!voters[msg.sender], "Voter already registered");
        voters[msg.sender] = true;
    }

    function castVote(string memory option) public {
        require(voters[msg.sender], "Voter not registered");
        votes[option]++;
    }

    function getVotes(string memory option) public view returns (uint256) {
        return votes[option];
    }
}