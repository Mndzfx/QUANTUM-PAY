import React, { useState } from 'react';
import { ethers } from 'ethers';
import QrReader from 'react-qr-reader';
import MerchantABI from './Merchant.json'; // Pastikan ABI-nya benar
import './Customer.css';

const CONTRACT_ADDRESS = '0x3DFa87611a0385C9711e2638337eD01f3eFB6818';

const CustomerPage = () => {
  const [scannedData, setScannedData] = useState(null);
  const [status, setStatus] = useState('');

  const handleScan = (data) => {
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setScannedData(parsed);
      } catch (error) {
        console.error("Invalid QR data:", error);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const sendPayment = async () => {
    if (!window.ethereum) return alert("Install Metamask");

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MerchantABI, signer);

      const tx = await contract.pay(
        scannedData.merchant,
        scannedData.note || "",
        { value: ethers.utils.parseEther(scannedData.amount) }
      );

      setStatus(`Berhasil! Tx Hash: ${tx.hash}`);
    } catch (error) {
      console.error(error);
      setStatus('Gagal mengirim pembayaran');
    }
  };

  return (
    <div className="customer-container">
      {!scannedData ? (
        <>
          <h3>Scan QR Merchant</h3>
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
        </>
      ) : (
        <>
          <h3>Detail Pembayaran</h3>
          <p><strong>Merchant:</strong> {scannedData.merchant}</p>
          <p><strong>Jumlah:</strong> {scannedData.amount} ETH</p>
          {scannedData.note && <p><strong>Catatan:</strong> {scannedData.note}</p>}

          <button onClick={sendPayment}>Bayar Sekarang</button>
          {status && <div className="status">{status}</div>}
        </>
      )}
    </div>
  );
};

export default CustomerPage;