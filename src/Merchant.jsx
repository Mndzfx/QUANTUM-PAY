// src/pages/MerchantPage.jsx

import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './Merchant.css';

const MerchantPage = () => {
  const dummyMerchantName = "Toko Kimang";
  const dummyMerchantId = "1234567890";
  const dummyBalance = "1.25"; // Saldo dummy dalam ETH
  const qrData = "https://quantum-pay-mu.vercel.app/pay"; // Dummy URL QR

  return (
    <div className="merchant-container">
      <div className="merchant-card">
        <div className="merchant-header">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/0/0a/QRIS_logo.svg" 
            alt="QRIS Logo" 
            className="qris-logo"
          />
        </div>

        <div className="qr-section">
          <QRCodeCanvas value={qrData} size={220} />
        </div>

        <div className="merchant-info">
          <h2 className="merchant-name">{dummyMerchantName}</h2>
          <p className="merchant-id">ID Merchant: {dummyMerchantId}</p>
          <p className="merchant-balance">Saldo: {dummyBalance} ETH</p>
        </div>

        <div className="payment-note">
          <p>Scan QR untuk melakukan pembayaran</p>
        </div>
      </div>
    </div>
  );
};

export default MerchantPage;