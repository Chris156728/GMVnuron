import React from "react";
import Web3 from "web3";

import ExobitsABI from "../configABI/ReExoBits.json";

export default function Login(props) {
	if (typeof window !== "undefined") {
	const curr=props.url;//props.url;//window.location.href;
	const contractAddress = props.contractaddr;//"0x7a7b4757543987dD07936D473Ead236ebcdc4999";
	const dappUrl = curr.substring(8); //"young-paper-9976.on.fleek.co/?x=123"; //window.location.hostname;//
	console.log(dappUrl);
	console.log(props.connected);
	console.log(props.address);
			// TODO enter your dapp URL. For example: https://uniswap.exchange. (don't enter the "https://")
	const metamaskAppDeepLink = "https://metamask.app.link/dapp/" + dappUrl;
	const DoConnect = async () => {

		console.log('Connecting....');
		try {
			// Get network provider and web3 instance.
			const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
			// Request account access if needed
			await window.ethereum.request({ method: 'eth_requestAccounts' })
			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();
			// Get an instance of the contract sop we can call our contract functions
			const instance = new web3.eth.Contract(
				ExobitsABI, 
				contractAddress
			);
			props.callback({ web3, accounts, contract: instance });

		} catch (error) {
			// Catch any errors for any of the above operations.
			console.error("Could not connect to wallet.", error);
		}
	};
	
	// If not connected, display the connect button.
	if(!props.connected) {
		if(window.ethereum){
			DoConnect();
			//return <button className="login" onClick={DoConnect}>Connect Wallet</button>;
		} else {
			return <a href={metamaskAppDeepLink}>
				<button color="primary-alta"
			className="connectBtn"
			size="small">Connect Wallet</button></a>;
		}			
	}
	// Display the wallet address. Truncate it to save space.
	return <button color="primary-alta"
		className="connectBtn"
		size="small">{props.address.slice(0,6)}</button>;
	}
	else {
		return <button color="primary-alta"
		size="small">Connect Wallet</button>; 
	}
}