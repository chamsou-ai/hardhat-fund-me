# Hardhat FundMe Project
This project implements a simple crowdfunding platform called "FundMe" using Hardhat. Users can contribute funds to a campaign, and the owner can withdraw the collected funds.
## Project Structure

### contracts:
This directory contains the Solidity smart contract for the FundMe project (```FundMe.sol```).
### scripts:
This directory contains scripts for interacting with the deployed contract ```(fund.js for contributing funds and withdraw.js for withdrawing funds).```
### tests:
This directory contains unit tests for the ```FundMe.sol``` contract.
### hardhat.config.js: 
This file configures the Hardhat development environment.
## Getting Started
## Prerequisites:
```Node.js``` and npm (or yarn) installed on your system.
## Installation:
Clone this repository:
```bash
git clone https://github.com/chamsou-ai/hardhat-fund-me-fcc.git
```
Navigate to the project directory:
```bash
cd  hardhat-fund-me-fcc
```
Install dependencies:

```bash
npm install  # or yarn
```
## Running Tests
Run the tests to ensure the contract works as expected:
```bash
yarn test
```
Optionally, you can run the tests with gas reporting:
```bash
REPORT_GAS=true yarn test
```

## Deploying the Contract

### Note :
 Deploying to a testnet or mainnet requires setting up an appropriate provider and funding the deployer account.  Do not deploy to a public network with funds you're not comfortable losing.
 
 ## Development Environment:

Start a local development network:

```bash
yarn hardhat node
```
Deploy the contract to the local network:
```bash
yarn hardhat deploy --network localhost  # Assuming you have a deploy script
```

## Interacting with the Contract

### Scripts are provided for interacting with the deployed contract:

``` fund.js ``` : Allows contributing funds to a campaign.
``` withdraw.js ``` : Enables the owner to withdraw collected funds.

## Deployment Information:

You'll need the contract address and deployer account private key to use these scripts. These details will be available after deployment (check the console output or network explorer).

### Example Usage:
 (Replace placeholders with actual values)

 ```bash
 yarn hardhat run scripts/fund.js --contract <contract_address> --value <amount_in_wei>
 ```
 ## Further Exploration:

 Explore the ```FundMe.sol``` contract and understand its functionalities.
Modify and extend the scripts provided for more complex interactions.
Consider deploying to a testnet for a more realistic development environment.