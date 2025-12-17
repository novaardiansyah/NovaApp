# Commit

- Menambahkan tombol fab pada skeleton detail transaksi
- Refaktor fungsi delete transaksi menjadi reusable
- Membersihkan kode dari variabel tidak digunakan serta penyesuaian format kode

# TASK

- detail transaksi: screens\ViewPaymentDetailsScreen.tsx
- list transaksi: screens\AllTransactionsScreen.tsx

1. pada detail transaksi: perlu skeleton ditambah fab agar terlihat saat loading bahwa disitu ada button (DONE)
2. handleDeletePayment dan confirmDeletePayment ini sepertinya bisa diubah menjadi reusable karena digunakan pada detail transaksi dan list transaksi (DONE)
