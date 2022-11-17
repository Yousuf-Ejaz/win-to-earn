import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants/index";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

function LotteryEntrance() {
	const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
	const chainId = parseInt(chainIdHex);
	const gameAddress =
		chainId in contractAddresses ? contractAddresses[chainId][0] : null;
	const [entranceFee, setEntranceFee] = useState("0");
	const [numplayers, setNumPlayers] = useState("0");
	const [recentWinner, setRecentWinner] = useState("0");

	const dispatch = useNotification();

	const {
		runContractFunction: enterGame,
		isLoading,
		isFetching,
	} = useWeb3Contract({
		abi: abi,
		contractAddress: gameAddress,
		functionName: "enterGame",
		params: {},
		msgValue: entranceFee,
	});
	const { runContractFunction: getEntranceFee } = useWeb3Contract({
		abi: abi,
		contractAddress: gameAddress,
		functionName: "getEntranceFee",
		params: {},
	});
	const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
		abi: abi,
		contractAddress: gameAddress,
		functionName: "getNumberOfPlayers",
		params: {},
	});
	const { runContractFunction: getRecentWinner } = useWeb3Contract({
		abi: abi,
		contractAddress: gameAddress,
		functionName: "getRecentWinner",
		params: {},
	});

	async function updateUI() {
		const entranceFeeFromCall = (await getEntranceFee()).toString();
		const numPlayersFromCall = (await getNumberOfPlayers()).toString();
		const recentWinnerFromCall = await getRecentWinner();
		setEntranceFee(entranceFeeFromCall);
		setNumPlayers(numPlayersFromCall);
		setRecentWinner(recentWinnerFromCall);
	}

	useEffect(() => {
		if (isWeb3Enabled) {
			updateUI();
		}
	}, [isWeb3Enabled]);

	const handleSuccess = async function (tx) {
		await tx.wait(1);
		handleNewNotification(tx);
		updateUI();
	};

	const handleNewNotification = () => {
		dispatch({
			type: "success",
			message: "Transaction Complete!",
			title: "Transaction Notification",
			position: "topR",
		});
	};

	return (
		<div className="p-5">
			Hi from Game Entrance!
			{gameAddress ? (
				<div>
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={async function () {
							await enterGame({
								onSuccess: handleSuccess,
								onError: (error) => console.log(error),
							});
						}}
						disabled={isLoading || isFetching}
					>
						{isLoading || isFetching ? (
							<div className="animate-spin spinner-border h-8 w-6 border-b-2 rounded-full"></div>
						) : (
							<div>Enter Game</div>
						)}
					</button>
					<div>
						Entrance Fee:{" "}
						{ethers.utils.formatUnits(entranceFee, "ether")} ETH
					</div>
					<div>Number of Players: {numplayers}</div>
					<div>Recent Winner: {recentWinner}</div>
				</div>
			) : (
				<div>No Game Address detected!</div>
			)}
		</div>
	);
}
export default LotteryEntrance;
