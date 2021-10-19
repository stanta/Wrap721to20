import getWeb3 from "./getWeb3";


async function addChain () {
            
  
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code == 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{ chainId:'0x89', chainName:'Polygon', 
              rpcUrls:["https://westend-rpc.unique.network/"],
                 nativeCurrency: {
                  name: "Matic",
                  symbol: "MATIC", // 2-6 characters long
                  decimals: 18,
                  }
                }],
            });
          } catch (addError) {
            console.log (addError)
          }
        }
    }
  }
    else
      {
      alert('Ether wallet  is NOT installed!');
      }
   
        
/*     $(document).ready(function() {
    candidateNames = Object.keys(candidates);
    for (var i = 0; i < candidateNames.length; i++) {
        let name = candidateNames[i];
        let val = contractInstance.totalVotesFor.call(name).toString()
        $("#" + candidates[name]).html(val);
    }
    });
 */
  }

  export default addChain
