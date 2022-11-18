import { useTimer } from "react-timer-hook";
import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants/index";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";

function MyTimer({ expiryTimestamp }) {
	const { seconds, isRunning, start, pause, resume, restart } = useTimer({
		expiryTimestamp,
		onExpire: () => console.warn("onExpire called"),
	});
	const [startFlag, setStartFlag] = useState(0);

	useEffect(() => {
		pause();
		console.log("pause called");
	}, []);

	const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
	const chainId = parseInt(chainIdHex);
	const gameAddress =
		chainId in contractAddresses ? contractAddresses[chainId][0] : null;
	const [flag, setFlag] = useState(0);

	const { runContractFunction: getFlag } = useWeb3Contract({
		abi: abi,
		contractAddress: gameAddress,
		functionName: "getFlag",
		params: {},
	});

	async function updateUI() {
		const flagFromCall = await getFlag();
		setFlag(flagFromCall);
	}

	useEffect(() => {
		if (isWeb3Enabled) {
			updateUI();
		}
	}, [isWeb3Enabled]);

	const reset = () => {
		const time = new Date();
		time.setSeconds(time.getSeconds() + 30);
		restart(time);
	};

	useEffect(() => {
		reset();
	}, [flag]);

	return (
		<>
			<button
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				disabled={startFlag}
				onClick={() => {
					if (startFlag == 0) reset();
					// console.log(flag);
					setStartFlag(1);
				}}
			>
				Start
			</button>

			{startFlag ? (
				<div style={{ textAlign: "center" }}>
					<div style={{ fontSize: "100px" }}>
						<span>00</span>:<span>{seconds}</span>:<span>00</span>
					</div>
					<p>{isRunning ? "Running" : "Not running"}</p>
				</div>
			) : (
				<div style={{ textAlign: "center" }}>
					<div style={{ fontSize: "100px" }}>
						<span>00</span>:<span>30</span>:<span>00</span>
					</div>
				</div>
			)}

			{/* <div style={{ textAlign: "center" }}>
				<div style={{ fontSize: "100px" }}>
					<span>00</span>:<span>{seconds}</span>:<span>00</span>
				</div>
				<p>{isRunning ? "Running" : "Not running"}</p>
			</div> */}
		</>
	);
}

export default function App() {
	const time = new Date();
	time.setSeconds(time.getSeconds() + 30);
	return (
		<div>
			<MyTimer expiryTimestamp={time} />
		</div>
	);
}
