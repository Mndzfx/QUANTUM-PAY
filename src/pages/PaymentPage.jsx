import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './PaymentPage.css';

const PaymentPage = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');

  const paymentMethods = [
    'Pilih Metode Pembayaran',
    'BCA',
    'BNI',
    'Gopay',
    'Dana',
    'Indomaret',
  ];

  // Hook untuk mendapatkan query parameter dari URL
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const amountFromURL = params.get('amount');
    if (amountFromURL) {
      setAmount(amountFromURL);  // Set nilai amount dari URL jika ada
    }
  }, [location]);

  const handlePayment = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Harap masukkan jumlah yang valid.');
      return;
    }
    if (!paymentMethod || paymentMethod === 'Pilih Metode Pembayaran') {
      setError('Harap pilih metode pembayaran.');
      return;
    }
    setError('');
    alert(`Pembayaran berhasil dengan jumlah: ${amount} ETH menggunakan ${paymentMethod}`);
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h1>Halaman Pembayaran</h1>
        <p>Masukkan jumlah yang ingin dibayar</p>
        
        {/* Input untuk jumlah */}
        <div className="input-group">
          <label htmlFor="amount">Jumlah Pembayaran (ETH): </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Masukkan jumlah pembayaran"
          />
        </div>

        {/* Dropdown untuk memilih metode pembayaran */}
        <div className="input-group">
          <label htmlFor="paymentMethod">Metode Pembayaran: </label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            {paymentMethods.map((method, index) => (
              <option key={index} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        {/* Menampilkan pesan error */}
        {error && <p className="error-message">{error}</p>}

        {/* Tombol untuk melanjutkan pembayaran */}
        <button onClick={handlePayment} className="pay-button">
          Lanjutkan Pembayaran
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;