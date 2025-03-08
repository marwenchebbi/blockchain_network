const Web3 = require("web3").default; // Use standard Web3 1.x
const fs = require("fs");
const path = require("path");
require('dotenv').config();


const web3 = new Web3("http://127.0.0.1:7545");




// Load tarding contract 
const USDTContractPath = path.join(__dirname, "build/contracts/MockUSDT.json");
const USDTContractAddress = "0x3Cf665A1dc7e6C73690808F17BcDaefAF140877B"; // Replace with the deployed address from Truffle
const USDTcontractJSON = JSON.parse(fs.readFileSync(USDTContractPath, "utf8"));
const USDTcontractABI = USDTcontractJSON.abi;

const USDTcontract = new web3.eth.Contract(USDTcontractABI, USDTContractAddress);

async function logBalanceOfAllAccounts(contract) {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log("Available accounts:", accounts);
        for (let i = 0; i < accounts.length; i++) {
            const balanceWei = await contract.methods.balanceOf(accounts[i]).call();
            const balanceUSDT = web3.utils.fromWei(balanceWei, "ether");
            console.log(`Account ${i}: ${accounts[i]} has ${balanceUSDT} USDT`);
        }
        const balance = await contract.methods.balanceOf("0x4aE117BE91c9eF312dE8f852032c1Cd3562cF328").call();
        const balanceUSDT = web3.utils.fromWei(balance, "ether");
        console.log(`Trading Account  has ${balanceUSDT} USDT`);
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
            console.log(`Transferring ${amount} USDT from ${sender} to ${accounts[i]}`);
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
    const rate = await contract.methods.getRate().call();
    console.log(`the exchange rate is : ${rate}`)
}





async function main() {

    await logBalanceOfAllAccounts(USDTcontract);


}

main().catch(console.error);