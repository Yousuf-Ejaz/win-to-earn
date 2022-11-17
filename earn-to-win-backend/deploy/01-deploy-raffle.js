const { network } = require("hardhat");
const {
	developmentChains,
	networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();
	const chainId = network.config.chainId;

	const entranceFee = networkConfig[chainId]["entranceFee"];

	const interval = networkConfig[chainId]["interval"];

	const args = [entranceFee, interval];
	const game = await deploy("Game", {
		from: deployer,
		args,
		log: true,
		waitConfirmations: network.config.blockConfirmations || 1,
	});

	if (
		!developmentChains.includes(network.name) &&
		process.env.ETHERSCAN_API_KEY
	) {
		log("Verying ...");
		await verify(game.address, args);
	}
	log("--------------------------------------------------------");
};

module.exports.tags = ["all", "game"];
