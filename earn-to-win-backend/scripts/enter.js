const { ethers } = require("hardhat");

async function enterGame() {
	const game = await ethers.getContract("Game");
	const entranceFee = await game.getEntranceFee();
	await game.enterGame({ value: entranceFee + 1 });
	console.log("Entered!");
}

enterGame()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
