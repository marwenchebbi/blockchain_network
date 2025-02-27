const Web3 = require("web3").default; // Use standard Web3 1.x
const fs = require("fs");
const path = require("path");
require('dotenv').config();

const web3 = new Web3("http://127.0.0.1:7545");




// Load tarding contract 
const ProxymContractPath = path.join(__dirname, "build/contracts/Proxym.json");
const ProxymContractAddress = "0xBD527DB25fE8dba990ab3CF1a093326Ec44F99E1"; // Replace with the deployed address from Truffle
const ProxymcontractJSON = JSON.parse(fs.readFileSync(ProxymContractPath, "utf8"));
const ProxymcontractABI = ProxymcontractJSON.abi;

const contract = new web3.eth.Contract(ProxymcontractABI, ProxymContractAddress);

async function logBalanceOfAllAccounts(contract) {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log("Available accounts:", accounts);
        for (let i = 0; i < accounts.length; i++) {
            const balanceWei = await contract.methods.balanceOf(accounts[i]).call();
            const balancePRX = web3.utils.fromWei(balanceWei, "ether");
            console.log(`Account ${i}: ${accounts[i]} has ${balancePRX} PRX`);
        }
    } catch (error) {
        console.error("Error fetching balances:", error);
    }
}

async function transferToken(amount, contract) {
    try {
        const accounts = await web3.eth.getAccounts();
        //transfer token to the trade contract
        const sender = accounts[0];
        for (let i = 1; i < accounts.length; i++) {
            console.log(`Transferring ${amount} PRX from ${sender} to ${accounts[i]}`);
            await contract.methods
                .transfer(accounts[i], web3.utils.toWei(amount, "ether"))
                .send({ from: sender });
            console.log(`✅ Transfer successful to ${accounts[i]}`);
        }
    } catch (error) {
        console.error("Error transferring tokens:", error);
    }
}

async function getExchangeRate(contrect) {
    const rate = await contract.methods.getPrice().call();
    console.log(`the exchange rate is : ${rate}`)
}





async function main() {
  
    await logBalanceOfAllAccounts(contract);

}

main().catch(console.error);