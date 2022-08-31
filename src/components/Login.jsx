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

let provider = null;
let web3 = null;
let currentChainId = null;
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

	  const [connflag, setConnflag] = useState(true);
	  
	 //let provider = null;
	 //let web3 = null;
	 //let currentChainId = null;
	  const Disconnect =async () => {
		//await provider.disconnect()
		window.localStorage.setItem("provider", undefined);
		
		setConnflag(false);
		location.reload();
	  }; 
	const DoConnect = async () => {

		console.log('Connecting....');
		try {
			// Get network provider and web3 instance.
			//let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
			if(!window.ethereum){
			
				 provider = new WalletConnectProvider({
					rpc: {
					  1: "https://mainnet.infura.io/v3/",
					  3: "https://ropsten.infura.io/v3/",
					  137: "https://polygon-rpc.com",
					  80001: "https://matic-mumbai.chainstacklabs.com"
					  // ...
					},
					//qrcode: true
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
				  //alert("acc:"+account)*/

				 web3 = new Web3(provider);
			   const accounts = await web3.eth.getAccounts();
			   //currentChainId = await web3.eth.getChainId();
			  // alert("accs:"+accounts)
			   const instance = new web3.eth.Contract(
				ExobitsABI, 
				contractAddress
			);
			props.callback({ web3, accounts, contract: instance });
			provider.on("accountsChanged", chainChangedHandler);
			provider.on("chainChanged", chainChangedHandler);  

			} else {
			// Request account access if needed
			 web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
			await window.ethereum.request({ method: 'eth_requestAccounts' })
			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();
			// currentChainId = await web3.eth.getChainId();
			 //console.log("chainID:", currentChainId);
			// Get an instance of the contract sop we can call our contract functions
			const instance = new web3.eth.Contract(
				ExobitsABI, 
				contractAddress
			);
			props.callback({ web3, accounts, contract: instance });
			}
			window.localStorage.setItem("provider", "conn");
		} catch (error) {
			// Catch any errors for any of the above operations.
			setConnflag(false);
			window.localStorage.setItem("provider", undefined);
			console.error("Could not connect to wallet.", error);
		}
	};
	
	function isMobileDevice() {
 
		return 'ontouchstart' in window || 'onmsgesturechange' in window;
	  }
	  const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		location.reload();
		
	}  
	const targetNetworkId = 137;
	const checkNetwork = async () => {
		
		  // return true if network id is the same
		  if(web3){
		  currentChainId = await web3.eth.getChainId();
		  if (currentChainId !== targetNetworkId) {
			console.log("NO networkmatch:", currentChainId, targetNetworkId);
			return true;
		}
		console.log("networkmatch");
			}
		  
		  // return false is network id is different
		  return false;
		
	  };
	  const switchNetwork = async () => {
		if(provider){
			try {	
				await provider.request({
		  		method: 'wallet_switchEthereumChain',
		 		 params: [{ chainId: targetNetworkId }],
				});
			} catch (switchError) {
				alert(switchError.message);
			}
		//console.log('switch');
		// refresh
		//window.location.reload();
	  };
	}
	// If not connected, display the connect button.
	//console.log("NO networkmatch:", currentChainId, targetNetworkId);
	if(checkNetwork() && isMobileDevice()){
		//alert('please switch network');
		switchNetwork();
		//alert('please switch net');
	}
	const conn = window.localStorage.getItem("provider");
	if(!props.connected || conn!=="conn") {
		//const conn = window.localStorage.getItem("provider");
		console.log("conn:",conn);
		if(conn === "conn"){
			DoConnect();
		} else {
			if(!window.ethereum && !isMobileDevice()){
				return <a href={metamaskAppDeepLink}>
				<button color="primary-alta"
				className="connectBtn"
				size="small">Connect Wallet</button></a>
			} else {
				return <button onClick={DoConnect} color="primary-alta"
				className="connectBtn"
				size="small">Connect Wallet</button>;
			}
		}
		if(window.ethereum){
			//DoConnect();
			//return <button className="login" onClick={DoConnect}>Connect Wallet</button>;
		} else {
			/*return <a href={metamaskAppDeepLink}>
				<button color="primary-alta"
			className="connectBtn"
			size="small">Connect Wallet</button></a>;*/
			
		}			
	}
	// Display the wallet address. Truncate it to save space.
	return <button onClick={Disconnect} color="primary-alta"
		className="connectBtn"
		size="small">{props.address.slice(0,6)}</button>;
	}
	else {
		if(!props.connected) {
			return <button color="primary-alta"
			className="connectBtn"
			size="small">Connect Wallet</button>; 
		} else {
			return <button onClick={Disconnect} color="primary-alta"
			className="connectBtn"
			size="small">{props.address.slice(0,6)}</button>;
		}
	}
}