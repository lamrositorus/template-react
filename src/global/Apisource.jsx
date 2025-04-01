import { Endpoint } from './Enpoint';

export class API_Source {
  static async login(username, password) {
    try {
      console.log('Attempting login with:', { username, password });
      const response = await fetch(Endpoint.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      const text = await response.text();
      console.log('Raw response body:', text);

      // Periksa tipe konten
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 50)}...`);
      }

      if (!response.ok) {
        const errorData = text ? JSON.parse(text) : { message: `Server error: ${response.status}` };
        throw new Error(`${errorData.message} (Status: ${response.status})`);
      }

      const data = JSON.parse(text);
      console.log('Parsed response data:', data);

      const token = data.data.token;
      const userId = data.data.id;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      return data.data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message);
    }
  }

  static async getDashboard(params = {}) {
    try {
      const token = localStorage.getItem('token');
      const url = new URL(Endpoint.dashboard); // Misalnya, http://localhost:5000/dashboard
      Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
      
      console.log('Request URL:', url.toString()); // Debug
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }




  static async getAllInventaris() {
    try {
      const response = await fetch(Endpoint.inventaris, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const text = await response.text();
      console.log('Raw inventaris response:', text);

      if (!response.ok) {
        const errorData = text ? JSON.parse(text) : { message: `Server error: ${response.status}` };
        throw new Error(errorData.message);
      }

      const data = JSON.parse(text);
      return data.data;
    } catch (error) {
      console.error('Get inventaris error:', error);
      throw new Error(error.message);
    }
  }
  static async createKategori(nama) {
    try {
      const response = await fetch(Endpoint.inventarisKategori, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async createMekanik(nama) {
    try {
      const response = await fetch(Endpoint.inventarisMekanik, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  

  static async createPengeluaran(jumlah, deskripsi) {
    try {
      const response = await fetch(Endpoint.inventarisPengeluaran, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jumlah, deskripsi }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async createModal(jumlah, tanggal) {
    try {
      const response = await fetch(Endpoint.inventarisModal, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jumlah, tanggal }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async createStokMasuk(sperpat_id, jumlah, keterangan) {
    try {
      const response = await fetch(Endpoint.inventarisStok, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sperpat_id, jumlah, keterangan }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getSparepart() {
    const token = localStorage.getItem('token');
    console.log('Token dari localStorage:', token); // Debug: Periksa token
    try {
      const response = await fetch(Endpoint.inventarisSparepart, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      console.log('Respons API sparepart:', data); // Debug: Periksa respons penuh
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  static async createSparepart(nama, kode, kategori_id, stok = 0) {
    try {
      const response = await fetch(Endpoint.inventarisSparepart, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama, kode, kategori_id, stok }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  static async updateSparepart(id, nama, kode, kategori_id, stok) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${Endpoint.inventarisSparepartById(id)}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama, kode, kategori_id, stok }),
      });

      const text = await response.text();
      console.log('Raw update sparepart response:', text);

      if (!response.ok) {
        const errorData = text ? JSON.parse(text) : { message: `Server error: ${response.status}` };
        throw new Error(errorData.message);
      }

      const data = JSON.parse(text);
      return data.data;
    } catch (error) {
      console.error('Update sparepart error:', error);
      throw new Error(error.message);
    }
  }

  static async deleteSparepart(id) {
    try {
      const token = localStorage.getItem('token'); // Ambil token dari localStorage
      if (!token) {
        throw new Error('Tidak ada token autentikasi tersedia. Silakan login kembali.');
      }

      console.log('Mengirim DELETE request untuk ID:', id);
      const response = await fetch(`${Endpoint.inventarisSparepartById(id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Tambahkan header Authorization
        },
      });
      console.log('Status respons DELETE:', response.status);

