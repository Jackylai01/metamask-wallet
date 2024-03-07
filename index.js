const Excel = require('exceljs');
const { ethers } = require('ethers');

// 連結到以太坊
function generateWallet() {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    mnemonic: wallet.mnemonic.phrase,
    privateKey: wallet.privateKey,
  };
}

async function exportWalletsToExcel(wallets) {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Wallets');

  // 錢包地址、註記詞、私鑰
  worksheet.addRow(['Address', 'Mnemonic', 'PrivateKey']);

  // 新增錢包資料
  wallets.forEach((wallet) => {
    worksheet.addRow([wallet.address, wallet.mnemonic, wallet.privateKey]);
  });

  // 寫入檔案
  await workbook.xlsx.writeFile('metamask.xlsx');
}

async function main(quantity) {
  const numberOfWallets = quantity;
  let wallets = [];

  for (let i = 0; i < numberOfWallets; i++) {
    wallets.push(generateWallet());
  }

  await exportWalletsToExcel(wallets);
  console.log(
    `${numberOfWallets} wallets have been successfully exported to wallets.xlsx`,
  );
}

// 運行主函數。在終端機運行 node index.js
main(10).catch((error) => console.error(error)); // 輸入你想生成的錢包數量
