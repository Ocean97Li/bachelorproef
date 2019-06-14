pragma solidity ^0.5.8;

contract Election {
    // Store candidate
    struct Candidate {
        uint id;
        string name;
        uint votes;
    }
    //Fetch the candidates
    mapping(uint => Candidate) public candidates;
    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Read candidate
    uint public candidatesCounter;
    // Constructor
    constructor () public {
        addCadidate("Yes");
        addCadidate("No");
    }

    function addCadidate(string memory _name) private {
        candidatesCounter++;
        candidates[candidatesCounter] = Candidate(candidatesCounter,_name,0);
    }

    function vote(uint _candidateId) public {
        if(!voters[msg.sender]) {
            // Record voter has voted
            voters[msg.sender] = true;
            // Update candidate vote count
            candidates[_candidateId].votes++;
        }
    }
}
  