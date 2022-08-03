import abi from "../utils/BuyMeACoffee.json";
import Link from "next/link";
import { ethers } from "ethers";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import Foot from "./components/Footer";

import { FiCoffee } from "react-icons/fi";
import { GiCoffeePot } from "react-icons/gi";
import { BiCoffeeTogo } from "react-icons/bi";

export default function Home() {
  // Contract Address & ABI
  const contractAddress = "0x6a50989336a5787ADbc39989956306f2d413D88c";
  const contractABI = abi.abi;

  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const buyCoffee = async (amount) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("buying coffee..");
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : "anon",
          message ? message : "Enjoy your coffee!",
          { value: ethers.utils.parseEther(amount) }
        );

        await coffeeTxn.wait();

        console.log("mined ", coffeeTxn.hash);

        console.log("coffee purchased!");

        // Clear the form fields.
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("fetching memos from the blockchain..");
        const memos = await buyMeACoffee.getMemos();
        console.log("fetched!");
        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();
    getMemos();

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name,
        },
      ]);
    };

    const { ethereum } = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    };
  }, []);

  return (
    <div>
      <Head>
        <title>Buy me a Coffee!</title>
        <meta name="description" content="tip toto site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="scroll-smooth flex flex-col justify-start items-center">
        <h1 className="flex mt-6 m-2 text-3xl justify-center font-bold text-blue-700 text ">
          BUY TOGIDO A COFFEE!
        </h1>
        {currentAccount ? (
          <div className="flex flex-col justify-start items-center">
            <form className="mt-10">
              <div>
                <label className="text-xl ">Name</label>
                <br />

                <input
                  id="name"
                  type="text"
                  placeholder="anon"
                  onChange={onNameChange}
                  className="block bg-white w-full border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                />
              </div>
              <br />
              <div>
                <label>Send toto a message</label>
                <br />

                <textarea
                  className="resize-none mb-3 block bg-white w-full border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                  rows={3}
                  placeholder="Enjoy your coffee!"
                  id="message"
                  onChange={onMessageChange}
                  required
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => buyCoffee("0.003")}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full border-none flex align-center place-content-center"
                >
                  <FiCoffee className="text-2xl" /> &nbsp; for 0.003ETH
                </button>
                <button
                  type="button"
                  onClick={() => buyCoffee("0.005")}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full border-none flex align-center place-content-center"
                >
                  <GiCoffeePot className="text-2xl" /> &nbsp; for 0.005ETH
                </button>
                <button
                  type="button"
                  onClick={() => buyCoffee("0.001")}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full border-none flex align-center place-content-center"
                >
                  <BiCoffeeTogo className="text-2xl" />
                  &nbsp; for 0.001ETH
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid h-screen place-items-center ">
            <button
          onClick={connectWallet}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full border-none"
        >
          {" "}
          Connect your wallet{" "}
        </button></div>
          
        )}
      </main>
      <div className="flex flex-col justify-start items-center">
        {currentAccount && (
          <h1 className="text-3xl font-semibold">Memos received</h1>
        )}

        <div className="grid gap-3 grid-cols-4 auto-rows-3">
          {currentAccount &&
            memos.map((memo, idx) => {
              return (
                <div key={idx} className="m-2 border-black border-2 rounded-md">
                  <p style={{ fontWeight: "bold" }}>"{memo.message}"</p>
                  <p>From: {memo.name} with love ❤️ </p>
                </div>
              );
            })}
        </div>
      </div>
      <Foot />
    </div>
  );
}
