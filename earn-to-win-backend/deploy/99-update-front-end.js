const { ethers } = require("hardhat");
const fs = require("fs");

const FRONT_END_ADDRESSES_FILE =
	"../win-to-earn-frontend/constants/contractAddresses.json";
const FRONT_END_ABI_FILE = "../win-to-earn-frontend/constants/abi.json";

module.exports = async function () {
	if (process.env.UPDATE_FRONT_END) {
		console.log("Updating Front End");
		updateContractAddresses();
		updateAbi();
	}
};

async function updateAbi() {
	const game = await ethers.getContract("Game");
	fs.writeFileSync(
		FRONT_END_ABI_FILE,
		game.interface.format(ethers.utils.FormatTypes.json)
	);
}

async function updateContractAddresses() {
	const game = await ethers.getContract("Game");
	const chainId = network.config.chainId.toString();
	const currentAddresses = JSON.parse(
		fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8")
	);

	if (chainId in currentAddresses) {
		if (!currentAddresses[chainId].includes(game.address))
			currentAddresses[chainId].push(game.address);
	} else {
		currentAddresses[chainId] = [game.address];
	}
	fs.writeFileSync(
		FRONT_END_ADDRESSES_FILE,
		JSON.stringify(currentAddresses)
	);
}
module.exports.tags = ["all", "frontend"];
