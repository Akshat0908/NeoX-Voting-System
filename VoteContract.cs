using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Services;
using System;
using System.ComponentModel;
using System.Numerics;

namespace NeoVotingApp
{
    [DisplayName("VoteContract")]
    public class VoteContract : SmartContract
    {
        private static readonly StorageMap Votes = new StorageMap(Storage.CurrentContext, "Votes");
        private static readonly StorageMap Voters = new StorageMap(Storage.CurrentContext, "Voters");
        
        public static void RegisterVoter(UInt160 voterId)
        {
            if (Voters.Get(voterId) != null) throw new Exception("Voter already registered");
            Voters.Put(voterId, "registered");
        }

        public static void CastVote(UInt160 voterId, string option)
        {
            if (Voters.Get(voterId) == null) throw new Exception("Voter not registered");
            var voteKey = ((ByteString)voterId).Concat(option);
            if (Voters.Get(voteKey) != null) throw new Exception("Already voted");

            var currentVotes = Votes.Get(option);
            BigInteger newVotes = currentVotes is null ? BigInteger.One : (BigInteger)currentVotes + 1;
            Votes.Put(option, newVotes);
            Voters.Put(voteKey, "voted");
        }

        public static BigInteger GetVotes(string option)
        {
            var votes = Votes.Get(option);
            return votes is null ? BigInteger.Zero : (BigInteger)votes;
        }
    }
}