export const roles = {
  adm: {
    canAccess: [
      '/dashboard',
      '/siswa',
      '/guru',
      '/kelas',
      '/mataPelajaran',
      '/transaksiKeuangan',
      '/kehadiran',
      '/pengguna',
    ],
  },
  tea: {
    canAccess: ['/dashboard', '/siswa', '/kelas', '/mataPelajaran', '/kehadiran'],
  },
  stu: {
    canAccess: ['/dashboard', '/siswa', '/kelas'],
  },
};
