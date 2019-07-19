module.exports = function(callback) {
const artifacts = require('../build/contracts/Election.json');
// const Web3 = require('../node_modules/web3');
const TruffleContract = require('truffle-contract') ;
const Election = TruffleContract(artifacts);
Election.setProvider(web3.currentProvider);

// const web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
// const web3new = new web3(web3Provider);


const vote = async function(account, instance) {
    const votingKey = (Math.floor(Math.random() * 99) + 1).toString();
    console.log(account, votingKey, web3.utils.sha3(votingKey));
    instance.register(web3.utils.sha3(votingKey), {from: account}).then(function() {
        console.log('here');
        instance.vote(1,votingKey,{from: account}).then(
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


console.log(web3.utils.sha3('1'));
Election.deployed()
.then(function(instance) {
    web3.eth.getAccounts().then(function(accounts) {
        for (const account of accounts) {
            setTimeout(() => {
                vote(account, instance);
            },1000);
        }
    })
})
.catch(function(error) {
    console.error(error)
});



callback();    
}
