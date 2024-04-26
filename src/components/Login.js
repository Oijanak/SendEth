import React, { useState, useContext } from "react";
import { AppState } from "../App";

const Login = () => {
  const App = useContext(AppState);
  const { ethereum } = window;
  const [error, setError] = useState("");
  const LoginWallet = async () => {
    try {
      await ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      App.setAddress(accounts[0]);
      App.setLogin(true);
      const chainId = await ethereum.request({ method: "eth_chainId" });
      App.getBal();
      if (chainId == "0xe704") {
        App.setChain("Goreli");
        App.setCurrency("GoreliEther");
        App.setSymbol("LineaEth");
        App.setLogin(true);
      } else if (chainId == "0xaa36a7") {
        App.setChain("Sepolia");
        App.setLogin(true);
        App.setCurrency("SepoliaEther");
        App.setSymbol("SepoliaEth");
      } else {
        setError("Cannot be accessed with that network");
        App.setLogin(false);
      }
    } catch (error) {
      setError(`"${error.message}"`);
    }
  };
  return (
    <div className="min-w-full h-4/5 flex justify-center flex-col items-center">
      <img className="h-20" src="paypal.png " />
      <div className="w-1/3 h-40 mt-4 bg-black bg-opacity-70 p-2 rounded-lg shadow-lg border-opacity-40 border-4 border-black flex flex-col justify-center items-center">
        <h1 className="text-white text-2xl font-medium text-center">Login</h1>
        {ethereum != undefined ? (
          <div
            onClick={LoginWallet}
            className="flex border-opacity-60 bg-opacity-90 text-lg font-medium border-2 border-blue-800 cursor-pointer bg-green-800 text-white mt-4 rounded-lg justify-center items-center py-1 px-2"
          >
            Connect with Metamask
            <img className="h-10" src="metamask.png" />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            {/* install Metamask */}
            <a
              target={"_blank"}
              href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
            >
              <div className="flex border-opacity-60 bg-opacity-90 text-lg font-medium border-2 border-blue-800 cursor-pointer bg-green-800 text-white mt-4 rounded-lg justify-center items-center py-1 px-2">
                Install Metamask
                <img className="h-10" src="metamask.png" />
              </div>
            </a>
            <p className="text-red-600 text-lg mt-2">
              Login Required Metamask Extension
            </p>
          </div>
        )}

        <p className="text-red-600 text-lg mt-2">{error}</p>
      </div>
    </div>
  );
};

export default Login;
