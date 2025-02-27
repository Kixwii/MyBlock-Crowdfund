import { useState, useEffect} from 'react';
import Web3 from 'web3';

function App(){

  const [isConnected, setIsConnected] = useState(false);
  const[ethBalance, setEthBalance] = useState("");

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
      const currentProvider = detectCurrentProvider();
      if(currentProvider){
        await currentProvider.request({method: 'eth_requestAccounts'});
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const account = userAccount[0];
        let ethBalance = await web3.eth.getBalance(account);
        setEthBalance(ethBalance);
        setIsConnected(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDisconnect = () => {
    setIsConnected(false);
  };

  return (

    <div className='app'>
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"></link>
      <link href="https://fonts.googleapis.com/css2?family=Lexend+Giga:wght@100..900&family=Manrope:wght@200..800&display=swap" rel="stylesheet"></link>
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