const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { assert, expect } = require("chai");
const { ethers } = require('hardhat');
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

let owner, otherAccount;
let voting;

async function deployVoting() {
    const [owner, otherAccount] = await ethers.getSigners(); 
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy(); 
    return { voting, owner, otherAccount };
}

// Check functions
async function startProposalsRegistering() {
    const { voting, owner } = await loadFixture(deployVoting);
    await voting.startProposalsRegistering();
    return { voting, owner };
}

async function endProposalsRegistering() {
    const { voting, owner } = await loadFixture(startProposalsRegistering);
    await voting.endProposalsRegistering();
    return { voting, owner };
}

async function startVotingSession() {
    const { voting, owner } = await loadFixture(endProposalsRegistering);
    await voting.startVotingSession();
    return { voting, owner };
}

async function endVotingSession() {
    const { voting, owner } = await loadFixture(startVotingSession);
    await voting.endVotingSession();
    return { voting, owner };
}

async function tallyVotes() {
    const { voting, owner } = await loadFixture(endVotingSession);
    await voting.tallyVotes();
    return { voting, owner };
}

async function addVoter() {
    const { voting, owner } = await loadFixture(deployVoting);
    await voting.addVoter(owner.address);
    return { voting, owner };
}


describe("Deploying contract", function () {
    // Check owner
    it("Should set the right owner", async function () {
        const { voting, owner } = await loadFixture(deployVoting);

        expect(await voting.owner()).to.equal(owner.address);
    });

});

describe("Test workflow step", function () {
    // Check functions
    it("should start Registering", async function () {
        const { voting } = await loadFixture(startProposalsRegistering);
        // Check new status : ProposalsRegistrationStarted value is 1 
        expect(await voting.workflowStatus()).to.equal(1);
    });

    it("should end Registering", async function () {
        const { voting } = await loadFixture(endProposalsRegistering);

        // Check new status : ProposalsRegistrationEnded value is 2 
        expect(await voting.workflowStatus()).to.equal(2);
    });
    
    it("should start Voting", async function () {
        const { voting } = await loadFixture(startVotingSession);

        // Check new status : VotingSessionStarted value is 3
        expect(await voting.workflowStatus()).to.equal(3);
    });

    it("should end Voting", async function () {
        const { voting } = await loadFixture(endVotingSession);

        // Check new status : VotingSessionEnded value is 4
        expect(await voting.workflowStatus()).to.equal(4);
    });

    it("should tally Votes", async function () {
        const { voting } = await loadFixture(tallyVotes);

        // Check new status : VotesTallied value is 5
        expect(await voting.workflowStatus()).to.equal(5);
    });

    // Check revert
    it("should not be a voter", async function () {
        const { voting } = await loadFixture(deployVoting);

        await expect(voting.setVote(1)).to.be.revertedWith("You're not a voter");
    });

    // Check status change
    it("Should emit an event on startProposalsRegistering", async function () {
        const { voting } = await loadFixture(deployVoting);

        await expect(voting.startProposalsRegistering())
        .to.emit(voting, "WorkflowStatusChange")
        .withArgs(0, 1); 
    });
});

describe("Set and Get a voter", function () {
    // Check functions
    it("should return a voter registered", async function () {
        const { voting, owner } = await loadFixture(deployVoting);
        await voting.addVoter(owner.address);
        //await voting.addVoter(otherAccount[0]);
        
        let voter = await voting.getVoter(owner.address);

        expect(voter.isRegistered).to.equal(true);
    });

});


describe("Submit and vote a Proposal", function () {
    it("should return a winning Proposal", async function () {
        const { voting, owner, otherAccount } = await loadFixture(deployVoting);
        await voting.addVoter(owner.address);
        await voting.addVoter(otherAccount.address);

        await voting.startProposalsRegistering();
        await voting.addProposal("Proposition A");
        await voting.connect(otherAccount).addProposal("Proposition B");
        await voting.endProposalsRegistering();
        await voting.startVotingSession();
        await voting.setVote(1);
        await voting.connect(otherAccount).setVote(1);     
        await voting.endVotingSession();
        
        await voting.tallyVotes();
        expect(await voting.winningProposalID()).to.equal(1);
    });
});
