import { useRouter } from 'next/router';
import { useState } from 'react';

export default function PayPage() {
  const router = useRouter();
  const { merchant } = router.query;

  const [paid, setPaid] = useState(false);

  const handlePay = () => {
    setPaid(true);
  };

  if (!merchant) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h1>Pembayaran QRIS</h1>
      <p><strong>Merchant:</strong> {merchant}</p>
      <p><strong>Jumlah:</strong> Rp 25.000</p>

      {!paid ? (
        <button onClick={handlePay} style={{ padding: 10, fontSize: 18, backgroundColor: 'green', color: 'white' }}>
          Bayar Sekarang
        </button>
      ) : (
        <h2 style={{ color: 'green' }}>Pembayaran Berhasil!</h2>
      )}
    </div>
  );
}