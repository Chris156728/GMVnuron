import PropTypes from "prop-types";
import clsx from "clsx";
import { useMoralis } from "react-moralis";
import Logo from "@components/logo";
import MainMenu from "@components/menu/main-menu";
import MobileMenu from "@components/menu/mobile-menu";
import SearchForm from "@components/search-form/layout-01";
import FlyoutSearchForm from "@components/search-form/layout-02";
import React, { useState,useEffect } from "react";
//import UserDropdown from "@components/user-dropdown";
import ColorSwitcher from "@components/color-switcher";
import Login from "@components/Login";
import BurgerButton from "@ui/burger-button";
import Anchor from "@ui/anchor";
//import Button from "@ui/button";
import { useOffcanvas, useSticky, useFlyoutSearch } from "@hooks";
import headerData from "../../../data/general/header-01.json";
import menuData from "../../../data/general/menu-02.json";
import conf from "../../../configABI/config.json";



const Header = (param) => {
    const sticky = useSticky();
    const { offcanvas, offcanvasHandler } = useOffcanvas();
    const { search, searchHandler } = useFlyoutSearch();
    //const { authenticate, isAuthenticated } = useMoralis();
    //console.log(props.url);
    let nowurl = null;
    let contractAvailable = false;
    let walletAddress = null;
    
    const [web3props, setWeb3Props] = useState({ web3: null, accounts: null, contract: null });
    useEffect(() => {
        // When title or name changed will render
        console.log('headerrender');
        let rurl = "/";//window.location.origin + "/";
        let gpurl ="/explore-04";//window.location.origin + "/explore-04";
        const curr=new URL(window.location.href);
        nowurl=curr.href;
        //console.log("nowurl",nowurl);
	    const refaddr=curr.searchParams.get('ref');
        //console.log("refaddr",refaddr);
        if(!isMobileDevice()){
            // If the wallet is connected, all three values will be set. Use to display the main nav below.
             contractAvailable = !(!web3props.web3 && !web3props.accounts && !web3props.contract);
            // Grab the connected wallet address, if available, to pass into the Login component
             walletAddress = web3props.accounts ? web3props.accounts[0] : "";
        } 
        //if(isMobileDevice() && window.ethereum){
        if(isMobileDevice()){
            contractAvailable = web3props.accounts;//!(!web3props.web3 && !web3props.accounts && !web3props.contract);
            // Grab the connected wallet address, if available, to pass into the Login component
             walletAddress = web3props.accounts ? web3props.accounts[0] : "";
        }
        let props={tokenaddr:conf.tokenaddr, tokenprice:conf.tokentype, contractaddr:conf.contractaddr, url:nowurl, 
            refaddr:refaddr, contract:web3props.contract, address:walletAddress};
            
       // if((rurl === window.location.href || gpurl === window.location.href)&& contractAvailable)
       if((rurl === curr.pathname|| gpurl === curr.pathname)&& contractAvailable)
            if(param!==null){
            param.callb(props);
            }
          }, [web3props])

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
	
const targetNetworkId = '0x89';
	
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
//if(isMobileDevice() && window.ethereum){
    if(isMobileDevice()){
	contractAvailable = web3props.accounts; // !(!web3props.web3 && !web3props.accounts && !web3props.contract);
	// Grab the connected wallet address, if available, to pass into the Login component
     walletAddress = web3props.accounts ? web3props.accounts[0] : "";
}
//let props={tokenaddr:conf.tokenaddr, tokenprice:conf.tokenprice, contractaddr:conf.contractaddr, url:nowurl, 
//refadd:refaddr, contract:web3props.contract, address:walletAddress};

/*let rurl = window.location.origin + "/";
if(rurl === window.location.href && contractAvailable)
    if(param!==null){
    param.callb(props);
    }*/
}



    return (
        <>
            <header
                className={clsx(
                    "rn-header haeder-default black-logo-version header--fixed header--sticky",
                    sticky && "sticky",
                    //className
                )}
            >
                <div className="container">
                    <div className="header-inner">
                        <div className="header-left">
                            <Logo logo={headerData.logo} />
                            <div className="mainmenu-wrapper">
                                <nav
                                    id="sideNav"
                                    className="mainmenu-nav d-none d-xl-block"
                                >
                                    <MainMenu menu={menuData} />
                                </nav>
                            </div>
                        </div>
                        <div className="header-right">
                            <div className="setting-option d-none d-lg-block">
                                <SearchForm />
                            </div>
                            <div className="setting-option rn-icon-list d-block d-lg-none">
                                <div className="icon-box search-mobile-icon">
                                    <button
                                        type="button"
                                        aria-label="Click here to open search form"
                                        onClick={searchHandler}
                                    >
                                        <i className="feather-search" />
                                    </button>
                                </div>
                                <FlyoutSearchForm isOpen={search} />
                            </div>
                            
                                <div className="setting-option header-btn">
                                    <div className="icon-box">
                                    <Login callback={OnLogin} contractaddr={conf.contractaddr} url={nowurl}
                                     connected={contractAvailable} address={walletAddress}></Login>
                                        
                                    </div>
                                </div>
                            
                           
                            
                            <div className="setting-option mobile-menu-bar d-block d-xl-none">
                                <div className="hamberger">
                                    <BurgerButton onClick={offcanvasHandler} />
                                </div>
                            </div>
                            <div
                                id="my_switcher"
                                className="setting-option my_switcher"
                            >
                                <ColorSwitcher />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <MobileMenu
                isOpen={offcanvas}
                onClick={offcanvasHandler}
                menu={menuData}
                logo={headerData.logo}
            />
        </>
    );
};

Header.propTypes = {
    className: PropTypes.string,
};

export default Header;
