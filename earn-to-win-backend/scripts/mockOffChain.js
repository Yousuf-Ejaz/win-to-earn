const { ethers, network } = require("hardhat");

async function mockKeepers() {
	const game = await ethers.getContract("Game");
	const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""));
	const { upkeepNeeded } = await game.callStatic.checkUpkeep(checkData);


	if (upkeepNeeded) {
		await game.performUpkeep(checkData);

		if (network.config.chainId == 31337) {
			await finishContract(game);
		}
	} else {
		console.log("No upkeep needed!");
	}
}

async function finishContract(game) {
	const recentWinner = await game.getRecentWinner();
	console.log(`The winner is: ${recentWinner}`);
}

mockKeepers()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
