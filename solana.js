const Excel = require('exceljs');
const bip39 = require('bip39');
const { Keypair } = require('@solana/web3.js');
const { mnemonicToSeedSync } = require('bip39');

// 生成包含助记词的Solana钱包
function generateWalletWithMnemonic() {
  const mnemonic = bip39.generateMnemonic(); // 生成助记词
  const seed = mnemonicToSeedSync(mnemonic); // 从助记词生成种子
  const keypair = Keypair.fromSeed(seed.slice(0, 32)); // 使用种子的前32字节生成Solana密钥对

  // 转换私钥为十六进制字符串
  const privateKeyHex = Array.from(keypair.secretKey)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return {
    address: keypair.publicKey.toString(),
    mnemonic: mnemonic,
    privateKey: privateKeyHex, // 十六进制字符串形式的私钥
  };
}

async function exportWalletsToExcel(wallets) {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Wallets');

  // 钱包地址、助记词、私钥
  worksheet.addRow(['Address', 'Mnemonic', 'PrivateKey']);

  // 新增钱包数据
  wallets.forEach((wallet) => {
    worksheet.addRow([wallet.address, wallet.mnemonic, wallet.privateKey]);
  });

  // 写入文件
  await workbook.xlsx.writeFile('solana_wallets.xlsx');
}

async function main(quantity) {
  const numberOfWallets = quantity;
  let wallets = [];

  for (let i = 0; i < numberOfWallets; i++) {
    wallets.push(generateWalletWithMnemonic());
  }

  await exportWalletsToExcel(wallets);
  console.log(
    `${numberOfWallets} wallets have been successfully exported to solana_wallets.xlsx`,
  );
}

main(10).catch((error) => console.error(error)); // 输入你想生成的钱包数量
