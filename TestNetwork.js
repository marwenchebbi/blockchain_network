
const { web3, proxymContract, tradeContract, usdtContract, PROXYM_CONTRACT_ADDRESS, TRADE_CONTRACT_ADDRESS, USDT_CONTRACT_ADDRESS } = require("./Config/contracts");



async function getPrice(contract) {
    try {
        // Fetch the price from the contract
        const exchangeRate = await contract.methods.getPrice().call();

        // Convert it to a human-readable format
        const formattedRate = Number(exchangeRate) / 1e18; // Convert from wei-like precision

        // Log the exchange rate
        console.log(`The exchange rate is: ${formattedRate}`);

        return formattedRate;
    } catch (error) {
        console.error("Error fetching exchange rate:", error.message);
        throw error;
    }
}





async function transferToken(from, to, amount) {
    try {
        const weiAmount = web3.utils.toWei(amount, "ether");
        await approveTransaction(from, proxymContract, TRADE_CONTRACT_ADDRESS, weiAmount);
        await tradeContract.methods.transferToken(from, to, weiAmount).send({ from });
        console.log(`✅ Transfer successful from ${from} to ${to}`);
    } catch (error) {
        console.error("❌ Transfer failed:", error);
    }
}

async function transferUSDT(from, to, amount) {
    try {
        const weiAmount = web3.utils.toWei(amount, "ether");
        await approveTransaction(from, usdtContract, TRADE_CONTRACT_ADDRESS, weiAmount);
        await tradeContract.methods.transferUSDT(from, to, weiAmount).send({ from });
        console.log(`✅ Transfer successful from ${from} to ${to}`);
    } catch (error) {
        console.error("❌ Transfer failed:", error);
    }
}

async function buyTokens(from, usdtAmount) {
    try {
        const weiAmount = web3.utils.toWei(usdtAmount, "ether");
        await approveTransaction(from, usdtContract, TRADE_CONTRACT_ADDRESS, weiAmount);
        await tradeContract.methods.buyTokens(weiAmount).send({ from });
        console.log(`✅ Buy successful from ${from}`);
    } catch (error) {
        console.error("❌ Buy failed:", error);
    }
}

async function sellTokens(from, prxAmount) {
    try {
        const weiAmount = web3.utils.toWei(prxAmount, "ether");
        await approveTransaction(from, proxymContract, TRADE_CONTRACT_ADDRESS, weiAmount);
        await tradeContract.methods.sellTokens(weiAmount).send({ from });
        console.log(`✅ Sell successful from ${from}`);
    } catch (error) {
        console.error("❌ Sell failed:", error);
    }
}


async function approveTransaction(from, contract, addressToApprove, weiAmount) {
    try {
        await contract.methods.approve(addressToApprove, weiAmount).send({ from });
        console.log("✅ Approval successful");
    } catch (error) {
        console.error("❌ Approval failed:", error);
    }
}

// create new account 
async function createAccount(password) {
    try {
        // Check if web3 is available
        if (typeof web3 !== 'undefined') {
            const accounts = await web3.eth.personal.newAccount(password);
            console.log('Account created successfully:', accounts);
            return accounts; // Return the new account address
        } else {
            console.log('error accessing the blockchain server');
            return null;
        }
    } catch (error) {
        console.error('Error creating account:', error);
        return null;
    }
}


//get the account details
async function getAccountDetails(account) {
    try {
      // Check if web3 is available
      if (typeof web3 !== 'undefined') {
        // Fetch account balance
        const balance = await proxymContract.methods.balanceOf(account).call();
        console.log(`Balance of account ${account}:`, web3.utils.fromWei(balance, 'ether'), 'ETH');
  
        // You can fetch other details like transactions using web3 or a blockchain explorer API.
        // For example, getting transaction count:
        const transactionCount = await web3.eth.getTransactionCount(account);
        console.log(`Transaction count of account ${account}:`, transactionCount);
  
        // Return all details as an object
        return {
          balance: web3.utils.fromWei(balance, 'ether'), // Convert balance to ETH
          transactionCount: transactionCount
        };
      } else {
        console.log('Web3 is not available. Please install a Web3 provider like MetaMask.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching account details:', error);
      return null;
    }
  }
  





async function main() {
    //await transferUSDT("0x13823F18e24e93Cd46D5b3B2486ddb5A7F360ea7",TRADE_CONTRACT_ADDRESS,"1000");
    //await transferToken("0x13823F18e24e93Cd46D5b3B2486ddb5A7F360ea7",TRADE_CONTRACT_ADDRESS,"100000") // i need to fix it i have to unlock the account for some minutes
    //await getAccountDetails("0x5FA9081C46C64DDA31bae32d33879Ba9E9DFa1B7");
   //await buyPRX("0x13823F18e24e93Cd46D5b3B2486ddb5A7F360ea7","100");
   //await sellTokens("0x13823F18e24e93Cd46D5b3B2486ddb5A7F360ea7","10000")
    await getPrice(tradeContract);
    await createAccount('0808');
    
}


main().catch(console.error);

