Version
=======
> solidity-coverage: v0.8.12

Instrumenting for coverage...
=============================

> Voting.sol

Compilation:
============

Compiled 3 Solidity files successfully (evm target: paris).

Network Info
============
> HardhatEVM: v2.22.4
> network:    hardhat



  Deploying contract
    ✔ Should set the right owner (76ms)

  Test workflow step
    ✔ should start Registering
    ✔ should end Registering
    ✔ should start Voting
    ✔ should end Voting
    ✔ should tally Votes
    ✔ should not be a voter
    ✔ Should emit an event on startProposalsRegistering

  Set and Get a voter
    ✔ should return a voter registered

  Submit and vote a Proposal
    ✔ should return a winning Proposal (44ms)


  10 passing (196ms)

-------------|----------|----------|----------|----------|----------------|
File         |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-------------|----------|----------|----------|----------|----------------|
 contracts/  |    96.67 |    54.17 |    91.67 |    97.73 |                |
  Voting.sol |    96.67 |    54.17 |    91.67 |    97.73 |             58 |
-------------|----------|----------|----------|----------|----------------|
All files    |    96.67 |    54.17 |    91.67 |    97.73 |                |
-------------|----------|----------|----------|----------|----------------|

> Istanbul reports written to ./coverage/ and ./coverage.json