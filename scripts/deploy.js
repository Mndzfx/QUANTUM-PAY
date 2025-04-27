import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  // Deploy QuantumPay Contract
  const QuantumPay = await ethers.getContractFactory("QuantumPay");
  const quantumPay = await QuantumPay.deploy();
  await quantumPay.waitForDeployment();
  console.log("QuantumPay deployed to:", await quantumPay.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
