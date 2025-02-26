const Web3 = require("web3").default; // Use standard Web3 1.x
const fs = require("fs");
const path = require("path");

const web3 = new Web3("http://127.0.0.1:7545");

// Load Proxym Contract
const ProxymContractPath = path.join(__dirname, "build/contracts/MockUSDT.json");
const proxymContractAddress = "0x5045D5cc659306FC9718531820de2167475e78ee"; // Replace with the deployed address from Truffle
const ProxymcontractJSON = JSON.parse(fs.readFileSync(ProxymContractPath, "utf8"));
const ProxymcontractABI = ProxymcontractJSON.abi;

const contract = new web3.eth.Contract(ProxymcontractABI, proxymContractAddress);

async function logBalanceOfAllAccounts(contract) {
    try {
        const accounts = await web3.eth.getAccounts();


        console.log("Available accounts:", accounts);
        

        for (let i = 0; i < accounts.length; i++) {
            const balanceWei = await contract.methods.balanceOf(accounts[i]).call();
            const balancePRX = web3.utils.fromWei(balanceWei, "ether");
            console.log(`Account ${i}: ${accounts[i]} has ${balancePRX*10**12} PRX`);
        }
    } catch (error) {
        console.error("Error fetching balances:", error);
    }
}

async function transferToken(amount, contract) {
    try {
        const accounts = await web3.eth.getAccounts();
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

async function main() {
    await logBalanceOfAllAccounts(contract);
    await transferToken("0.00000001", contract); // Transfer 10000 USDT
    await logBalanceOfAllAccounts(contract);
}

main().catch(console.error);