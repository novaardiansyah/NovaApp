---
description: Panduan commit dan push git
---

Cek pada file `.agent\.docs\task.md` kemudian temukan catatan commit disana (WAJIB ABAIKAN BAGIAN LAIN), kemudian sempurnakan pesan commit agar relevan dan profesional mengikuti ketentuan berikut: 

# Rules

- Kamu hanya mengelola pesan yang ada, tidak perlu cek perubahan atau perintah git apapun.

**Ketentuan:**

* Gunakan prefix: `feat`, `fix`, `refactor`, `docs`, `style`, `chore`.
* Maksimal **3 bullet point**.
* Ubah pesan commit kedalam bahasa Inggris
* Format harus seperti contoh berikut:

```text
fix(ui): resolve issues

- Fix A...
- Fix B...
- Misc. improvement
```

Setelah pesan siap lakukan `git commit -m <pesan>` dan push dengan `git push origin main`.