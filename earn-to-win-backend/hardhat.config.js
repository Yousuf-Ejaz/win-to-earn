require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

module.exports = {
	defaultNetwork: "hardhat",
	networks: {
		hardhat: {
			chainId: 31337,
			blockConfirmations: 1,
		},
		localhost: {
			chainId: 31337,
		},
		goerli: {
			url: GOERLI_RPC_URL,
			accounts: [PRIVATE_KEY],
			chainId: 5,
			blockConfirmations: 6,
		},
	},
	etherscan: {
		apiKey: {
			goerli: ETHERSCAN_API_KEY,
		},
	},
	gasReporter: {
		enabled: false,
		currency: "USD",
		outputFile: "gas-report.txt",
		noColors: true,
		// coinmarketcap: process.env.COINMARKETCAP_API_KEY,
	},
	// contractSizer: {
	//     runOnCompile: false,
	//     only: ["Raffle"],
	// },
	namedAccounts: {
		deployer: {
			default: 0, // here this will by default take the first account as deployer
			1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
		},
		player: {
			default: 1,
		},
	},
	solidity: {
		compilers: [
			{
				version: "0.8.7",
			},
			{
				version: "0.4.24",
			},
		],
	},
	mocha: {
		timeout: 500000, // 500 seconds max for running tests
	},
};
