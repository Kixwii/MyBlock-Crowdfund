import { useState, useEffect} from 'react';
import Web3 from 'web3';

function App(){

  const [isConnected, setIsConnected] = useState(false);
  const[ethBalance, setEthBalance] = useState("");
  const[transactionMessage, setTransactionMessage] = useState("");

  const detectCurrentProvider = () => {
    let provider;

    if(window.ethereum){
      provider = window.ethereum;
    } else if(window.web3){
      provider = window.web3.currentProvider;
    } else {
      console.log('No web3? You should consider installing MetaMask!');
    }
    return provider;
  };

  const onConnect = async() => {

    try{
      setTransactionMessage("Connecting to MetaMask...");

      const currentProvider = detectCurrentProvider();
      if(currentProvider){
        await currentProvider.request({method: 'eth_requestAccounts'});
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const account = userAccount[0];
        let ethBalance = await web3.eth.getBalance(account);
        setEthBalance(ethBalance);
        setIsConnected(true);

        setTransactionMessage(`✅ Connected! Account: ${account}`);

        //Listen for new transactions
        web3.eth.subscribe('pendingTransactions', (error, txHash) => {
          if(!error){
            setTransactionMessage(`🟡 New transaction detected: ${txHash}`);
          }
        });
      }
    } catch (error) {
      setTransactionMessage(`❌ Connection failed: ${error.message}`);
    }
  };

  const onDisconnect = () => {
    setIsConnected(false);
  };

  const sendTransaction = async () => {
    try{
      setTransactionMessage("⏳ Sending transaction...");

      const currentProvider = detectCurrentProvider();
      if(currentProvider){
        const web3 = new Web3(currentProvider);
        const accounts = await web3.eth.getAccounts();
        const sender = accounts[0];

        const transaction = {
          from: sender,
          to:0xd5037F23Bf95073e340daa9EB89Bc1774e66Cd33,
          value: web3.utils.toWei('0.01', 'ether'),
          gas: 21000,
        };

        web3.eth.sendTransaction(transaction)
        .on('transcationHash', (hash) => {
          setTransactionMessage(`📡 Transaction sent!: ${hash}`);
        })
        .on("receipt", (receipt) => {
          setTransactionMessage(`✅ Transaction Confirmed! Block: ${receipt.blockNumber}`);
        })
        .on("error", (error) => {
          setTransactionMessage(`❌ Transaction failed: ${error.message}`);
        });
      }
    } catch (error) {
      setTransactionMessage(`❌ Error: ${error.message}`);
    }

  };

  return (

    <div className='app'>
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"></link>
      <link href="https://fonts.googleapis.com/css2?family=Lexend+Giga:wght@100..900&family=Manrope:wght@200..800&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"></link>
      <div className='app-header'>
      </div>

      <div className='app-wrapper'>
        {!isConnected && (
          <div>
            <h1>MyBlock, A blockchain crowdfunding platform</h1>
              <button className='app-button_login' onClick={onConnect}>
              Login
              </button>
          </div>
        )}
      </div>
      {isConnected && (
        <div className='app-wrapper'>
          <div className='app-details'>
            <h2>You are connected to MetaMask!</h2>
            <div className='app-messages'>
              {transactionMessage && <p>{transactionMessage}</p>}
            </div>
            <div className='app-balance'>
              <span>Balance: </span>
              {ethBalance}
            </div>
          </div>
          <div>
            <button className='app-button_logout' onClick={onDisconnect}>
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;