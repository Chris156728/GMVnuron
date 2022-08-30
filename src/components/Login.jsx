//import React from "react";
import Web3 from "web3";
import React, { useState,useEffect } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { useWeb3React } from "@web3-react/core";
//import { Web3ReactProvider } from '@web3-react/core'
//import { Web3Provider } from "@ethersproject/providers";
import ExobitsABI from "../configABI/ReExoBits.json";
import { stepConnectorClasses } from "@mui/material";


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
	const {
		library,
		chainId,
		account,
		activate,
		deactivate,
		active
	  } = useWeb3React();

	  /*const [conn, setConn] = useState(null);
	  const walletconnect = new WalletConnectConnector({
		rpcUrl: "https://mainnet.infura.io/v3/f0060938825d4f74b5c3c8e6a5aadcaf",
		bridge: "https://bridge.walletconnect.org",
		qrcode: true
	  });
	  useEffect(async () => {
		//if(window.ethereum){
			//DoConnect();
			//return <button className="login" onClick={DoConnect}>Connect Wallet</button>;
		//} else {
			
		await activate(walletconnect);
		let { provider } = await walletconnect.activate();
		let web3 = new Web3(provider);
		await window.ethereum.request({ method: 'eth_requestAccounts' })
			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();
			
			// Get an instance of the contract sop we can call our contract functions
			const instance = new web3.eth.Contract(
				ExobitsABI, 
				contractAddress
			);
			props.callback({ web3, accounts, contract: instance });
		//}
	  },[conn]);*/
	const DoConnect = async () => {

		console.log('Connecting....');
		try {
			// Get network provider and web3 instance.
			let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
			if(!window.ethereum){
			
				const provider = new WalletConnectProvider({
					rpc: {
					  1: "https://mainnet.infura.io/v3/",
					  3: "https://ropsten.infura.io/v3/",
					  137: "https://polygon-rpc.com",
					  80001: "https://matic-mumbai.chainstacklabs.com"
					  // ...
					},
					qrcode: true
				  });
				  
				  //  Enable session (triggers QR Code modal)
				await provider.enable();

				/*const walletconnect = new WalletConnectConnector({
					rpcUrl: "https://mainnet.infura.io/v3/f0060938825d4f74b5c3c8e6a5aadcaf",
					bridge: "https://bridge.walletconnect.org",
					qrcode: true
				  });
				  await activate(walletconnect);
				  let { provider } = await walletconnect.activate();
				  alert("acc:"+account)*/
			   web3 = new Web3(provider);
			   const accounts = await web3.eth.getAccounts();
			   alert("accs:"+accounts)
			   const instance = new web3.eth.Contract(
				ExobitsABI, 
				contractAddress
			);
			props.callback({ web3, accounts, contract: instance });
			  //let web3 = null;
			  //setConn(web3);
			} else {
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
			}

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
			/*return <a href={metamaskAppDeepLink}>
				<button color="primary-alta"
			className="connectBtn"
			size="small">Connect Wallet</button></a>;*/
			return <button onClick={DoConnect} color="primary-alta"
			className="connectBtn"
			size="small">Connect Wallet</button>;
			//DoConnect();
		}			
	}
	// Display the wallet address. Truncate it to save space.
	return <button color="primary-alta"
		className="connectBtn"
		size="small">{props.address.slice(0,6)}</button>;
	}
	else {
		if(!props.connected) {
			return <button color="primary-alta"
			className="connectBtn"
			size="small">Connect Wallet</button>; 
		} else {
			return <button color="primary-alta"
			className="connectBtn"
			size="small">{props.address.slice(0,6)}</button>;
		}
	}
}