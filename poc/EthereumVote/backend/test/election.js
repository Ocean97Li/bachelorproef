var Election = artifacts.require("./Election.sol");
contract("Election", function(accounts){
    var electionInstance;

    it("Initializes two candidates", function() {
        return Election.deployed().then(function(instance){
            return instance.candidatesCounter();
        }).then(function(count){
            assert.equal(count,2);
        });
    });

    it("Initializes yes and no", function() {
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(function(candidate){
            assert.equal(candidate[0],1,"has the correct id: 1");
            assert.equal(candidate[1],"Yes","has the correct value: 'Yes'");
            assert.equal(candidate[2],0,"has the correct amount of votes: 0");
            return electionInstance.candidates(2);
        }).then(function(candidate){
            assert.equal(candidate[0],2,"has the correct id: 2");
            assert.equal(candidate[1],"No","has the correct value: 'No'");
            assert.equal(candidate[2],0,"has the correct amount of votes: 0");
        });
    });
});
