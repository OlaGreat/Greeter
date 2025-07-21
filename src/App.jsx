import { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";
  import { ToastContainer, toast } from 'react-toastify';

const contractAddress = "0xeB26B1c46D552807253Fd93aB2F63C0A37f3Fc79";

function App() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");


  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

   const handleSet = async () => {
    try {
      if (!text) {
      toast.error("Please enter a message before clicking set message.");
        return;
      }

      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.setMessage(text); 
        const txReceipt = await tx.wait();
        toast.success("Transaction successful");
      } else {
        console.error("MetaMask not found. Please install MetaMask to use this application.");
        toast.error("MetaMask not found. Please install MetaMask to use this application.");

      }
    } catch (error) {
      console.error("Error setting message:", error);
      toast.error("something went wrong");
    }
  };


  const handleGet = async () => {
    try {
    
      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.getMessage(); 
        setMessage(tx)
        toast.success("fetched message", tx)
      } else {
        console.error("MetaMask not found. Please install MetaMask to use this application.");
        toast.error("MetaMask not found. Please install MetaMask to use this application.");
      }
    } catch (error) {
      console.error("Error setting message:", error);
      toast.error("something went wrong", "error");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Set Message on Smart Contract</h1>
      <input
        type="text"
        placeholder="Set message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSet}>Set Message</button>
      <button onClick={handleGet}>Get Message</button>
      <h3>{message}</h3>
      <ToastContainer/>
    </div>
  );
}

export default App;