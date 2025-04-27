import express from 'express';
import { ethers } from 'ethers';  // Menggunakan ethers versi 6.x.x
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config(); // Memuat variabel lingkungan dari file .env

const app = express();
app.use(express.json());

const contractPath = './artifacts/contracts/QuantumPay.sol/QuantumPay.json';
const contractData = JSON.parse(fs.readFileSync(contractPath));
const abi = contractData.abi;
const contractAddress = '0xdFE13eFc1bb47b6E1D4b213aABe135b2288B1c9c';

// Mendapatkan provider dan signer dari private key
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Membuat instance kontrak
const contract = new ethers.Contract(contractAddress, abi, signer);

// Endpoint untuk cek saldo
app.get('/balance/:address', async (req, res) => {
  try {
    const balance = await contract.getBalance(req.params.address);
    res.json({ address: req.params.address, balance: balance.toString() });
  } catch (e) {
    console.error("Error while fetching balance:", e);
    res.status(400).json({ error: e.message || "Unknown error while fetching balance" });
  }
});

// Endpoint untuk melakukan transfer
app.post('/transfer', async (req, res) => {
  const { to, amount, note } = req.body;

  console.log("Request Body:", req.body);  // Cek apakah data benar diterima

  if (!to || !amount) {
    console.error("Parameter 'to' atau 'amount' tidak ada.");
    return res.status(400).json({ error: "'to' dan 'amount' harus disertakan dalam request body" });
  }

  try {
    console.log("Validating 'to' address:", to);

    // Cek apakah alamat valid menggunakan ethers.isAddress (versi 6)
    if (!ethers.isAddress(to)) {
      console.error("Alamat tujuan tidak valid:", to);
      return res.status(400).json({ error: "Alamat tujuan tidak valid" });
    }

    if (amount <= 0) {
      console.error("Amount harus lebih besar dari 0, tapi ditemukan:", amount);
      return res.status(400).json({ error: "Amount harus lebih besar dari 0" });
    }

    // Cek saldo pengirim
    const senderBalance = await contract.getBalance(signer.address);
    console.log("Saldo pengirim:", senderBalance.toString());

    const parsedAmount = ethers.parseUnits(amount.toString(), 18);  // Memperbaiki pemanggilan parseUnits
    if (senderBalance < parsedAmount) {
      console.error("Saldo pengirim tidak cukup untuk transfer");
      return res.status(400).json({ error: "Saldo tidak cukup" });
    }

    // Lakukan transfer
    const tx = await contract.transfer(to, parsedAmount, note);
    await tx.wait();  // Tunggu transaksi selesai

    console.log("Transfer berhasil dengan hash:", tx.hash);
    res.json({ success: true, hash: tx.hash, to, amount });
  } catch (e) {
    console.error("Error selama transfer:", e);
    res.status(400).json({ error: e.message || "Unknown error during transfer" });
  }
});

app.listen(3000, () => {
  console.log('QuantumPay API aktif di http://localhost:3000');
});
