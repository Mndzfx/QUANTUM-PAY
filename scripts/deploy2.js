import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const Merchant = await ethers.getContractFactory("Merchant");
  const merchant = await Merchant.deploy();

  // Tunggu hingga kontrak ter-deploy
  await merchant.waitForDeployment();

  // Log alamat kontrak
  console.log(`Merchant contract deployed to: ${(await merchant.getAddress())}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
