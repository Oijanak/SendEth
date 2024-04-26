import { useState, createContext, useEffect } from "react";
import Main from "./components/Main";
import Login from "./components/Login";
import Header from "./components/Header";
import { ethers } from "ethers";

const AppState = createContext();
function App() {
  const { ethereum } = window;
  const [login, setLogin] = useState(false);
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("");
  const [symbol, setSymbol] = useState("");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("");

  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [txloading, setTxLoading] = useState(false);

  const [showRecentTx, setShowRecentTx] = useState(false);
  const [recentTx, setRecentTx] = useState({
    txhash: "",
    from: "",
    to: "",
    amount: "",
    symbol: "",
  });
  const [saveTxLoad, setSaveTxLoad] = useState(false);

  // Contracts

  async function getBal() {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const balance = await signer.getBalance();
    setBalance(ethers.utils.formatEther(balance));
  }

  useEffect(() => {
    ethereum.on("chainChanged", async (chainId) => {
      if (chainId == "0xe704") {
        setChain("Goreli");
        setCurrency("GoreliEther");
        setSymbol("LineaEth");
      } else if (chainId == "0xaa36a7") {
        setChain("Sepolia");
        setCurrency("SepoliaEther");
        setSymbol("SepoliaEth");
      } else {
        setLogin(false);
      }

      getBal();
    });
    ethereum.on("accountsChanged", async (accounts) => {
      setAddress(accounts[0]);
      getBal();
    });
  }, []);

  return (
    <AppState.Provider
      value={{
        txloading,
        setTxLoading,

        error,
        message,
        setMessage,
        recipientAddress,
        setRecipientAddress,
        amount,
        setAmount,
        currency,
        setCurrency,
        balance,
        setBalance,
        symbol,
        setSymbol,
        login,
        setLogin,
        address,
        setAddress,
        chain,
        setChain,
        getBal,
        setError,
        recentTx,
        setRecentTx,
        showRecentTx,
        setShowRecentTx,
        saveTxLoad,
        setSaveTxLoad,
      }}
    >
      <div className="App">
        <div className="min-w-full h-sreen">
          {login ? (
            <div>
              {/* Main Application*/}

              <Header />
              <Main />
            </div>
          ) : (
            <Login />
          )}
        </div>
      </div>
    </AppState.Provider>
  );
}

export default App;
export { AppState };
