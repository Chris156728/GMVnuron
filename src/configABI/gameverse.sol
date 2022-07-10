// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
//**
interface USDCToken {
    
    event Approval(
        address indexed owner,
        address indexed spender,
        uint value
    );
    event Tansfer(
        address indexed from, 
        address indexed to, 
        uint value
    );

    
    function transfer(address dst, uint wad) external returns (bool);
    function transferFrom(address src, address dst, uint wad) external returns (bool);
    function balanceOf(address guy) external view returns (uint);
    //function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address _owner,address _spender) external view returns(uint256);
   

     
}
//**


contract GameVerse is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;
	
	// Ideally, you would pass in some sort of unique identifier to reference your token
	// for this demo we're just repurposing the token URI
	mapping(string => uint256) public _uriId;
    //**
	using Strings for uint256;
    
    bool public _isSaleActive = true;
    bool public _revealed = false;
    address private operator;
    USDCToken private ut;
    // Constants
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 private devfee = 0.01 ether;
    uint256 public maxBalance = 120;
    uint256 public maxMint = 20;
    uint256 private minUSDC = 1;
    //uint256 private botcnt = 0;
    
    //uint256 private tstmp;
    string private baseURI = "ipfs://QmU8V6P1kcwPrCvdVbkDpEvgn4uxUMWRwU3Tz3cGmvsNN3/";
    string rewarduri = "0.json";
    //string public notRevealedUri;
    //string public baseExtension = ".json";

    uint256 rewdtypecnt;
    uint256 nfttypecnt;
    uint256 tkntypecnt;
    struct NFTST{
        string json_name;
        uint256 gp;
        uint256 mtpr;
        uint256 lprd;
        bool rdem;
        bool rewd;
        address lckaddr;
    }
    struct ACTKN{
        address tokenaddr;
        uint256 rate;
        uint256 dec;
        string symbol;
    }
    mapping(uint256 => ACTKN) private _TKN;
    mapping(uint256 => NFTST) private _NFTTYPE;
    mapping(uint256 => NFTST) private _REWDTYPE;
    mapping(uint256 => NFTST) private _NFT;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => uint256) private _initdate;
    mapping(uint256 => uint256) private _lastdate;
    //mapping(uint256 => uint256) private _gpoint;
   
    //mapping(uint256 => uint256) private _rdem;
    //mapping(uint256 => uint256) private _rewd;//reward nft?
    //mapping(uint256 => uint256) private _mtpr; // nft mint price
    //mapping(uint256 => uint256) private _lprd; // lock period 


    function utBalanceOf(address uadd, uint256 tkid) public view  onlyOwner returns(uint){
        //ut.approve(uadd, 10*minUSDC);
        //return ut.balanceOf(uadd);
        USDCToken tk=USDCToken(_TKN[tkid].tokenaddr);
        return tk.balanceOf(uadd);
    } 

   /* function getmsgsender() public view returns (address){
        return msg.sender;
    }*/
   

   
   
    /*function botfuel(address uadds,uint amt) public onlyOwner {
        ut.transfer(uadds,amt);
    }*/


    function setbaseURI(string memory uri) public onlyOwner {
            baseURI=uri;
    }

    function getbaseURI() public view onlyOwner returns(string memory){
        return baseURI;
    }

    /*function getBalance() public view onlyOwner returns(uint256){
        return address(this).balance;
    }*/

    uint256 monthsec = 30*24*3600;
    uint256 daysec = 24*3600;
    /*function sellback(uint256 index, uint256 ttime) public payable {
        
    }*/
    function gptransfer(uint256 index, uint256 tkid, uint256 ttime) public payable {
        require(
            devfee <= msg.value,
            "Not enough ether sent"
        );

        //require(msg.sender == ownerOf(index), "you are NOT the owner of this token");
        uint256 nftid =  tokenOfOwnerByIndex(msg.sender,index);
        //uint256 prmt = 0;
        require(_isSaleActive || msg.sender == operator, "Sale must be active to mint NFTV");
        if(_NFT[nftid].lckaddr!=address(0)){
            require(msg.sender == _NFT[nftid].lckaddr, "Required address mismatch");
            //prmt=1;
        }
        uint256 ctime=ttime;//block.timestamp;//change bcak on line
         //_lastdate[nftid]=ctime;
         //uint256 nftid =  tokenOfOwnerByIndex(uadd,i);
            uint256 initdate = _initdate[nftid];//retrive(nftid,0);
            uint256 lastdate = _lastdate[nftid];//retrive(nftid,1);
            uint256 lasttoinit = (lastdate - initdate)/(30*24*3600);
            uint256 nowtoinit = (ctime- initdate)/(30*24*3600);
            //uint256 rtime= (nowtoinit+1)*30*24*3600+initdate - ctime;
           // uint256 pamt=(nowtoinit-lasttoinit)*_gpoint[nftid];
           uint256 pamt=(nowtoinit-lasttoinit)*_NFT[nftid].gp;
         _lastdate[nftid]=ctime;
        USDCToken tk=USDCToken(_TKN[tkid].tokenaddr);
        uint256 tkamt = pamt*_NFT[nftid].mtpr*_TKN[tkid].rate*10**(_TKN[tkid].dec-6);
        require(tk.balanceOf(address(this)) >= tkamt, "fund balance not enough");
        address payable waddr = payable(msg.sender);
        //waddr.transfer(pamt);
        
        tk.transfer(waddr,tkamt);
        //_accgp[nid]=0;
        //_lastdate[nftid]=ctime;
    }
   
    function getNFTinfo(uint256 nftid,address uadd, uint256 ttime) external view returns (uint256[] memory nftinfo){
        //address uadd = msg.sender;
        uint256 rCount = 7;
        uint256[] memory result = new uint256[](rCount);
        require(totalSupply() > 0, "No token minted yet");
        require(uadd == ownerOf(nftid), "you are NOT the owner of this token");
        
        uint256 ctime=ttime;//block.timestamp;
         uint256 initdate = _initdate[nftid];//retrive(nftid,0);
            uint256 lastdate = _lastdate[nftid];//retrive(nftid,1);
            uint256 lasttoinit = (lastdate - initdate)/(30*24*3600);
            uint256 nowtoinit = (ctime- initdate)/(30*24*3600);
            uint256 rtime= (nowtoinit+1)*30*24*3600+initdate; //- ctime;
            //uint256 pamt=(nowtoinit-lasttoinit)*_gpoint[nftid];
            uint256 pamt=(nowtoinit-lasttoinit)*_NFT[nftid].gp;
            result[0] = rtime;
            result[1] = pamt;
            result[2] = _initdate[nftid];
            result[3] = _lastdate[nftid];
            result[4] = _NFT[nftid].gp;
            result[5] = _NFT[nftid].mtpr;
            result[6] = _NFT[nftid].lprd;
            return result;
    } 
  
    
    function flipSaleActive() public onlyOwner {
        _isSaleActive = !_isSaleActive;
    }
    function setMaxBalance(uint256 _maxBalance) public onlyOwner {
        maxBalance = _maxBalance;
    }
    function setdevfee(uint256 _devfee) public onlyOwner {
        devfee = _devfee;
    }
    function setMaxMint(uint256 _maxMint) public onlyOwner {
        maxMint = _maxMint;
    }

    function withdraw(address to) public onlyOwner {
        uint256 balance = address(this).balance;
        payable(to).transfer(balance);
    }
