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
    // Store accounts that have registered
    mapping(address => bool) private registeredVoters;
    // Store accounts that have voted
    mapping(address => bool) private votedVoters;
    // Read candidate
    uint public candidatesCounter;
    // Read voter
    // Regristration complete
    bool public regristrationComplete;

    // Stores the encryption requests value
    uint public encryptionRequestCounter;
    // Stores the total encryption value
    int256 public encryptionValueCounter;

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

    function addCadidate(string memory _name) private {
        candidatesCounter++;
        candidates[candidatesCounter] = Candidate(candidatesCounter,_name,0);
    }

    function vote(uint _candidateId) public {
        if(!hasVoted()) {
            // Record voter has voted
            votedVoters[msg.sender] = true;
            // Update candidate vote count
            candidates[_candidateId].votes++;
        }
    }

    function hasVoted() public view returns (bool voted) {
        return votedVoters[msg.sender];
    }

    function isAdmin() public view returns (bool wasAdmin) {
        return msg.sender == admin;
    }

    function registerVoters(address[] memory _voters) public onlyAdmin {
        if (!regristrationComplete) {
            for (uint index = 0; index < _voters.length; index++) {
                registeredVoters[_voters[index]] = true;
            }
        }
    }

    function register() public returns (uint registrationRandom) {
        // generate random value betweeen -6*candidates counter and 6*candidates counter
        
        // add the random value to the counter
        // return the random value
    }

    // get a 'seemingly random' number
    // Source: https://ethereum.stackexchange.com/questions/60684/i-want-get-random-number-between-100-999-as-follows#answer-60687
    function generateRandom(uint trueRandom) public payable returns (uint randomNumber) {
        uint randomnumber1 = uint(keccak256(abi.encodePacked(now, msg.sender,trueRandom))) % 900;
        randomnumber1 = randomnumber1 + 100;
        uint randomnumber2 = uint(keccak256(abi.encodePacked(now, msg.sender,trueRandom))) % 2;
        randomNumber = (randomnumber % 11) * (randomnumber2 * -1);
        encryptionValueCounter += randomNumber;
        return randomNumber;
    }

}
  