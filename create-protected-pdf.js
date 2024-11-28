// Import modul yang dibutuhkan
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const prompt = require('prompt-sync')();
const { exec } = require('child_process');

// Fungsi utama
async function createProtectedPDF() {
  try {
    // Meminta nama pengguna dan tanggal lahir
    const name = prompt('Masukkan nama Anda: ');
    const dob = prompt('Masukkan tanggal lahir Anda (DDMMYYYY): ');

    // Membuat dokumen PDF baru
    const pdfDoc = await PDFDocument.create();

    // Menambahkan halaman dan teks
    const page = pdfDoc.addPage();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    page.drawText(`Halo, ${name}!`, {
      x: 50,
      y: 700,
      size: 24,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    page.drawText(`Ini adalah PDF yang dilindungi password.`, {
      x: 50,
      y: 650,
      size: 18,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    // Mengatur password enkripsi
    const password = dob;
    const pdfBytes = await pdfDoc.save({
      encrypt: {
        ownerPassword: password,
        userPassword: password,
        permissions: {
          printing: 'highResolution',
          modifying: false,
          copying: false,
        },
      },
    });

    // Menyimpan file PDF
    fs.writeFileSync('protected.pdf', pdfBytes);

    // Menampilkan pesan
    console.log('PDF berhasil dibuat dan dilindungi dengan password!');
    console.log('Nama file: protected.pdf');
    console.log('Gunakan password yang anda buat untuk membuka file!');

    // Meminta password dari pengguna untuk membuka PDF
    console.log('\nPassword required');
    console.log('This document is password protected. Please enter a password.');
    const inputPassword = prompt('Password: ');

    // Memverifikasi password
    if (inputPassword === password) {
      console.log('Password benar. Membuka PDF...');

      // Membuka PDF melalui terminal bash
      let command;
      if (process.platform === 'win32') {
        // Untuk Windows
        command = 'start "" "protected.pdf"';
      } else if (process.platform === 'darwin') {
        // Untuk macOS
        command = 'open "protected.pdf"';
      } else {
        // Untuk Linux
        command = 'xdg-open "protected.pdf"';
      }

      exec(command, (error) => {
        if (error) {
          console.error('Gagal membuka PDF:', error);
        }
      });
    } else {
      console.log('Password salah. Tidak dapat membuka PDF.');
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  }
}

// Menjalankan fungsi utama
createProtectedPDF();
