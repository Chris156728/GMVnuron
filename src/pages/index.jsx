import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import HeroArea from "@containers/hero/layout-06";

import ExploreProductArea from "@containers/explore-product/layout-02";

import ServiceArea from "@containers/services/layout-01";
import { normalizedData } from "@utils/methods";
import Web3 from "web3";
import React, { useState,useEffect } from 'react';
// Demo data
import homepageData from "../data/homepages/home-06.json";
import productData0 from "../data/products-org.json";
import productData from "../data/products.json";
//import productData1 from "../data/products-02.json";



const minABI = [
      // balanceOf
      {
        "constant":true,
        "inputs":[{"name":"_owner","type":"address"}],
        "name":"balanceOf",
        "outputs":[{"name":"balance","type":"uint256"}],
        "type":"function"
      },
      // decimals
      {
        "constant":true,
        "inputs":[],
        "name":"decimals",
        "outputs":[{"name":"","type":"uint8"}],
        "type":"function"
      },
      {
        "constant": false,
        "inputs": [{name: "_to",type: "address",},{name: "_value",type: "uint256",},],
        "name": "transfer",
        "outputs": [{name: "",type: "bool",},],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
      },
      {
        "constant": false,
        "inputs": [{name: "usr",type: "address",},{name: "wad",type: "uint256",},],
        "name": "approve",
        "outputs": [{name: "",type: "bool",},],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
      },
	  {
        "constant": false,
        "inputs": [{name: "usr",type: "address",},{name: "wad",type: "uint256",},],
        "name": "allowance",
        "outputs": [{name: "allowance",type: "uint256",},],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
      },
	  
	  //{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
	  
    ];


export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Home = () => {
    //let props = null;
    let contractAvailable = false;
    const [web3props, setWeb3Props] = useState(null);
    useEffect(() => {
      // When title or name changed will render
      console.log('render');
      if(web3props)CheckAssetURIs();
     // okmint=!(!web3props.web3 && !web3props.accounts && !web3props.contract);
  }, [web3props])
    const content = normalizedData(homepageData?.content || []);
    const gow3props = function(param){
        console.log("goweb3props");
        let props = param;
        if(!web3props){
          setWeb3Props(props);
          //props = param;
        
        }
      }

   

  let imgbase = 'https://ipfs.io/ipfs/QmVaaDwixStwnwrYFaQ4hNf9LVfKiHwFZ7A2bWS8KFccA2/';
	const [assetURIs, setAssetURIs] = useState(productData);
  
  let okmint = false;
	const CheckAssetURIs = async () => {
		let uris = [];
    
		// For this demo there are only 4 assets, named sequentially. 
		for(let idx = 1; idx <= 10; idx++ ){
      
			let base ="/images/portfolio/lg/";// 'ipfs://QmU8V6P1kcwPrCvdVbkDpEvgn4uxUMWRwU3Tz3cGmvsNN3/';
      let base0 = "";
			let ext = idx+".json";//'/token_data/exobit_'+idx+'.json';
			let uri= base0+ext;
			let pid = 0;//props.tokenprice[1];
      let ptmp = null;
			// Call the contract and get the id of the uri. If the uri doesn't belong to a token, it will return 0.
			//console.log("idx",idx);
      let tokenId = await web3props.contract.methods.tokenByUri(uri).call();
      //console.log("idx",idx);
			// The token ID comes in as a string. "0" means that uri is not associated with a token.
		  if(tokenId === "0") {
        ptmp = JSON.parse(JSON.stringify(productData0));//Object.assign({}, productData0);
        ptmp.id = idx;
        ptmp.images[0].src=base+idx+".jpg";
        ptmp.price.amount=1000;
        ptmp.price.currency="USDT";
        ptmp.pid =pid;
        ptmp.tkid = 1;
        console.log("pro0",ptmp);
        
        uris.push(ptmp);
        
      } 
        
		}
    //console.log("uris",uris);
    console.log("productdata",productData);
		// Update the list of available asset URIs
    //okmint = true;
		if(uris.length) setAssetURIs([...uris]);


	}

 
    return (
        <Wrapper>
            <SEO pageTitle="GameVerse - NFT" />
            <Header callb={gow3props} />
            <main id="main-content">
                <HeroArea data={content["hero-section"]} />
                <ExploreProductArea
                    data={{
                        ...content["explore-product-section"],
                        products: assetURIs,
                        placeBid: true,
                    }}
                />
                <ServiceArea data={content["service-section"]} />
            </main>
            <Footer />
        </Wrapper>
    );
};

export default Home;
