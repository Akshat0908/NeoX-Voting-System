export const CONTRACT_ADDRESS = '0xC34940DeC15e4066e49D2020E1A0b2e811dDb1C3'; // Replace with your actual contract address

export const contractABI = [
  // Your contract ABI goes here
  // Example:
  {
    "inputs": [],
    "name": "registerVoter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "option", "type": "string"}],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "option", "type": "string"}],
    "name": "getVotes",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "voter", "type": "address"}],
    "name": "isVoterRegistered",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];
