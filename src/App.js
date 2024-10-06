import React, { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import { registerVoter, castVote, getVotes, isVoterRegistered } from './neoContract';
import LandingPage from './LandingPage';
import './App.css';
import { FaVoteYea, FaClipboardCheck, FaHistory, FaInfoCircle } from 'react-icons/fa';

function App() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [votesA, setVotesA] = useState(0);
  const [votesB, setVotesB] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [balance, setBalance] = useState('0');
  const [notification, setNotification] = useState(null);
  const [voteCast, setVoteCast] = useState(null);

  const fetchVotes = useCallback(async (web3Instance) => {
    try {
      const votesForA = await getVotes(web3Instance, 'A');
      const votesForB = await getVotes(web3Instance, 'B');
      console.log('Votes for A:', votesForA);
      console.log('Votes for B:', votesForB);
      setVotesA(votesForA);
      setVotesB(votesForB);
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        
        const chainId = await web3Instance.eth.getChainId();
        const isNeoXTestnet = chainId === '0xbab104'; // Updated chain ID
        setIsCorrectNetwork(isNeoXTestnet);
        
        console.log('Connected to chain ID:', chainId);
        console.log('Is Neo X Testnet T4:', isNeoXTestnet);

        if (!isNeoXTestnet) {
          console.log('Please switch to Neo X Testnet T4 in MetaMask');
          showNotification('Please switch to Neo X Testnet T4 in MetaMask', 'error');
        } else {
          const balance = await web3Instance.eth.getBalance(accounts[0]);
          const balanceInGAS = web3Instance.utils.fromWei(balance, 'ether');
          setBalance(balanceInGAS);
          console.log('Balance:', balanceInGAS, 'GAS');
          showNotification(`Connected to Neo X Testnet T4. Balance: ${balanceInGAS} GAS`, 'success');
          await fetchVotes(web3Instance);
        }

        window.ethereum.on('accountsChanged', (newAccounts) => {
          setAccount(newAccounts[0]);
          fetchVotes(web3Instance);
        });

        window.ethereum.on('chainChanged', () => {
          console.log('Network changed');
          window.location.reload();
        });

      } catch (error) {
        console.error("User denied account access or error occurred:", error);
        showNotification("Error connecting to wallet", 'error');
      }
    } else {
      console.log('Please install MetaMask!');
      showNotification('Please install MetaMask!', 'error');
    }
  }, [fetchVotes]);

  const disconnectWallet = () => {
    setAccount(null);
    setWeb3(null);
    setIsCorrectNetwork(false);
  };

  const handleRegisterVoter = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await registerVoter(web3, account);
      if (result.success) {
        setIsRegistered(true);
        console.log('Voter registered successfully');
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error registering voter:', error);
      setError('Failed to register voter. Please try again.');
    }
    setIsLoading(false);
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const checkVoterRegistration = useCallback(async () => {
    if (web3 && account) {
      const registered = await isVoterRegistered(web3, account);
      setIsRegistered(registered);
    }
  }, [web3, account]);

  useEffect(() => {
    if (web3 && account) {
      fetchVotes(web3);
    }
  }, [web3, account, fetchVotes]);

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  useEffect(() => {
    checkVoterRegistration();
  }, [checkVoterRegistration]);

  const fetchActualChainId = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        const chainId = await web3.eth.getChainId();
        console.log('Actual Chain ID:', chainId);
        console.log('Actual Chain ID (hex):', '0x' + chainId.toString(16));
        return chainId;
      } catch (error) {
        console.error('Error fetching chain ID:', error);
      }
    }
  };

  const switchToNeoXTestnet = async () => {
    try {
      const actualChainId = await fetchActualChainId();
      const chainIdHex = '0x' + actualChainId.toString(16);
      
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: chainIdHex,
          chainName: 'Neo X Testnet T4',
          nativeCurrency: {
            name: 'GAS',
            symbol: 'GAS',
            decimals: 18
          },
          rpcUrls: ['https://neoxt4seed1.ngd.network'],
          blockExplorerUrls: ['https://neoxt4scan.ngd.network/']
        }],
      });
      
      // After adding the network, switch to it
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });

      // Update the connection status
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      const accounts = await web3Instance.eth.getAccounts();
      setAccount(accounts[0]);
      setIsCorrectNetwork(true);
      
      // Fetch balance and votes
      const balance = await web3Instance.eth.getBalance(accounts[0]);
      const balanceInGAS = web3Instance.utils.fromWei(balance, 'ether');
      setBalance(balanceInGAS);
      await fetchVotes(web3Instance);
      
      showNotification(`Connected to Neo X Testnet T4. Balance: ${balanceInGAS} GAS`, 'success');
    } catch (error) {
      console.error('Error switching to Neo X Testnet T4:', error);
      showNotification(`Error switching network: ${error.message || 'Unknown error'}`, 'error');
    }
  };

  const checkNetworkDetails = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        const chainId = await web3.eth.getChainId();
        console.log('Actual Chain ID:', chainId);
        const networkId = await web3.eth.net.getId();
        console.log('Actual Network ID:', networkId);
      } catch (error) {
        console.error('Error checking network details:', error);
      }
    }
  };

  const updateVoteCounts = async () => {
    const optionAResult = await getVotes(web3, 'A');
    const optionBResult = await getVotes(web3, 'B');
    
    if (optionAResult.success && optionBResult.success) {
      setVotesA(optionAResult.votes);
      setVotesB(optionBResult.votes);
    } else {
      console.error("Error fetching votes:", optionAResult.message || optionBResult.message);
    }
  };

  const handleEnterApp = () => {
    setShowLandingPage(false);
  };

  const handleRegister = () => {
    setIsRegistered(true);
  };

  const handleVote = (option) => {
    setVoteCast(option);
  };

  if (showLandingPage) {
    return <LandingPage onEnterApp={handleEnterApp} />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Neo X Voting</h1>
        <p className="app-tagline">Secure Blockchain Voting</p>
        <div className="wallet-info">
          {account ? (
            <>
              <span className="address">{account.slice(0, 6)}...{account.slice(-4)}</span>
              {balance && <span className="balance">{balance} GAS</span>}
              <button className="btn btn-disconnect" onClick={disconnectWallet}>Disconnect</button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={connectWallet}>Connect to MetaMask</button>
          )}
        </div>
      </header>
      
      <div className="network-status">
        <span className="status-text">Neo X Testnet T4</span>
        <div className="network-actions">
          <button className="btn btn-network" onClick={switchToNeoXTestnet}>Switch Network</button>
          <button className="btn btn-network" onClick={checkNetworkDetails}>Network Details</button>
        </div>
      </div>
      
      <main className="app-main">
        {!isRegistered ? (
          <section className="card voter-registration">
            <h2><FaClipboardCheck /> Register to Vote</h2>
            <button className="btn btn-primary" onClick={handleRegister}>
              Register Now
            </button>
          </section>
        ) : (
          <section className="card cast-vote">
            <h2><FaVoteYea /> Cast Your Vote</h2>
            <div className="voting-options">
              <div className="option">
                <div className="option-icon">A</div>
                <h3>Proposal A</h3>
                <button 
                  className={`btn btn-vote ${voteCast === 'A' ? 'voted' : ''}`} 
                  onClick={() => handleVote('A')}
                  disabled={voteCast !== null}
                >
                  Vote for A
                </button>
                <div className="vote-bar-container">
                  <div className="vote-bar" style={{width: `${(votesA) / (votesA + votesB || 1) * 100}%`}}></div>
                </div>
                <p className="vote-count">Votes: {votesA}</p>
              </div>
              <div className="option">
                <div className="option-icon">B</div>
                <h3>Proposal B</h3>
                <button 
                  className={`btn btn-vote ${voteCast === 'B' ? 'voted' : ''}`} 
                  onClick={() => handleVote('B')}
                  disabled={voteCast !== null}
                >
                  Vote for B
                </button>
                <div className="vote-bar-container">
                  <div className="vote-bar" style={{width: `${(votesB) / (votesA + votesB || 1) * 100}%`}}></div>
                </div>
                <p className="vote-count">Votes: {votesB}</p>
              </div>
            </div>
          </section>
        )}
        
        <section className="card voting-history">
          <h2><FaHistory /> Your Voting History</h2>
          <ul className="history-list">
            <li>Previous Vote: Proposal A (2023-05-01)</li>
            <li>First Vote: Proposal B (2023-04-15)</li>
          </ul>
        </section>
        
        <section className="card about-project">
          <h2><FaInfoCircle /> About the Project</h2>
          <p>Neo X Voting is a secure, transparent, and decentralized voting platform built on the Neo blockchain. Our goal is to revolutionize digital democracy by leveraging cutting-edge technology.</p>
        </section>
      </main>
      
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <footer className="App-footer">
        <p>© 2024 Neo X Voting App. All rights reserved.</p>
      </footer>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default App;