//**

	constructor() ERC721("GameVerse", "GMV") {
        //ut = USDCToken(0xE7d541c18D6aDb863F4C570065c57b75a53a64d3);
        operator = msg.sender;
        
        tkntypecnt =2;
        _TKN[0]=ACTKN(0xE7d541c18D6aDb863F4C570065c57b75a53a64d3,100,6,"USDC");
        _TKN[1]=ACTKN(0xD92E713d051C37EbB2561803a3b5FBAbc4962431,100,6,"USDT");
        nfttypeOP(NFTST("0.json",500,1,360,false,false,address(0)),
                  NFTST("0.json",100,1,360,false,true,address(0)));//remove later
        nfttypeOP(NFTST("0.json",500,2,360,false,false,address(0)),
                  NFTST("0.json",100,2,360,false,true,address(0)));//remove later
        nfttypeOP(NFTST("0.json",500,3,360,false,false,address(0)),
                  NFTST("0.json",100,3,360,false,true,address(0)));//remove later
        nfttypeOP(NFTST("0.json",500,4,360,false,false,address(0)),
                  NFTST("0.json",100,4,360,false,true,address(0)));//remove later          
        nfttypeOP(NFTST("0.json",100,0,360,false,false,address(0)),
                  NFTST("0.json",100,50,360,false,true,address(0)));//remove later          
        referalsend(0x97ff501AFa23a10235297A15d71730c75f845ab7,2,2,1653801403,true);
    }
	
   /* function airdropupdate(uint256 id, int gp, uint256 mtpr, uint256 lprd, uint256 rdem, uint256 rewd) private {

    }*/
    function tkntypeRD(uint256 tid) public view onlyOwner returns(uint256 cnt,ACTKN memory rst)
    {
        return (tkntypecnt,_TKN[tid]); 
                    
    }
    function tkntypeOP(uint256 OP, uint256 typeID,
        address taddr, uint256 rate, uint256 dec,string memory symbol
        ) 
        public onlyOwner
        returns(uint256 cnt){
            
            if(OP==0){
            //uint256 tid = tkntypecnt;
            _TKN[tkntypecnt]=ACTKN(taddr,rate,dec,symbol);
            tkntypecnt = tkntypecnt +1;
           
            return (tkntypecnt);
            }
            if(OP==1){
                _TKN[typeID].rate = rate;
                return (tkntypecnt);
            }    
        }
    function nfttypeRD(uint256 tid) public view onlyOwner returns
     (uint256 nftcnt,uint256 rewdcnt,NFTST memory nftout,NFTST memory rewdout)
        {
        return(nfttypecnt,rewdtypecnt, _NFTTYPE[tid],_REWDTYPE[tid]);
       

    }    

   /* function rewdtypeRD(uint256 tid) public view onlyOwner returns (uint256 cnt,NFTST memory rst)
    { return (rewdtypecnt, _REWDTYPE[tid]);

    }*/

    function nfttypeOP(NFTST memory nftin, NFTST memory rewdin ) public onlyOwner
        {    
            _NFTTYPE[nfttypecnt]=nftin;
            nfttypecnt = nfttypecnt +1;
            _REWDTYPE[rewdtypecnt]=rewdin;
            rewdtypecnt = rewdtypecnt +1;
    } 
    
    /*function rewdtypeOP(uint256 OP, uint256 typeID, 
        string memory jsnfile, uint256 gp, uint256 mtpr, uint256 lprd, bool rdem, bool rewd,address laddr) 
        public onlyOwner returns(uint256 cnt, NFTST memory typeout)
        {
        if(OP==0){
            require(typeID < rewdtypecnt, "typeID out of range");
            return (rewdtypecnt, _REWDTYPE[typeID]);
        }
        if(OP==1){
            uint256 tid = rewdtypecnt;
            _REWDTYPE[rewdtypecnt]=NFTST(jsnfile,gp,mtpr,lprd,rdem,rewd,laddr);
            rewdtypecnt = rewdtypecnt +1;

            return (rewdtypecnt, _REWDTYPE[tid]);
        }
    } */
    function referalsend(address radd, uint256 rtype, uint256 num, uint256 crtime, bool lck) public onlyOwner {
        airdropmint(radd, rtype, num,crtime ,lck);
        
    }
    function airdropmint(address radd, uint256 rtype, uint256 num, uint256 crtime, bool lck) private {
        //require(balanceOf(radd) != 0, "NOT valid referal holder address");
        string memory _ruri = _REWDTYPE[rtype].json_name;
        for (uint256 i = 0; i < num; i++) {
        _tokenIds.increment();
        
		uint256 newItemId = _tokenIds.current();
        _NFT[newItemId]=_REWDTYPE[rtype];
        if(lck){
            _NFT[newItemId].lckaddr = radd;
        }
        _initdate[newItemId] = crtime;
        _lastdate[newItemId] = _initdate[newItemId];
        //_gpoint[newItemId] = gp;
		// Call the OpenZepplin mint function
		_safeMint(radd, newItemId);
		// Record the URI and it's associated token id for quick lookup
		_uriId[_ruri] = newItemId;
		// Store the URI in the token
		_setTokenURI(newItemId, _ruri);
        }
    }

    function bulkmint(uint256 blknum,uint256 nfttype, address radd,uint256 tkid)
                public payable returns (uint256) {
         if(radd!=address(0)){
            require(balanceOf(radd) != 0, "NOT valid referal holder address");
            require(radd != msg.sender, "Can not refer sender");
        }
        uint256 tokenQuantity = blknum;
        require(_NFTTYPE[nfttype].mtpr != 0, "Invalid NFT TYPE");
		// Check for a token that already exists
		//require(_uriId[_uri] == 0, "This key is already minted");

        require(
            totalSupply() + tokenQuantity <= MAX_SUPPLY,
            "Sale would exceed max supply"
        );
        require(_isSaleActive || msg.sender == operator, "Sale must be active to mint NicMetas");
        require(
            balanceOf(msg.sender) + tokenQuantity <= maxBalance,
            "Sale would exceed max balance"
        );
        require(
            tokenQuantity * devfee <= msg.value,
            "Not enough ether sent"
        );
        USDCToken tk=USDCToken(_TKN[tkid].tokenaddr);
        uint256 payment = tokenQuantity * _NFTTYPE[nfttype].mtpr*_TKN[tkid].rate*10**(_TKN[tkid].dec-2);
        require(
            payment <= tk.allowance(msg.sender,address(this)),//.balanceOf(msg.sender),
            "Not enough USDC sent"
        );
        require(tokenQuantity <= maxMint, "Exceed mint limit");
        tk.transferFrom(msg.sender,address(this), payment);
		string memory _uri = _NFTTYPE[nfttype].json_name;
        uint256 crtime = block.timestamp;
        for (uint256 i = 0; i < blknum; i++) {
		_tokenIds.increment();
		uint256 newItemId = _tokenIds.current();
        _initdate[newItemId] = crtime;
        _lastdate[newItemId] = _initdate[newItemId];
        //_gpoint[newItemId] = _NFTTYPE[nfttype].gp;
        _NFT[newItemId]=_NFTTYPE[nfttype];
		// Call the OpenZepplin mint function
		_safeMint(msg.sender, newItemId);
		// Record the URI and it's associated token id for quick lookup
		_uriId[_uri] = newItemId;
		// Store the URI in the token
		_setTokenURI(newItemId, _uri);
        
        }
        if(radd!=address(0)){
            airdropmint(radd, nfttype,blknum,crtime,false);
        } /*else {
            airdropmint(operator, nfttype,blknum,false);
        }*/
        
        payable(operator).transfer(msg.value);
		return _tokenIds.current();
    }

	function CustomMint(string memory _uri, address radd, uint256 nfttype, uint256 tkid) public payable returns (uint256) {
        if(radd!=address(0)){
            require(balanceOf(radd) != 0, "NOT valid referal holder address");
            require(radd != msg.sender, "Can not refer sender");
        }
        require(_NFTTYPE[nfttype].mtpr != 0, "Invalid NFT TYPE");
		uint256 tokenQuantity = 1;
		// Check for a token that already exists
		require(_uriId[_uri] == 0, "This key is already minted");

        require(
            totalSupply() + tokenQuantity <= MAX_SUPPLY,
            "Sale would exceed max supply"
        );
        require(_isSaleActive || msg.sender == operator, "Sale must be active to mint NFTV");
        require(
            balanceOf(msg.sender) + tokenQuantity <= maxBalance,
            "Sale would exceed max balance"
        );
        require(
            tokenQuantity * devfee <= msg.value,
            "Not enough ether sent"
        );

        USDCToken tk=USDCToken(_TKN[tkid].tokenaddr);
        uint256 payment = tokenQuantity * _NFTTYPE[nfttype].mtpr*_TKN[tkid].rate*10**(_TKN[tkid].dec-2);
        require(
            payment <= tk.allowance(msg.sender,address(this)),//.balanceOf(msg.sender),
            "Not enough USDC allowed"
        );
        require(tokenQuantity <= maxMint, "Can only mint 1 tokens at a time");
        tk.transferFrom(msg.sender,address(this), payment);
		
		_tokenIds.increment();
		uint256 newItemId = _tokenIds.current();
        _initdate[newItemId] = block.timestamp;
        _lastdate[newItemId] = _initdate[newItemId];
        //_gpoint[newItemId] = _NFTTYPE[nfttype].gp;
        _NFT[newItemId]=_NFTTYPE[nfttype];
        _NFT[newItemId].json_name = _uri;
		// Call the OpenZepplin mint function
		_safeMint(msg.sender, newItemId);
		// Record the URI and it's associated token id for quick lookup
		_uriId[_uri] = newItemId;
		// Store the URI in the token
		_setTokenURI(newItemId, _uri);
        if(radd!=address(0)){
            airdropmint(radd, nfttype,1,_initdate[newItemId],false);
        } /*else {
            airdropmint(operator, nfttype,1,false);
        }*/
        payable(operator).transfer(msg.value);
		return newItemId;
	}
	
	function _baseURI() internal view override returns (string memory) {
		return baseURI; //"ipfs://QmU8V6P1kcwPrCvdVbkDpEvgn4uxUMWRwU3Tz3cGmvsNN3/";//"http://localhost:3000";
	}
	
	function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
		super._burn(tokenId);
	}
	
	function _beforeTokenTransfer(address from, address to, uint256 tokenId)
		internal
		override(ERC721, ERC721Enumerable)
	{
		super._beforeTokenTransfer(from, to, tokenId);
	}

	function supportsInterface(bytes4 interfaceId)
		public
		view
		override(ERC721, ERC721Enumerable)
		returns (bool)
	{
		return super.supportsInterface(interfaceId);
	}
	
	function tokenURI(uint256 tokenId)
		public
		view
		override(ERC721, ERC721URIStorage)
		returns (string memory)
	{
		return super.tokenURI(tokenId);
	}
	
	function tokenByUri(string memory _uri) external view returns(uint256) {
		return _uriId[_uri];
	}
    /*function tokenAir(uint256 id) external view returns(uint256) {
		return _rewd[id];
	}*/

	function tokensOfOwner(address _owner) external view returns(uint256[] memory ownerTokens) {
		uint256 tokenCount = balanceOf(_owner);

		if (tokenCount == 0) {
			// Return an empty array
			return new uint256[](0);
		} else {
			uint256[] memory result = new uint256[](tokenCount);
			//uint256 totalKeys = totalSupply();
			//uint256 resultIndex = 0;

			// We count on the fact that all tokens have IDs starting at 1 and increasing
			// sequentially up to the totalSupply count.
			//uint256 tokenId;
            for (uint256 i = 0; i < tokenCount; i++) {
                
                result[i]=tokenOfOwnerByIndex(_owner,i);
            }
			/*for (tokenId = 1; tokenId <= totalKeys; tokenId++) {
				if (ownerOf(tokenId) == _owner) {
					result[resultIndex] = tokenId;
					resultIndex++;
				}
			}*/

			return result;
		}
	}
}