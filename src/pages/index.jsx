import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import HeroArea from "@containers/hero/layout-06";

import ExploreProductArea from "@containers/explore-product/layout-02";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import ServiceArea from "@containers/services/layout-01";
import { normalizedData } from "@utils/methods";
import Web3 from "web3";
import React, { useState,useEffect } from 'react';

// Demo data
import homepageData from "../data/homepages/home-06.json";
//import productData0 from "../data/products-org.json";
import productData from "../data/product-init.json";
//import productData1 from "../data/products-02.json";
import conf from "../configABI/config.json";
import minABI from "../configABI/usd.json";




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
      if(web3props){
        
        CheckAssetURIs();
      }
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

   

  //let imgbase = 'https://ipfs.io/ipfs/QmVaaDwixStwnwrYFaQ4hNf9LVfKiHwFZ7A2bWS8KFccA2/';
	const [assetURIs, setAssetURIs] = useState(productData);
  const [uris, setUris] = useState([]);
  const [cnt, setCnt] = useState(1);
  const [bckd, setBckd] = useState(false);
  let okmint = false;
	const CheckAssetURIs = async () => {
		//let uris = [];
    if(!web3props) return;
    setBckd(true);
    let idx = cnt;
		// For this demo there are only 4 assets, named sequentially. 
		for( idx =cnt; idx <= cnt+19; idx++ ){
      
			let base ="https://gameverse.mypinata.cloud/ipfs/QmQMuSVAYoAUAZq8oH1XM6jX3LVLhQd7WjJ6v3jbKaojxC/";
      //"/images/portfolio/lg/";// 'ipfs://QmU8V6P1kcwPrCvdVbkDpEvgn4uxUMWRwU3Tz3cGmvsNN3/';
      let base0 = "";
			let ext = idx+".json";//'/token_data/exobit_'+idx+'.json';
			let uri= base0+ext;
			let pid = idx%4;//props.tokenprice[1];
      let ptmp = null;
			// Call the contract and get the id of the uri. If the uri doesn't belong to a token, it will return 0.
			//console.log("idx",idx);
      let tokenId = await web3props.contract.methods.tokenByUri(uri).call();
      //console.log("idx",idx);
			// The token ID comes in as a string. "0" means that uri is not associated with a token.
		  if(tokenId === "0") {
        let it = idx%10;
        
        ptmp = JSON.parse(JSON.stringify(productData[it]));//Object.assign({}, productData0);
        ptmp.id = idx;
        ptmp.title = "GameVerse #"+idx;
        ptmp.images[0].src=base+idx+".jpg";
        ptmp.price.amount=conf.tokentype[pid].price;
        ptmp.price.currency="USDT";
        ptmp.pid =pid;
        ptmp.tkid = 0;
        ptmp.bitCount=conf.tokentype[pid].gp;
        ptmp.latestBid=conf.tokentype[pid].lckprd+" Days";
        ptmp.tkuri = uri;
        ptmp.categories[0]=conf.tokentype[pid].price+" USDT";
        ptmp.categories[1]=conf.tokentype[pid].lckprd+" Days";
        ptmp.categories[2]=conf.tokentype[pid].gp+" GPower";
        //console.log("pro0",ptmp);
        
        uris.push(ptmp);
        
      } 
        
		}
    console.log("uris",uris)
    //console.log("uris",uris);
    //console.log("productdata",productData);
		// Update the list of available asset URIs
    //okmint = true;
    console.log(uris?.length);
    setUris(uris);
    if(idx<200){
      //setCnt1(cnt);
      setCnt(cnt+20);
    }
    else
      setCnt(0); 
		if(uris.length) setAssetURIs([...uris]);

    setBckd(false);
	}
