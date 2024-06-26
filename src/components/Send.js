import React, { useContext } from "react";
import { AppState } from "../App";
import paypal from "../paypal/paypal.json";
import { Bars, TailSpin } from "react-loader-spinner";
import { ethers } from "ethers";

const Send = () => {
  const App = useContext(AppState);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const paypalAddress = "0x63Cc5c3D83E150150A48a212E1FB1bc20C186294";
  const explorer = "https://sepolia.etherscan.io/";

  const paypalContract = new ethers.Contract(
    paypalAddress,
    paypal.output.abi,
    signer
  );

  const transferAmount = async () => {
    App.setTxLoading(true);

    try {
      const tx = await paypalContract._transfer(
        App.recipientAddress,
        App.symbol,
        {
          value: ethers.utils.parseEther(App.amount),
        }
      );

      await tx.wait();
      App.setRecentTx({
        txhash: tx.hash,
        from: App.address,
        to: App.recipientAddress,
        amount: App.amount,
        symbol: App.symbol,
      });
      App.setMessage("Transaction Succesfull");
      App.setShowRecentTx(true);
      App.getBal();
    } catch (error) {
      App.setError(error.message);
    }
    App.setTxLoading(false);
  };

  const saveTx = async () => {
    App.setSaveTxLoad(true);
    try {
      const tx = await paypalContract.saveTx(
        App.recentTx.from,
        App.recentTx.to,
        ethers.utils.parseEther(App.recentTx.amount),
        App.recentTx.symbol
      );
      await tx.wait();
      App.setMessage("Transaction saved Successfully");
    } catch (error) {
      App.setError(error.message);
    }
    App.setShowRecentTx(false);
    App.setSaveTxLoad(false);
  };
  return (
    <div className="flex flex-col justify-center items-center text-white">
      {/* Balance */}
      <div className="flex w-4/5 justify-around items-center mt-7">
        <div className="flex cursor-pointer justify-center items-center border-2 border-blue-900 border-opacity-60 p-3 bg-black bg-opacity-70 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="bi bi-coin"
            viewBox="0 0 16 16"
          >
            <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z" />
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
          </svg>
          <h1 className="ml-2 text-lg font-medium">{App.currency}</h1>
        </div>
        <div className="flex items-center border-2 border-blue-900 border-opacity-60 p-3 bg-black rounded-lg bg-opacity-70">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="ml-2 bi bi-wallet2"
            viewBox="0 0 16 16"
          >
            <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
          </svg>
          <h1 className="ml-2 text-lg font-medium">Balance :</h1>
          <h1 className="ml-2 text-lg font-medium">
            {App.balance.slice(0, 5)}
            {App.symbol}
          </h1>
        </div>
      </div>
      {/* Transfer To */}
      <div className="flex w-4/5 justify-between items-center mt-5">
        <input
          onChange={(e) => App.setRecipientAddress(e.target.value)}
          value={App.recipientAddress}
          className="w-3/4 p-3 bg-black border-2 border-blue-900 border-opacity-60 bg-opacity-70 outline-none rounded-lg"
          placeholder="Paste Recipient Address"
        />
        <input
          onChange={(e) => App.setAmount(e.target.value)}
          value={App.amount}
          type={"number"}
          className="w-1/4 ml-4 p-3 bg-black border-2 border-blue-900 border-opacity-60 bg-opacity-70 outline-none rounded-lg"
          placeholder="Amount"
        />
      </div>
      {App.txloading ? (
        <div className="flex mt-4 w-4/5 cursor-pointer justify-center items-center p-2 bg-green-700 bg-opacity-70 border-2 border-blue-900 border-opacity-80 text-xl font-medium rounded-lg">
          <Bars width={30} height={46} color={"white"} />
        </div>
      ) : (
        <div
          onClick={transferAmount}
          className="flex mt-4 w-4/5 cursor-pointer justify-center items-center p-2 bg-green-700 bg-opacity-70 border-2 border-blue-900 border-opacity-80 text-xl font-medium rounded-lg"
        >
          Transfer
        </div>
      )}

      {/* Recent Tx section */}
      <div
        className={`${
          App.showRecentTx ? "" : "hidden"
        } bg-black rounded-lg bg-opacity-60 border-2 border-blue-900 border-opacity-80 w-4/5 mt-2`}
      >
        <div className="flex w-full items-center justify-center rounded-t-lg">
          <div className="w-4/6 py-2 px-2">
            <p className="text-xl font-mono">
              Amount: {App.recentTx.amount}
              {App.recentTx.symbol}
            </p>
            <p className="text-xs font-mono">to:{App.recentTx.to} </p>
          </div>
          {App.saveTxLoad ? (
            <div className="flex justify-center bg-green-700 font-medium font-mono bg-opacity-80 h-full w-1/6 py-1 mr-2 rounded-md">
              <TailSpin height={18} width={18} color={"white"} />
            </div>
          ) : (
            <button
              onClick={saveTx}
              className="bg-green-700 font-medium font-mono bg-opacity-80 h-full w-1/6 py-1 mr-2 rounded-md"
            >
              Save
            </button>
          )}
          <button
            onClick={() => App.setShowRecentTx(false)}
            className="bg-red-700 font-medium font-mono bg-opacity-80 h-full w-1/6 py-1 mr-2 rounded-md"
          >
            Ignore
          </button>
        </div>
        <a target="_blank" href={`${explorer}tx/${App.recentTx.txhash}`}>
          <div className="font-mono w-full rounded-b-lg bg-gray-900 text-center cursor-pointer text-opacity-30">
            View Transaction
          </div>
        </a>
      </div>
      {/* Error & Message */}
      <div>
        <p className="text-red-600 text-lg mt-2 px-3">{App.error}</p>
        <p className="text-green-600 text-lg mt-2 px-1">{App.message}</p>
      </div>
    </div>
  );
};

export default Send;
