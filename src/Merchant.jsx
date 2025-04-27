import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { QRCodeCanvas } from 'qrcode.react';
import MerchantABI from './Merchant.json';
import './Merchant.css';

// Ganti ini setelah deploy ke Vercel
const BASE_URL = 'https://tokoku.vercel.app'; 

const CONTRACT_ADDRESS = '0x3DFa87611a0385C9711e2638337eD01f3eFB6818';

const MerchantPage = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [qrData, setQrData] = useState('');
  const [balance, setBalance] = useState('0');

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install Metamask dulu");
      return;
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setWalletAddress(accounts[0]);
  };

  const generateStaticQR = () => {
    if (!walletAddress) {
      alert("Connect wallet terlebih dahulu.");
      return;
    }
    const url = `${BASE_URL}/pay?merchant=${walletAddress}`;
    setQrData(url);
  };

  const getBalance = async () => {
    if (!window.ethereum || !walletAddress) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, MerchantABI, provider);
    try {
      const rawBalance = await contract.getMerchantBalance(walletAddress);
      setBalance(ethers.utils.formatEther(rawBalance));
    } catch (error) {
      console.error("Gagal mengambil saldo:", error);
      alert("Gagal mengambil saldo");
    }
  };

  const withdraw = async () => {
    if (!window.ethereum) {
      alert("Install Metamask");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, MerchantABI, signer);

    try {
      const tx = await contract.withdraw();
      await tx.wait();
      getBalance();
      alert("Penarikan berhasil!");
    } catch (error) {
      console.error("Withdraw gagal", error);
      alert("Penarikan gagal");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (walletAddress) {
      getBalance();
    }
  }, [walletAddress]);

  return (
    <div className="merchant-container">
      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p><strong>Merchant Wallet:</strong> {walletAddress}</p>
          <p><strong>Saldo di Kontrak:</strong> {balance} ETH</p>

          <button onClick={generateStaticQR}>Generate QR Statis</button>

          {qrData && (
            <div className="qr-wrapper">
              <p>QR Code Merchant (URL):</p>
              <QRCodeCanvas value={qrData} size={200} />
              <p className="qr-link">Atau buka link: <a href={qrData} target="_blank" rel="noopener noreferrer">{qrData}</a></p>
            </div>
          )}

          <button onClick={withdraw} className="withdraw-btn">Tarik Saldo</button>
        </>
      )}
    </div>
  );
};

export default MerchantPage;