let tkid =0;

  const DoMint = async (tokenURI,pid) => {
    
    if(web3props!==null){
     setBckd(true);
		const contractAddress = web3props.contractaddr;//"0x7a7b4757543987dD07936D473Ead236ebcdc4999";
		const nAddress = "0x0000000000000000000000000000000000000000";
		const web3 = new Web3(window.web3.currentProvider);
    const tokenAddress = web3props.tokenaddr[tkid];
		const usdc = new web3.eth.Contract(minABI, tokenAddress);
		console.log(contractAddress);
		console.log('minting: ', tokenURI,pid);

    

    
	//	gomint:try{
			// Estimate the gas required for the transaction
			//console.log('caddress', contractAddress, 'waddress', props.address);
			let refaddr = web3props.refaddr;
			//var valid = WAValidator.validate(props.ref, 'ETH');
			let valid = Web3.utils.isAddress(refaddr)
			if(refaddr!=null){
				
				if(!valid) {
					alert("referral address format not valid")
					window.location.assign(web3props.url);
          setBckd(false);
          return;
				//	break gomint;
				}	
				if(refaddr==web3props.address){
					alert("Can not refer yourself");
					window.location.assign("/");
          setBckd(false);
          return;
				//	break gomint;
				}
			}
			else {
				refaddr = nAddress;
			}
			
			try{
			let uresult = await usdc.methods.approve(contractAddress, web3props.tokenprice[pid].price*1e6).send({ from: web3props.address })
			console.log('uresult', uresult);
      /*if(uresult.message ==="MetaMask Tx Signature: User denied transaction signature.") {
        setBckd(false);
        return;
      }*/
    }catch(e){
      console.error('There was a problem while minting', e);
      setBckd(false);
      alert(e.message);
      return;
      //if(e.message !=="MetaMask Tx Signature: User denied transaction signature.") alert(e.message);

    }
			try{
			let gasLimit = await web3props.contract.methods.CustomMint(tokenURI,refaddr,pid,tkid).estimateGas(
				{ 
					from: web3props.address, 
					value: 8000000000000000000
				}
			);
      }catch(e){
        console.error('There was a problem while minting', e);
        setBckd(false);
        alert(e.message);
        return;
        //if(e.message !=="MetaMask Tx Signature: User denied transaction signature.") alert(e.message);
  
      }
			// Call the mint function.
			try{
			let result = await web3props.contract.methods.CustomMint(tokenURI,refaddr,pid,tkid)
				.send({ 
					from: web3props.address, 
					value: 8000000000000000000,
					// Setting the gasLimit with the estimate accuired above helps ensure accurate estimates in the wallet transaction.
					gasLimit: gasLimit
				});
      }catch(e){
        console.error('There was a problem while minting', e);
        setBckd(false);
        alert(e.message);
        return;
        //if(e.message !=="MetaMask Tx Signature: User denied transaction signature.") alert(e.message);
  
      }
			// Output the result for the console during development. This will help with debugging transaction errors.
			console.log('result', result);

			// Refresh the gallery
      //setCnt(cnt1);
			//CheckAssetURIs();
      window.location.assign("/explore-04");

	/*	}catch(e){
			console.error('There was a problem while minting', e);
      setBckd(false);
      if(e.message !=="MetaMask Tx Signature: User denied transaction signature.") alert(e.message);

		}*/
  } else {
    alert("Please connect your wallet");
  }
  setBckd(false);
	};

 
    return (
        <Wrapper>
            <SEO pageTitle="GameVerse - NFT" />
            <Header callb={gow3props} />
            <main id="main-content">
                <HeroArea data={content["hero-section"]} />
                {bckd && <>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={open}
                    
                  >
                  <CircularProgress color="inherit" />
                </Backdrop>
                </>
                }
                <ExploreProductArea
                    data={{
                        ...content["explore-product-section"],
                        products: assetURIs,
                        placeBid: true
                    }}
                    domint={DoMint}
                    chkuri={CheckAssetURIs}
                    cnt={cnt}
                />
                
            </main>
            <Footer />
        </Wrapper>
    );
};

export default Home;
