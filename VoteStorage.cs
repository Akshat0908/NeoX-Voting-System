using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Services;
using System;
using System.ComponentModel;

namespace VotingPlatform
{
    [ManifestExtra("Author", "Your Name")]
    [ManifestExtra("Email", "your.email@example.com")]
    [ManifestExtra("Description", "A simple voting smart contract")]
    public class VoteStorage : SmartContract
    {
        private static readonly string MapName = "Votes";

        public static void RegisterVoter(UInt160 voterId)
        {
            if (!Runtime.CheckWitness(voterId)) throw new Exception("Not authorized");
            var key = $"voter:{voterId}";
            if (Storage.Get(Storage.CurrentContext, key) != null) throw new Exception("Voter already registered");
            Storage.Put(Storage.CurrentContext, key, "registered");
        }

        public static void CastVote(UInt160 voterId, string choice)
        {
            if (!Runtime.CheckWitness(voterId)) throw new Exception("Not authorized");
            var voterKey = $"voter:{voterId}";
            if (Storage.Get(Storage.CurrentContext, voterKey) == null) throw new Exception("Voter not registered");
            if (Storage.Get(Storage.CurrentContext, $"vote:{voterId}") != null) throw new Exception("Already voted");
            
            Storage.Put(Storage.CurrentContext, $"vote:{voterId}", choice);
            var currentVotes = (int)Storage.Get(Storage.CurrentContext, choice).ToInt32();
            Storage.Put(Storage.CurrentContext, choice, currentVotes + 1);
        }

        public static int GetVotes(string choice)
        {
            return (int)Storage.Get(Storage.CurrentContext, choice).ToInt32();
        }
    }
}