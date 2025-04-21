const { app, BrowserWindow, ipcMain } = require('electron');
const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });
  win.loadURL('http://localhost:5173'); // Port Vite Anda
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('print-receipt', async (event, printData) => {
  try {
    console.log('Printing receipt:', printData);
    const device = new escpos.USB();
    const printer = new escpos.Printer(device);

    device.open(() => {
      printer
        .font('a')
        .align('ct')
        .style('bu')
        .size(1, 1)
        .text('TOKO SPAREPART')
        .text('--------------------------------')
        .align('lt')
        .text(`Tanggal: ${new Date(printData.created_at).toLocaleString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}`)
        .text(`Pelanggan: ${printData.nama_pelanggan.slice(0, 20)}`)
        .text(printData.nama_mekanik ? `Mekanik: ${printData.nama_mekanik.slice(0, 20)}` : '')
        .text('--------------------------------')
        .tableCustom([
          { text: 'No', width: 0.1 },
          { text: 'Barang', width: 0.4 },
          { text: 'Jml', width: 0.2, align: 'RIGHT' },
          { text: 'Harga', width: 0.3, align: 'RIGHT' },
        ]);

      printData.items.forEach((item, index) => {
        printer.tableCustom([
          { text: `${index + 1}`, width: 0.1 },
          { text: item.nama_sperpat.slice(0, 12), width: 0.4 },
          { text: item.jumlah.toString(), width: 0.2, align: 'RIGHT' },
          { text: item.harga_jual, width: 0.3, align: 'RIGHT' },
        ]);
      });

      printer
        .text('--------------------------------')
        .align('rt')
        .text(`Subtotal      Rp${printData.items.reduce((sum, item) => {
          const harga = parseFloat(item.harga_jual.replace(/[^0-9.-]+/g, ''));
          return sum + harga * item.jumlah;
        }, 0).toLocaleString('id-ID')}`)
        .text(`Ongkos Pasang Rp${printData.ongkos_pasang}`)
        .text(`Total         Rp${printData.total_pembayaran}`)
        .text(`Uang Masuk    Rp${printData.uang_masuk}`)
        .text(`Kembalian     Rp${printData.uang_kembalian}`)
        .text('--------------------------------')
        .align('ct')
        .text('Terima Kasih!')
        .cut()
        .close();
    });

    return 'Print successful';
  } catch (error) {
    console.error('Print error:', error);
    throw new Error('Failed to print receipt');
  }
});