import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import HeroArea from "@containers/hero/layout-06";

import ExploreProductArea from "@containers/explore-product/layout-02";

import ServiceArea from "@containers/services/layout-01";
import { normalizedData } from "@utils/methods";
import React, { useState } from "react";
// Demo data
import homepageData from "../data/homepages/home-06.json";
import productData from "../data/products.json";
import conf from "../configABI/config.json";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Home = () => {
    const content = normalizedData(homepageData?.content || []);
    let nowurl = null;
    let contractAvailable = false;
    let walletAddress = null;
    const [web3props, setWeb3Props] = useState({ web3: null, accounts: null, contract: null });
    const OnLogin = function(param){
		let { web3, accounts, contract } = param;
		if(web3 && accounts && accounts.length && contract){
			setWeb3Props({ web3, accounts, contract });
		}
	}
if (typeof window !== "undefined") {  
    const curr=new URL(window.location.href);
    nowurl=curr.href;
	const refaddr=curr.searchParams.get('ref');
	const mintpath = "/mint/"+curr.search;
	console.log(conf.contractaddr);
	console.log(conf.tokenaddr);
	

	// Callback function for the Login component to give us access to the web3 instance and contract functions
	
const targetNetworkId = '0x4';
	
const homepage = window.location.href;	
const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		
		window.location.assign(homepage);
	}
	
const checkNetwork = async () => {
  if (window.ethereum) {
    const currentChainId = await window.ethereum.request({
      method: 'eth_chainId',
    });
	console.log(currentChainId)
    // return true if network id is the same
    if (currentChainId !== targetNetworkId) return true;
    // return false is network id is different
    return false;
  }
};
const switchNetwork = async () => {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: targetNetworkId }],
  });
  //console.log('switch');
  // refresh
  //window.location.reload();
};	
if(window.ethereum){	
window.ethereum.on('chainChanged', chainChangedHandler);
window.ethereum.on('accountsChanged', chainChangedHandler);
if(checkNetwork()){
	//alert('please switch network');
	switchNetwork();
	//alert('please switch net');
}
}



function isMobileDevice() {
 
  return 'ontouchstart' in window || 'onmsgesturechange' in window;
}

//let contractAvailable = false;
//let walletAddress = null;
if(!isMobileDevice()){
	// If the wallet is connected, all three values will be set. Use to display the main nav below.
	 contractAvailable = !(!web3props.web3 && !web3props.accounts && !web3props.contract);
	// Grab the connected wallet address, if available, to pass into the Login component
     walletAddress = web3props.accounts ? web3props.accounts[0] : "";
} 
if(isMobileDevice() && window.ethereum){
	contractAvailable = !(!web3props.web3 && !web3props.accounts && !web3props.contract);
	// Grab the connected wallet address, if available, to pass into the Login component
     walletAddress = web3props.accounts ? web3props.accounts[0] : "";
}
}

    return (
        <Wrapper>
            <SEO pageTitle="GameVerse - NFT" />
            <Header url={nowurl} callback={OnLogin} contractaddr={conf.contractaddr} 
            connected={contractAvailable} address={walletAddress} />
            <main id="main-content">
                <HeroArea data={content["hero-section"]} />
                <ExploreProductArea
                    data={{
                        ...content["explore-product-section"],
                        products: productData,
                    }}
                />
                <ServiceArea data={content["service-section"]} />
            </main>
            <Footer />
        </Wrapper>
    );
};

export default Home;
