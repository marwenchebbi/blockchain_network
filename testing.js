const Web3 = require("web3").default;
const web3 = new Web3("http://127.0.0.1:8545");


web3.eth.getAccounts().then(accounts => web3.eth.getBalance('0x0813f216f517151cbf19cfc7a93376a4e3a23fea').then(balance => console.log(balance)))