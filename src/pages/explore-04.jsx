import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
import ExploreProductArea from "@containers/explore-product/layout-08";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Web3 from "web3";
import React, { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js'
// Demo data
import productData from "../data/products.json";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Home02 = () => {
    const [web3props1, setWeb3Props1] = useState(null);
    let sw =false;
    useEffect(() => {
      // When title or name changed will render
      console.log('effect');
      if(web3props1){
        console.log('render');
        GetUserTokens();
      }
     // okmint=!(!web3props.web3 && !web3props.accounts && !web3props.contract);
  }, [web3props1])
    
    const gow3props = function(param){
        console.log("goweb3props");
        let props = param;
        if(!web3props1){
          setWeb3Props1(props);
          //props = param;
        
        }
      }

      const [bckd, setBckd] = useState(false);
      const [assetURIs1, setAssetURIs1] = useState([]);
      const GetUserTokens = async () => {
		console.log('gettoken');
        setBckd(true);
		const userTokens = await web3props1.contract.methods.tokensOfOwner(web3props1.address).call();
		let uripfx = 'https://gameverse.mypinata.cloud/ipfs/';
		//if(!userTokens || !userTokens.length) return;
        console.log(userTokens);
		let tokens = [];
		
		// Taking advantage of the fact that token IDs are an auto-incrementing integer starting with 1.
		// Starting with userTokens and counting down to 1 gives us the tokens in order of most recent.
		for(let id of userTokens){
            let ptmp = null;
			try{
				// Get the metadata URI associated with the token
				let tokenURI = await web3props1.contract.methods.tokenURI(id).call();
				// Fetch the json metadata the token points to
				console.log('nftid',id);
				let nftinfo = await web3props1.contract.methods.getNFTinfo(id, web3props1.address).call();
				console.log(nftinfo);
				let response = await fetch(uripfx+tokenURI.substring(7));
				let metaData = await response.json();
				// Add the image url if available in the metadata.
				let imguri = uripfx + metaData.image.substring(7);
                ptmp = JSON.parse(JSON.stringify(productData[id]));
                ptmp.id = id;
                //ptmp.title = "id:"+id+"-"+metaData.name;
                ptmp.title = metaData.name;
                ptmp.images[0].src=imguri;
                
                let date = new Date(nftinfo[0]*1e3);
                let dtmp=date.toLocaleDateString();
                ptmp.auction_date=dtmp;//.replace("/","-");
                ptmp.bitCount=nftinfo[4];
                let earn = nftinfo[1]*nftinfo[5]/10000;
                ptmp.slug=earn.toString();
                ptmp.price.amount=nftinfo[5];
                ptmp.latestBid=nftinfo[6]+" Days";
                ptmp.price.currency="USDT";
                ptmp.tkid = 0;
                console.log("pro0",ptmp);
				if(metaData && metaData.image)
					tokens.push(ptmp);//metaData.image);
			}catch(e){
				// Either the contract call or the fetch can fail. You'll want to handle that in production.
				console.error('Error occurred while fetching metadata.')
				continue;
			}
		}

		// Update the list of available asset URIs
		if(tokens.length) {
            sw=true;
            setAssetURIs1([...tokens])
        };

        setBckd(false);
	};

    const getGP = async (idx) => {
		//const contractAddress = "0x4C32F7e1cA4F24d936110e17248587b2093F74c4";
		console.log('claim: ', idx);
        setBckd(true);
		try{
			// Estimate the gas required for the transaction
			//console.log('caddress', contractAddress, 'waddress', props.address);
			
			//let uresult = await usdc.methods.approve(contractAddress, 1000001).send({ from: props.address })
			//console.log('uresult', uresult);
			let gasLimit = await web3props1.contract.methods.gptransfer(idx,0).estimateGas(
				{ 
					from: web3props1.address, 
					value: BigNumber(10000000000000000)
				}
			);
			// Call the mint function.
			
			let result = await web3props1.contract.methods.gptransfer(idx,0)
				.send({ 
					from: web3props1.address, 
					value: BigNumber(10000000000000000),
					// Setting the gasLimit with the estimate accuired above helps ensure accurate estimates in the wallet transaction.
					gasLimit: gasLimit
				});

			// Output the result for the console during development. This will help with debugging transaction errors.
			console.log('result', result);

			// Refresh the gallery
			//CheckAssetURIs();
			GetUserTokens();
			//GetTokenURIs(userTokens);
		}catch(e){
			console.error('There was a problem while claiming', e);
			if(e.message !=="MetaMask Tx Signature: User denied transaction signature.") alert(e.message);
		}
        setBckd(false);
	};

return (
    <Wrapper>
        <SEO pageTitle="Explore Simple" />
        <Header callb={gow3props} />
        <main id="main-content">
            <Breadcrumb pageTitle="Your Collected NFT" currentPage="Simple" />
            {bckd && <>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={open}
                    
                  >
                  <CircularProgress color="inherit" />
                </Backdrop>
                </>
            }
            {(!web3props1 && !bckd) && <>
            <Box component="span" sx={{ p: 2 }}>
                <Button><h5>Please Connect Your Wallet</h5></Button>
            </Box></>
            }
            {(web3props1 && !bckd && assetURIs1?.length < 1) && <>
            <Box component="span" sx={{ p: 2 }}>
                <Button><h5>No NFT in Your Wallet</h5></Button>
            </Box></>
            }
            {web3props1 && <>
            <ExploreProductArea
                data={{
                    
                    products: assetURIs1,
                }}
                getgp={getGP}
            />
            </>
            }
        </main>
        <Footer />
    </Wrapper>
);
            }
export default Home02;
