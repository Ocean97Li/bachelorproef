module.exports = function(callback) {
const artifacts = require('../build/contracts/Election.json');
const Web3 = require('../node_modules/web3');
const TruffleContract = require('truffle-contract') ;
const Election = TruffleContract(artifacts);
Election.setProvider(web3.currentProvider);

const web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
const web3new = new web3(web3Provider);


const vote = async function(account) {
    console.log(account);
    const votingKey = (Math.floor(Math.random() * 99) + 1).toString();
    console.log(votingKey);
    console.log('hello', web3);
    instance.register(web3new.sha3(votingKey), {from: account}).call().then(function() {
        instance.vote.call(Math.round(Math.random()+1),votingKey,{from: account}).then(
                function(){ console.log(account, 'voted')}
            ).catch(function(error) {
                console.log('catch');
                console.log(error);
            });
    }).catch(function(error) {
        console.log('catch');
        console.log(error);
    });
}

Election.deployed()
.then(function(instance) {
   
    web3.eth.getAccounts().then(function(accounts) {
        for (const account of accounts) {
            const votingKey = (Math.floor(Math.random() * 99) + 1).toString();
            console.log(web3.sha);
            const encrypted = web3.sha3(votingKey);
            console.log(web3.sha3(votingKey));
            console.log(encrypted);
            instance.register.call(encrypted, {from: account}).then(
               function() {
                   console.log('registered');
                   instance.votingKeys(account).then(function(i){console.log(i);});
                } 
            ).catch(function(error) {
                console.error(error)
            });
        }
    })
})
.catch(function(error) {
    console.error(error)
});



callback();    
}
