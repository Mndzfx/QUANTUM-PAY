// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract QuantumPay {
    address public owner;

    // Event untuk transfer saldo
    event Transferred(address indexed from, address indexed to, uint256 amount, string note);
    // Event untuk pencatatan transaksi prediksi AI
    event RecordedTransaction(
        address indexed from,
        uint256 amount, 
        bool is_foreign, 
        bool is_large_transaction, 
        uint256 tx_time, 
        uint256 user_history_score, 
        uint8 prediction, 
        uint8 confidence
    );

    // Mapping untuk menyimpan saldo setiap alamat
    mapping(address => uint256) public balances;

    // Constructor, memberi saldo awal kepada pemilik kontrak
    constructor() {
        owner = msg.sender;
        balances[owner] = 1000000 * (10 ** 18); // Token awal (1 juta token)
    }

    // Fungsi untuk mendapatkan saldo pengguna
    function getBalance(address user) public view returns (uint256) {
        return balances[user];
    }

    // Fungsi untuk mentransfer saldo antar pengguna
    function transfer(address to, uint256 amount, string memory note) public {
        require(balances[msg.sender] >= amount, "Saldo tidak cukup");
        require(to != address(0), "Alamat tujuan tidak valid");

        balances[msg.sender] -= amount;
        balances[to] += amount;

        // Memicu event Transferred setelah transfer berhasil
        emit Transferred(msg.sender, to, amount, note);
    }

    // Fungsi untuk mencatat transaksi prediksi AI ke blockchain
    function recordTransaction(
        uint256 amount, 
        bool is_foreign, 
        bool is_large_transaction, 
        uint256 tx_time, 
        uint256 user_history_score, 
        uint8 prediction, 
        uint8 confidence
    ) public {
        // Memicu event RecordedTransaction setelah transaksi tercatat
        emit RecordedTransaction(
            msg.sender, 
            amount, 
            is_foreign, 
            is_large_transaction, 
            tx_time, 
            user_history_score, 
            prediction, 
            confidence
        );
    }
}