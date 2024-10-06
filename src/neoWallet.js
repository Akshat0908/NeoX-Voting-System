import Neon, { wallet } from "@cityofzion/neon-js";

export const connectWallet = async () => {
  if (typeof window.NEOLine !== 'undefined') {
    try {
      const instance = new window.NEOLine.Init();
      const account = await instance.getAccount();
      return new wallet.Account(account.address);
    } catch (error) {
      console.error('Error connecting to NEOLine wallet:', error);
      throw error;
    }
  } else {
    throw new Error('NEOLine wallet not found. Please install the NEOLine extension.');
  }
};

export const signAndSendTransaction = async (account, script) => {
  const instance = new window.NEOLine.Init();
  const config = {
    scriptHash: script.scriptHash,
    operation: script.operation,
    args: script.args,
    fee: '0.001',
    broadcastOverride: false,
    signers: [
      {
        account: account.scriptHash,
        scopes: 1
      }
    ]
  };

  try {
    const result = await instance.invoke(config);
    return result;
  } catch (error) {
    console.error('Error signing and sending transaction:', error);
    throw error;
  }
};