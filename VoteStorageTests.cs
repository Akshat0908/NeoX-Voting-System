using Neo.SmartContract.Testing;
using System;
using Xunit;
using Neo.VM;

namespace VotingPlatform.Tests
{
    public class VoteStorageTests : SmartContractTest
    {
        [Fact]
        public void TestRegisterVoter()
        {
            var contract = LoadContract("VoteStorage.nef");
            var voter = GetDefaultAccount(0);

            // Test registering a new voter
            var result = contract.Test("RegisterVoter", voter.ScriptHash);
            Assert.True(result.Success);

            // Test registering the same voter again (should fail)
            result = contract.Test("RegisterVoter", voter.ScriptHash);
            Assert.False(result.Success);
        }

        [Fact]
        public void TestCastVote()
        {
            var contract = LoadContract("VoteStorage.nef");
            var voter = GetDefaultAccount(0);

            // Register voter first
            contract.Test("RegisterVoter", voter.ScriptHash);

            // Test casting a vote
            var result = contract.Test("CastVote", voter.ScriptHash, "A");
            Assert.True(result.Success);

            // Test casting a second vote (should fail)
            result = contract.Test("CastVote", voter.ScriptHash, "B");
            Assert.False(result.Success);
        }

        [Fact]
        public void TestGetVotes()
        {
            var contract = LoadContract("VoteStorage.nef");
            var voter1 = GetDefaultAccount(0);
            var voter2 = GetDefaultAccount(1);

            // Register voters and cast votes
            contract.Test("RegisterVoter", voter1.ScriptHash);
            contract.Test("RegisterVoter", voter2.ScriptHash);
            contract.Test("CastVote", voter1.ScriptHash, "A");
            contract.Test("CastVote", voter2.ScriptHash, "B");

            // Test getting votes
            var resultA = contract.Test("GetVotes", "A");
            Assert.Equal(1, resultA.Stack.Pop().GetInteger());

            var resultB = contract.Test("GetVotes", "B");
            Assert.Equal(1, resultB.Stack.Pop().GetInteger());
        }
    }
}