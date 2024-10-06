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
        private static readonly string MapName = "Votes";
        private static readonly string VotersMapName = "Voters";

        public static void RegisterVoter(UInt160 voterId)
        {
            StorageMap votersMap = new StorageMap(Storage.CurrentContext, VotersMapName);
            if (votersMap.Get(voterId) != null) throw new Exception("Voter already registered");
            votersMap.Put(voterId, "registered");
        }

        public static void CastVote(UInt160 voterId, string option)
        {
            StorageMap votersMap = new StorageMap(Storage.CurrentContext, VotersMapName);
            if (votersMap.Get(voterId) == null) throw new Exception("Voter not registered");
            byte[] voteKey = ((ByteString)voterId).Concat((ByteString)option);
            if (votersMap.Get(voteKey) != null) throw new Exception("Already voted");

            StorageMap votesMap = new StorageMap(Storage.CurrentContext, MapName);
            ByteString currentVotesBytes = votesMap.Get(option);
            BigInteger currentVotes = currentVotesBytes is null ? 0 : (BigInteger)currentVotesBytes;
            votesMap.Put(option, currentVotes + 1);
            votersMap.Put(voteKey, "voted");
        }

        public static BigInteger GetVotes(string option)
        {
            StorageMap map = new StorageMap(Storage.CurrentContext, MapName);
            ByteString votes = map.Get(option);
            return votes is null ? 0 : (BigInteger)votes;
        }
    }
}