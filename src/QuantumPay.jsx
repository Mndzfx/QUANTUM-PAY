import './QuantumPay.css';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from './abi.json';

const CONTRACT_ADDRESS = '0x6d0148e50F0bdb96317833CC836e74372f330dA2'; // Ganti dengan alamat smart contract Anda

const QuantumPay = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [transactionHistory, setTransactionHistory] = useState([]); // Menyimpan riwayat transaksi

  // Fungsi untuk menghubungkan wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert('Install Metamask dulu');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
    } catch (err) {
      console.error(err);
    }
  };

  // Fungsi untuk mendapatkan saldo
  const getBalance = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      const result = await contract.getBalance(walletAddress);
      setBalance(ethers.formatEther(result)); // Mengonversi hasil menjadi ether
    } catch (err) {
      console.error(err);
    }
  };

  // Fungsi untuk mengirim transaksi ke blockchain setelah melewati AI (deteksi fraud)
  const sendTransfer = async () => {
    const tx_time = new Date().getHours();
    const txData = {
      amount: parseFloat(amount),
      is_foreign: toAddress.startsWith('0x') ? 1 : 0,
      is_large_transaction: parseFloat(amount) > 5000 ? 1 : 0,
      tx_time: tx_time,
      user_history_score: 0.7, // Nilai ini bisa diubah berdasarkan data riil pengguna
    };

    // Mengirim data transaksi untuk dianalisis oleh AI
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(txData),
      });

      const result = await response.json();

      // Menyimpan hasil analisis
      setMessage(result.status);
      setTransactionHistory(prevHistory => [
        ...prevHistory,
        {
          amount: amount,
          toAddress: toAddress,
          status: result.status,
          prediction: result.prediction === 0 ? "Aman" : "Mencurigakan",
          confidence: result.confidence,
        },
      ]);

      // Jika transaksi aman, lanjutkan dengan proses pengiriman
      if (result.status === "Transaksi Aman") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
        
        // Mengirimkan transaksi ke smart contract
        const tx = await contract.transfer(toAddress, ethers.parseEther(amount), note);
        
        setMessage('Mengirim transaksi...');
        await tx.wait(); // Menunggu transaksi selesai
        setMessage('Transfer berhasil!');
        getBalance(); // Perbarui saldo setelah transaksi
      } else {
        setMessage("Transaksi DIBLOKIR: Deteksi Potensi Penipuan!");
      }
    } catch (err) {
      console.error("Error dalam pengiriman atau deteksi transaksi:", err);
      setMessage('Transfer gagal: ' + err.message);
    }
  };

  useEffect(() => {
    if (walletAddress) getBalance();
  }, [walletAddress]);

  return (
    <div className="quantum-card">
      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p><strong>Address:</strong> {walletAddress}</p>
          <p><strong>Saldo:</strong> {balance} QPAY</p>

          <input 
            placeholder="Alamat Tujuan" 
            value={toAddress} 
            onChange={e => setToAddress(e.target.value)} 
          />
          <input 
            placeholder="Jumlah (ETH)" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
          />
          <input 
            placeholder="Catatan" 
            value={note} 
            onChange={e => setNote(e.target.value)} 
          />
          <button onClick={sendTransfer}>Kirim</button>

          {message && <p className="notif">{message}</p>}

          {/* Menampilkan riwayat transaksi */}
          <h3>Riwayat Transaksi</h3>
          <table>
            <thead>
              <tr>
                <th>Alamat Tujuan</th>
                <th>Jumlah</th>
                <th>Status</th>
                <th>Prediksi</th>
                <th>Kepercayaan</th>
              </tr>
            </thead>
            <tbody>
              {transactionHistory.map((txn, index) => (
                <tr key={index}>
                  <td>{txn.toAddress}</td>
                  <td>{txn.amount}</td>
                  <td>{txn.status}</td>
                  <td>{txn.prediction}</td>
                  <td>{txn.confidence ? txn.confidence : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default QuantumPay;