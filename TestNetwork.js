const Web3 = require("web3").default; // Use standard Web3 1.x
const fs = require("fs");
const path = require("path");


const web3 = new Web3("http://127.0.0.1:7545");

// Load Proxym contract 
const ProxymContractPath = path.join(__dirname, "build/contracts/Proxym.json");
const ProxymContractAddress = "0x3b7494967E48e46fC7c4747B14c3cC607b44aEd3"; // Replace with the deployed address from Truffle
const ProxymcontractJSON = JSON.parse(fs.readFileSync(ProxymContractPath, "utf8"));
const ProxymcontractABI = ProxymcontractJSON.abi;

// Load tarding contract 
const TradeContractPath = path.join(__dirname, "build/contracts/TradeToken.json");
const TradeContractAddress = "0x4aE117BE91c9eF312dE8f852032c1Cd3562cF328"; // Replace with the deployed address from Truffle
const TradecontractJSON = JSON.parse(fs.readFileSync(TradeContractPath, "utf8"));
const TradecontractABI = TradecontractJSON.abi;

// Load USDT  contract 
const UsdtContractPath = path.join(__dirname, "build/contracts/MockUSDT.json");
const UsdtContractAddress = "0x3Cf665A1dc7e6C73690808F17BcDaefAF140877B"; // Replace with the deployed address from Truffle
const UsdtcontractJSON = JSON.parse(fs.readFileSync(UsdtContractPath, "utf8"));
const UsdtcontractABI = UsdtcontractJSON.abi;

//create instances of the contracts
const contract = new web3.eth.Contract(TradecontractABI, TradeContractAddress);
const proxymContract = new web3.eth.Contract(ProxymcontractABI, ProxymContractAddress);
const usdtContract = new web3.eth.Contract(UsdtcontractABI, UsdtContractAddress)

global.rate = 0;


async function getExchangeRate(contract) {
    const newRate = await contract.methods.getRate().call();
    console.log(`the exchange rate is : ${newRate}`)
    rate=newRate;
}

async function setExchangeRate(newRate,contract) {
     await contract.methods
    .setRate(newRate)
    .send({from: "0x13823F18e24e93Cd46D5b3B2486ddb5A7F360ea7"});

    console.log('Price updated successfully !!!')
}

async function transferToken(from, to, amount) {
    try {
        const weiAmount = web3.utils.toWei(amount, "ether");
        // Step 1: Approve the contract to spend tokens
        approveTransaction(from,proxymContract,TradeContractAddress,weiAmount);
        // Step 2: Call transferToken function
        await contract.methods
            .transferToken(from, to, weiAmount)
            .send({ from });

        console.log(`✅ Transfer successful from ${from} to ${to}`);
    } catch (error) {
        console.error("❌ Transfer failed:", error);
    }
}

async function transferUSDT(from, to, amount) {
    try {
        const weiAmount = web3.utils.toWei(amount, "ether");
        // Step 1: Approve the contract to spend tokens
        approveTransaction(from,usdtContract,TradeContractAddress,weiAmount);
        // Step 2: Call transferToken function
        await contract.methods
            .transferUSDT(from, to, weiAmount)
            .send({ from });

        console.log(`✅ Transfer successful from ${from} to ${to}`);
    } catch (error) {
        console.error("❌ Transfer failed:", error);
    }
}





// implement the logic for buying tokens
async function buyPRX(from, amount) {
    try {
        const weiAmount = web3.utils.toWei(amount, "ether");
        // Step 1: Approve the contracts(Proxym and USDT) to spend tokens
        approveTransaction(from,usdtContract,TradeContractAddress,weiAmount);
        approveTransaction(from,proxymContract,TradeContractAddress,weiAmount*rate);//i need to change the 100 by the exchange rate if it is dynamic !!!

        // Step 2: Call transferToken function
        await contract.methods
            .buyTokens(from,weiAmount)
            .send({ from });

        console.log(`✅ Buy successful from ${from} `);
    } catch (error) {
        console.error("❌ Buy failed:", error);
    }
}
async function sellPRX(from, amount) {
    try {
        const weiAmount = web3.utils.toWei(amount, "ether");
        // Step 1: Approve the contracts(Proxym and USDT) to spend tokens
        approveTransaction(from,usdtContract,TradeContractAddress,weiAmount/rate);
        approveTransaction(from,proxymContract,TradeContractAddress,weiAmount);//i need to change the 100 by the exchange rate if it is dynamic !!!

        // Step 2: Call sellTokens function
        await contract.methods
            .sellTokens(from,weiAmount)
            .send({ from });

        console.log(`✅ Sell successful from ${from} `);
    } catch (error) {
        console.error("❌ Sell failed:", error);
    }
}





async function main() {
    //transferToken("0x13823F18e24e93Cd46D5b3B2486ddb5A7F360ea7","0x4aE117BE91c9eF312dE8f852032c1Cd3562cF328","100000");
    //transferUSDT("0x13823F18e24e93Cd46D5b3B2486ddb5A7F360ea7","0x4aE117BE91c9eF312dE8f852032c1Cd3562cF328","1000");

    //await buyPRX("0x13823F18e24e93Cd46D5b3B2486ddb5A7F360ea7","100");//buying 1500 tokens
    //setExchangeRate(150,contract);
    await getExchangeRate(contract);
    //sellPRX("0x13823F18e24e93Cd46D5b3B2486ddb5A7F360ea7","1500");//selling 1500 tokens 
    
}

main().catch(console.error);









async function approveTransaction(from,contract, AddressToApprove,weiAmount) {

    try {
        // Approve the contract to spend tokens
        await contract.methods
            .approve(AddressToApprove, weiAmount)
            .send({ from });
        console.log("✅ Approval successful");
    }
    catch (error) {
        console.error("❌ Transfer failed:", error);


    }
}