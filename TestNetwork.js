const Web3 = require("web3").default; // Use standard Web3 1.x
const fs = require("fs");
const path = require("path");


const web3 = new Web3("http://127.0.0.1:7545");

// Load Proxym contract 
const ProxymContractPath = path.join(__dirname, "build/contracts/Proxym.json");
const ProxymContractAddress = "0xBD527DB25fE8dba990ab3CF1a093326Ec44F99E1"; // Replace with the deployed address from Truffle
const ProxymcontractJSON = JSON.parse(fs.readFileSync(ProxymContractPath, "utf8"));
const ProxymcontractABI = ProxymcontractJSON.abi;

// Load tarding contract 
const TradeContractPath = path.join(__dirname, "build/contracts/TradeToken.json");
const TradeContractAddress = "0xc32d1cf23C173a611F0FDFfAF5b72313c5BbA665"; // Replace with the deployed address from Truffle
const TradecontractJSON = JSON.parse(fs.readFileSync(TradeContractPath, "utf8"));
const TradecontractABI = TradecontractJSON.abi;

const contract = new web3.eth.Contract(TradecontractABI, TradeContractAddress);
const proxymContract =  new web3.eth.Contract(ProxymcontractABI, ProxymContractAddress);




async function getExchangeRate(contrect) {
    const rate = await contract.methods.getPrice().call();
    console.log(`the exchange rate is : ${rate}`)
}

async function transferPRX(from, to, amount) {
    try {
        const weiAmount = web3.utils.toWei(amount, "ether");

        // Step 1: Approve the contract to spend tokens
        await proxymContract.methods
            .approve(TradeContractAddress, weiAmount)
            .send({ from });

        console.log("✅ Approval successful");

        // Step 2: Call transferToken function
        await contract.methods
            .transferToken(from, to, weiAmount)
            .send({ from });

        console.log(`✅ Transfer successful from ${from} to ${to}`);
    } catch (error) {
        console.error("❌ Transfer failed:", error);
    }
}





async function main() {
    transferPRX("0xf08797652e41CeDDd5De5C6b8484Ac2E4e9a5a40","0x992138Bc775608A644a3731309cdB12389CD80F1", "1500");

}

main().catch(console.error);