      const result = await response.json();
      console.log('Raw delete sparepart response:', result);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${result.message || 'Unknown error'}`);
      }

      return { status: response.status, data: result };
    } catch (error) {
      console.error('Error di deleteSparepart:', error);
      throw error;
    }
  }

  static async getKategori() {
    try {
      const response = await fetch(Endpoint.inventarisKategori, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getMekanik() {
    try {
      const response = await fetch(Endpoint.inventarisMekanik, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getPengeluaran() {
    try {
      const response = await fetch(Endpoint.inventarisPengeluaran, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getModal() {
    try {
      const response = await fetch(Endpoint.inventarisModal, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getStokMasuk() {
    try {
      const response = await fetch(Endpoint.inventarisStok, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // Fungsi Transaksi Baru
  static async createTransaksi({
    nama_pelanggan,
    mekanik_id,
    items,
    is_grosir,
    uang_masuk,
    ongkos_pasang,
  }) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(Endpoint.transaksi, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama_pelanggan,
          mekanik_id,
          items,
          is_grosir,
          uang_masuk,
          ongkos_pasang,
        }),
      });

      const text = await response.text();
      console.log('Raw create transaksi response:', text);

      if (!response.ok) {
        const errorData = text ? JSON.parse(text) : { message: `Server error: ${response.status}` };
        throw new Error(errorData.message);
      }

      const data = JSON.parse(text);
      return data.data;
    } catch (error) {
      console.error('Create transaksi error:', error);
      throw new Error(error.message);
    }
  }

  static async getAllTransaksi() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(Endpoint.transaksi, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();
      console.log('Raw get all transaksi response:', text);

      if (!response.ok) {
        const errorData = text ? JSON.parse(text) : { message: `Server error: ${response.status}` };
        throw new Error(errorData.message);
      }

      const data = JSON.parse(text);
      return data.data; // Mengembalikan { transactions: [], total_keuntungan }
    } catch (error) {
      console.error('Get all transaksi error:', error);
      throw new Error(error.message);
    }
  }

  static async getTransaksiById(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${Endpoint.transaksi}/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();
      console.log('Raw get transaksi by id response:', text);

      if (!response.ok) {
        const errorData = text ? JSON.parse(text) : { message: `Server error: ${response.status}` };
        throw new Error(errorData.message);
      }

      const data = JSON.parse(text);
      return data.data;
    } catch (error) {
      console.error('Get transaksi by id error:', error);
      throw new Error(error.message);
    }
  }
  // Tambahan Fungsi Laporan
  static async getDailyReport(date) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${Endpoint.laporan}/daily/${date}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();
      console.log('Raw daily report response:', text);

      if (!response.ok) {
        const errorData = text ? JSON.parse(text) : { message: `Server error: ${response.status}` };
        throw new Error(errorData.message);
      }

      const data = JSON.parse(text);
      return data.data;
    } catch (error) {
      console.error('Get daily report error:', error);
      throw new Error(error.message);
    }
  }

  static async getWeeklyReport(startDate, endDate) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${Endpoint.laporan}/weekly/${startDate}/${endDate}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();
      console.log('Raw weekly report response:', text);

      if (!response.ok) {
        const errorData = text ? JSON.parse(text) : { message: `Server error: ${response.status}` };
        throw new Error(errorData.message);
      }

      const data = JSON.parse(text);
      return data.data;
    } catch (error) {
      console.error('Get weekly report error:', error);
      throw new Error(error.message);
    }
  }

  static async getMonthlyReport(year, month) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${Endpoint.laporan}/monthly/${year}/${month}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();
      console.log('Raw monthly report response:', text);

      if (!response.ok) {
        const errorData = text ? JSON.parse(text) : { message: `Server error: ${response.status}` };
        throw new Error(errorData.message);
      }

      const data = JSON.parse(text);
      return data.data;
    } catch (error) {
      console.error('Get monthly report error:', error);
      throw new Error(error.message);
    }
  }
  static async getLaporanMekanik({ mekanik_id, start_date, end_date }) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const queryParams = new URLSearchParams();
      if (mekanik_id) queryParams.append('mekanik_id', mekanik_id);
      if (start_date) queryParams.append('start_date', start_date);
      if (end_date) queryParams.append('end_date', end_date);

      const url = `${Endpoint.laporanMekanik}?${queryParams.toString()}`;
      console.log('Fetching laporan mekanik dari URL:', url); // Debug URL

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status); // Debug status
      console.log('Response headers:', Object.fromEntries(response.headers.entries())); // Debug header

      const text = await response.text();
      console.log('Raw laporan mekanik response:', text); // Respons mentah

      // Periksa Content-Type
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 50)}...`);
      }

      if (!response.ok) {
        const errorData = text ? JSON.parse(text) : { message: `Server error: ${response.status}` };
        throw new Error(errorData.message);
      }

      const data = JSON.parse(text);
      console.log('laporan_mekanik: ', data.message);
      return data;
    } catch (error) {
      console.error('Get laporan mekanik error:', error);
      throw new Error(error.message);
    }
  }


}
