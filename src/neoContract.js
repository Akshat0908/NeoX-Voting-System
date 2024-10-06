import { contractABI, CONTRACT_ADDRESS } from './contractConfig';

export const registerVoter = async (web3, account) => {
  const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
  try {
    await contract.methods.registerVoter().send({ from: account });
    return { success: true, message: 'Voter registered successfully' };
  } catch (error) {
    console.error('Error in registerVoter:', error);
    if (error.message.includes('Voter already registered')) {
      return { success: false, message: 'Voter already registered' };
    }
    return { success: false, message: 'Failed to register voter' };
  }
};

export const castVote = async (web3, account, option) => {
  const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
  try {
    await contract.methods.vote(option).send({ from: account });
    return { success: true, message: 'Vote cast successfully' };
  } catch (error) {
    console.error('Error in castVote:', error);
    return { success: false, message: 'Failed to cast vote' };
  }
};

export const getVotes = async (web3, option) => {
  const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
  try {
    const votes = await contract.methods.getVotes(option).call();
    return parseInt(votes);
  } catch (error) {
    console.error('Error in getVotes:', error);
    return 0;
  }
};

export const isVoterRegistered = async (web3, account) => {
  const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
  try {
    return await contract.methods.isVoterRegistered(account).call();
  } catch (error) {
    console.error('Error checking voter registration:', error);
    return false;
  }
};