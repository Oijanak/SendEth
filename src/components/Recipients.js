import React, { useContext, useEffect, useState } from "react";
import { AppState } from "../App";
import { ethers } from "ethers";
import paypal from "../paypal/paypal.json";

const Recipients = () => {
  const App = useContext(AppState);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const paypalAddress = "0x63Cc5c3D83E150150A48a212E1FB1bc20C186294";

  const paypalContract = new ethers.Contract(
    paypalAddress,
    paypal.output.abi,
    signer
  );

  const [recipientAddress, setRecipientAddress] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  useEffect(() => {
    async function getData() {
      const recipients = paypalContract.filters.recipients(App.address);
      const recipientData = await paypalContract.queryFilter(recipients);
      setData(recipientData);
    }
    getData();
  }, []);

  const addRecipient = async () => {
    setError("");
    try {
      const tx = await paypalContract.addRecipient(
        recipientAddress,
        recipientName
      );
      await tx.wait();
      setMessage("Recipient Added Successfully");
      setRecipientAddress("");
      setRecipientName("");
    } catch (error) {
      setError(error.message);
    }
  };

  const setRecipient = (address, name) => {
    App.setRecipientAddress(address);
    setMessage("Selected the " + name + "'s address");
  };

  return (
    <div className="flex flex-col items-center justify-center py-3 px-4 text-white">
      <input
        onChange={(e) => setRecipientAddress(e.target.value)}
        value={recipientAddress}
        className="w-3/4 p-3 bg-black border-2 border-blue-900 border-opacity-60 bg-opacity-70 outline-none rounded-lg"
        placeholder="Paste Recipient Address"
      />
      <input
        onChange={(e) => setRecipientName(e.target.value)}
        value={recipientName}
        className="mt-2 w-3/4 p-3 bg-black border-2 border-blue-900 border-opacity-60 bg-opacity-70 outline-none rounded-lg"
        placeholder="Paste Recipient Name"
      />
      <div
        onClick={addRecipient}
        className="flex mt-4 w-3/4 cursor-pointer justify-center items-center p-2 bg-green-700 bg-opacity-70 border-2 border-blue-900 border-opacity-80 text-xl font-medium rounded-lg"
      >
        Add Recipient
      </div>
      <p className="text-red-600 text-lg mt-2 px-3">{error}</p>
      <p className="text-green-600 text-lg mt-2 px-1">{message}</p>

      <div className="flex flex-col items-center justify-center mt-4 w-full">
        {data.map((e) => {
          return (
            <div
              onClick={() =>
                setRecipient(e.args.recipient, e.args.recipientNamee)
              }
              className={`bg-black cursor-pointer rounded-lg bg-opacity-60 border-2 border-blue-900 border-opacity-80 w-3/4 mt-2`}
            >
              <div className="flex w-full items-center justify-center rounded-t-lg">
                <div className="w-full py-2 px-2">
                  <p className="text-xl font-mono">
                    Name:{e.args.recipientNamee}
                  </p>
                  <p className="text-xs font-mono">
                    address: {e.args.recipient}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Recipients;
