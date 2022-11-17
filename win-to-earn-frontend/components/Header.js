import { ConnectButton } from "web3uikit";
function Header() {
	return (
		<div className="p-5 border-b-2 flex flex-row">
			<h1 className="p-4 font-bold text-3xl">Decentralised Game Saga</h1>
			<div className="ml-auto py-2 px-4">
				<ConnectButton moralisAuth={false} />
			</div>
		</div>
	);
}
export default Header;
