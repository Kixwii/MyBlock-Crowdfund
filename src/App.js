import { useState, useEffect } from 'react';
import Web3 from 'web3';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [ethBalance, setEthBalance] = useState("");
  const [transactionMessage, setTransactionMessage] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);

  const detectCurrentProvider = () => {
    let provider;

    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      console.log('No web3? You should consider installing MetaMask!');
    }
    return provider;
  };

  const onConnect = async () => {
    try {
      setTransactionMessage("Connecting to MetaMask...");

      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const account = userAccount[0];
        let ethBalance = await web3.eth.getBalance(account);
        setEthBalance(ethBalance);
        setIsConnected(true);

        setTransactionMessage(`✅ Connected! Account: ${account}`);

        // Listen for new transactions
        web3.eth.subscribe('pendingTransactions', (error, txHash) => {
          if (!error) {
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
    try {
      setTransactionMessage("⏳ Sending transaction...");

      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        const web3 = new Web3(currentProvider);
        const accounts = await web3.eth.getAccounts();
        const sender = accounts[0];

        const transaction = {
          from: sender,
          to: "0xd5037F23Bf95073e340daa9EB89Bc1774e66Cd33", // Fixed: Added quotes around the address
          value: web3.utils.toWei('0.01', 'ether'),
          gas: 21000,
        };

        web3.eth.sendTransaction(transaction)
          .on('transactionHash', (hash) => { // Fixed: corrected property name from 'transcationHash'
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

  const handleNoMetaMask = () => {
    setShowSignUp(true);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    // Here you would normally handle the sign-up process
    // For now, we'll just show a message
    setTransactionMessage("✅ Sign-up successful! Now install MetaMask to continue.");
    
    // Redirect to MetaMask download page after a short delay
    setTimeout(() => {
      window.open("https://metamask.io/download/", "_blank");
    }, 3000);
  };

  return (
    <div className='app'>
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"></link>
      <link href="https://fonts.googleapis.com/css2?family=Lexend+Giga:wght@100..900&family=Manrope:wght@200..800&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"></link>
      <div className='app-header'>
      </div>

      <div className='app-wrapper'>
        {!isConnected && !showSignUp && (
          <div>
            <h1>MyBlock, A blockchain crowdfunding platform</h1>
            <button className='app-button_login' onClick={onConnect}>
              Login with MetaMask
            </button>
            <div className="no-metamask-section">
              <p>Don't have MetaMask?</p>
              <button className='app-button_signup' onClick={handleNoMetaMask}>
                Sign Up
              </button>
            </div>
          </div>
        )}

        {showSignUp && !isConnected && (
          <div className="signup-form-container">
            <h2>Create Your Account</h2>
            <p>Please sign up to use MyBlock. You'll need to install MetaMask afterward.</p>
            <form onSubmit={handleSignUp}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter your email" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Create a password" required />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" placeholder="Confirm your password" required />
              </div>
              <button type="submit" className="app-button_signup">
                Create Account
              </button>
            </form>
            <div className="back-option">
              <button onClick={() => setShowSignUp(false)} className="app-button_back">
                <span className="arrow-left">←</span>
              </button>
            </div>
            <div className="metamask-info">
              <p>After creating your account, you'll need to install MetaMask to interact with the blockchain.</p>
              <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
                Learn more about MetaMask
              </a>
            </div>
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