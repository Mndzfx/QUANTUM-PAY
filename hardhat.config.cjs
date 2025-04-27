require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // Mengaktifkan Intermediate Representation (IR) untuk optimasi
    },
  },
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/6s2HrErM2bxDgIkOSjbnab1EJccnt1kI",
      accounts: [
        "0x7cecfe301adf0fa011c92a1dbe3a16822e3e57788860e12b0554d829ede884db",
      ],
    },
  },
};