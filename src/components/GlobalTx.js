import React, { useEffect, useState } from "react";

import { ethers } from "ethers";
import paypal from "../paypal/paypal.json";

const GlobalTx = () => {
  const [data, setData] = useState([]);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const paypalAddress = "0x63Cc5c3D83E150150A48a212E1FB1bc20C186294";

  const paypalContract = new ethers.Contract(
    paypalAddress,
    paypal.output.abi,
    signer
  );

  useEffect(() => {
    async function getData() {
      const tx = paypalContract.filters.transactions();
      const txData = await paypalContract.queryFilter(tx);
      console.log(txData);
      setData(txData);
    }

    getData();
  }, []);
  const explorer = "https://sepolia.etherscan.io/";

  return (
    <div className="flex flex-col items-center justify-center p-3 text-white">
      {data.map((e) => {
        return (
          <div
            className={`bg-black rounded-lg bg-opacity-60 border-2 border-blue-900 border-opacity-80 w-4/5 mt-2`}
          >
            <div className="flex w-full items-center justify-center rounded-t-lg">
              <div className="w-full py-2 px-2">
                <p className="text-xl font-mono">
                  Amount: {ethers.utils.formatEther(e.args.amount)}{" "}
                  {e.args.symbol}
                </p>
                <p className="text-xs font-mono">from: {e.args.from}</p>
                <p className="text-xs font-mono">to: {e.args.to}</p>
              </div>
            </div>
            <a target={"_blank"} href={`${explorer}/tx/${e.transactionHash}`}>
              <div className="font-mono w-full rounded-b-lg bg-gray-900 text-center cursor-pointer text-opacity-30">
                View Transaction
              </div>
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default GlobalTx;
