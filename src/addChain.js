import getWeb3 from "./getWeb3";


async function addUniqChain () {
            
  
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x22b8' }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code == 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{ chainId:'0x22b8', chainName:'UniqueEtherTest', 
              rpcUrls:["https://westend-rpc.unique.network/"],
        /*         chainId: '0x22b8', chainName: 'UniqueEtherChainTST',rpcUrl: 'http://35.157.131.180:9973/', */
                 nativeCurrency: {
                  name: "Unique",
                  symbol: "UNQ", // 2-6 characters long
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
