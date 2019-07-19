pragma solidity ^0.5.8;

contract Election {
    // The admin 
    address public admin;
    
    // Store candidate
    struct Candidate {
        uint id;
        string name;
        uint votes;
    }
    
    //Fetch the candidates
    mapping(uint => Candidate) public candidates;
    // Store accounts that have voted
    mapping(address => bool) public votedVoters;
    // Store accounts that have registered
    mapping(address => bool) public registeredVoters;
    // Registered voters keys
     mapping(address => bytes32) public votingKeys;
     // Key attempts
     mapping(address => uint) private keyAttempVoters;
    // Read candidate
    mapping(address => bool) private strikes;
    // Read candidate
    uint public candidatesCounter;

    bytes32 public check;
    string public input;

    // Constructor
    constructor () public {
        addCadidate("Yes");
        addCadidate("No");
        admin = msg.sender;
    }

    modifier onlyAdmin {
        require(
            msg.sender == admin,
            "Sender not authorized."
        );
        _;
    }

    modifier honestUser {
        require(
            checkForStrikes(msg.sender),
            "Sender not honest!"
        );
        _;
    }

    function addCadidate(string memory _name) honestUser private {
        candidatesCounter++;
        candidates[candidatesCounter] = Candidate(candidatesCounter,_name,0);
    }

    function vote(uint _candidateId, string memory _key) public payable honestUser {
        if (!votedVoters[msg.sender] && registeredVoters[msg.sender]) {
            if(keccak256(abi.encodePacked(_key))==votingKeys[msg.sender]) {
                // Record voter has voted
                votedVoters[msg.sender] = true;
                // Update candidate vote count
                candidates[_candidateId].votes++;
            }
        }
    }

    function hasRegistered() honestUser public view returns (bool registered) {
        return registeredVoters[msg.sender]==true;
    }

    function hasVoted() honestUser public view returns (bool voted) {
        return votedVoters[msg.sender]==true;
    }

    function isAdmin() honestUser public view returns (bool wasAdmin) {
        return msg.sender == admin;
    }

    function register(bytes32 _key) public payable honestUser {
        keyAttempVoters[msg.sender] = keyAttempVoters[msg.sender]+1;
        votingKeys[msg.sender] = _key;
        registeredVoters[msg.sender] = true;
    }

    function checkForStrikes(address _sender) private view returns (bool ok) {
        if(keyAttempVoters[_sender]>1) {
            return false;
        }
        if(strikes[_sender]) {
            return false;
        }
        return true;
    }

}
  