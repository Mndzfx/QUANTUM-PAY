// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Merchant {
    struct Payment {
        address from;
        uint256 amount;
        string note;
        uint256 timestamp;
    }

    address public owner;
    mapping(address => Payment[]) public merchantPayments;
    mapping(address => uint256) public merchantBalances;

    constructor() {
        owner = msg.sender;
    }

    // Pembayaran ke merchant tertentu
    function pay(address merchant, string memory note) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(merchant != address(0), "Invalid merchant address");

        // Simpan data pembayaran
        merchantPayments[merchant].push(Payment({
            from: msg.sender,
            amount: msg.value,
            note: note,
            timestamp: block.timestamp
        }));

        // Tambah saldo merchant
        merchantBalances[merchant] += msg.value;
    }

    // Merchant ambil saldo miliknya
    function withdraw() external {
        uint256 balance = merchantBalances[msg.sender];
        require(balance > 0, "No balance to withdraw");

        merchantBalances[msg.sender] = 0;
        payable(msg.sender).transfer(balance);
    }

    // Lihat semua pembayaran yang masuk ke merchant
    function getMerchantPayments(address merchant) external view returns (Payment[] memory) {
        return merchantPayments[merchant];
    }

    // Lihat saldo merchant
    function getMerchantBalance(address merchant) external view returns (uint256) {
        return merchantBalances[merchant];
    }

    // Owner bisa cek semua ETH dalam kontrak
    function getTotalContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}