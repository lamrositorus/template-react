import { Endpoint } from "../global/Enpoint";

export async function printReceipt(id) {
  try {
    // Ambil data struk dari backend
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    const response = await fetch(`${Endpoint.printId(id)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();
    console.log('Print API response:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Invalid or expired token. Please log in again.');
      }
      throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
    }

    const { data: printData } = responseData;
    if (!printData) {
      throw new Error('No print data received from server');
    }

    // Minta akses ke port serial
    const port = await navigator.serial.requestPort({});
    await port.open({ baudRate: 9600 });
    console.log('Serial port opened');

    // Buat writer untuk mengirim data
    const writer = port.writable.getWriter();
    const encoder = new TextEncoder();

    // Inisialisasi printer (ESC/POS)
    const initPrinter = new Uint8Array([
      0x1b, 0x40, // ESC @ - Reset
      0x1b, 0x61, 0x00, // ESC a 0 - Align left
      0x1b, 0x4d, 0x01, // ESC M 1 - Font kecil
      0x1d, 0x21, 0x00, // GS ! 0 - Normal text
    ]);
    await writer.write(initPrinter);
    console.log('Printer initialized');

    const esc = '\x1b';
    const gs = '\x1d';
    const commands = [];

    // ==== HEADER ====
    commands.push(`${esc}a\x01`); // Center
    commands.push(`${gs}!2`); // Font 2x
    commands.push('TOKO LAMRO MOTOR\n');
    commands.push(`${gs}!0`); // Normal font
    commands.push('SPAREPART & SERVICE\n');
    commands.push('JLN SIMODULYO PASAR 8\n');
    commands.push('085370352533\n');
    commands.push(`No: ${id.substring(0, 8)}\n`);
    commands.push('==========================================\n');
    commands.push(`${esc}a\x00`); // Align left
    commands.push(`Pelanggan: ${printData.nama_pelanggan?.substring(0, 20) || 'N/A'}\n`);
    if (printData.nama_mekanik) {
      commands.push(`Mekanik  : ${printData.nama_mekanik.substring(0, 20)}\n`);
    }
    commands.push(`Tanggal  : ${new Date(printData.created_at).toLocaleDateString('id-ID')}\n`);
    commands.push('================================\n');

    // ==== TABEL ITEM ====
    commands.push('+------------+---+-------+-------+\n');
    commands.push('|Item        |Jml|Harga  |Sub    |\n');
    commands.push('+------------+---+-------+-------+\n');
    if (printData.items?.length > 0) {
      for (const item of printData.items) {
        const nama = (item.nama_sperpat || 'Unknown').substring(0, 12).padEnd(12);
        const jumlah = item.jumlah.toString().padStart(2).padEnd(3);
        const harga = item.harga_jual.toLocaleString('id-ID').substring(0, 7).padStart(7);
        const subtotal = item.subtotal.toLocaleString('id-ID').substring(0, 7).padStart(7);
        commands.push(`|${nama}|${jumlah}|${harga}|${subtotal}|\n`);
      }
    } else {
      commands.push('| Tidak ada item            |\n');
    }
    commands.push('+------------+---+-------+-------+\n');

    // ==== TOTAL & PEMBAYARAN ====
    commands.push(`${esc}a\x00`); // Align right
    commands.push(`${gs}!1`); // Font besar
    if (printData.ongkos_pasang && printData.ongkos_pasang !== 0) {
      commands.push(`Ongkos: ${printData.ongkos_pasang.toLocaleString('id-ID').padStart(23)}\n`);
    }
    commands.push(`Total : ${printData.total_pembayaran.toLocaleString('id-ID').padStart(23)}\n`);
    commands.push(`Uang  : ${printData.uang_masuk.toLocaleString('id-ID').padStart(23)}\n`);
    commands.push(`Kembali: ${printData.uang_kembalian.toLocaleString('id-ID').padStart(22)}\n`);
    commands.push(`${gs}!0`); // Normal font
    commands.push(`${esc}a\x00`); // Align left
    commands.push('--------------------------------\n');

    // ==== FOOTER ====
    commands.push(`${esc}a\x01`); // Center
    commands.push('TERIMA KASIH\n');
    commands.push('TOKO LAMRO MOTOR\n');
    commands.push('Kualitas Terjamin\n');
    commands.push('==========================================\n');
    commands.push('\n\n\n');

    // Gabung perintah
    const commandString = commands.join('');
    console.log('Print commands:', commandString);

    // Kirim perintah cetak
    await writer.write(encoder.encode(commandString));

    // Potong kertas
    const cutPaper = new Uint8Array([0x1d, 0x56, 0x00]); // GS V 0 - Full cut
    await writer.write(cutPaper);
    console.log('Paper cut sent');

    // Tutup writer dan port
    await writer.releaseLock();
    await port.close();
    console.log('Print commands sent successfully via USB');

    return true;
  } catch (error) {
    console.error('Print error:', error);
    throw new Error(`Gagal mencetak struk: ${error.message}`);
  }
}