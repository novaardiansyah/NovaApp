import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { PaperProvider, Appbar, Text } from 'react-native-paper';
import { Theme } from '@/constants/colors';
import { statusBarConfig } from '@/styles';
import { legalScreenStyles as styles } from '@/styles/LegalScreenStyles';
import APP_CONFIG from '@/config/app';

interface TermsOfServiceScreenProps {
  navigation: any;
}

const TermsOfServiceScreen: React.FC<TermsOfServiceScreenProps> = ({ navigation }) => {

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <StatusBar {...statusBarConfig} />

        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Syarat dan Ketentuan" />
        </Appbar.Header>

        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.firstSectionTitle}>1. Penerimaan Syarat</Text>
            <Text style={styles.sectionContent}>
              Dengan mengakses dan menggunakan NovaApp, Anda menerima dan setuju untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan syarat dan ketentuan ini, Anda tidak boleh menggunakan aplikasi kami.
            </Text>

            <Text style={styles.sectionTitle}>2. Deskripsi Layanan</Text>
            <Text style={styles.sectionContent}>
              NovaApp adalah aplikasi manajemen keuangan pribadi yang membantu pengguna untuk:
            </Text>
            <Text style={styles.listItem}>• Mencatat pendapatan dan pengeluaran</Text>
            <Text style={styles.listItem}>• Membuat dan mengelola anggaran</Text>
            <Text style={styles.listItem}>• Melihat laporan keuangan</Text>
            <Text style={styles.listItem}>• Menetapkan tujuan keuangan</Text>
            <Text style={styles.listItem}>• Melacak transaksi dan pembayaran</Text>

            <Text style={styles.sectionTitle}>3. Kewajiban Pengguna</Text>
            <Text style={styles.sectionContent}>
              Sebagai pengguna NovaApp, Anda setuju untuk:
            </Text>
            <Text style={styles.listItem}>• Memberikan informasi yang akurat dan lengkap</Text>
            <Text style={styles.listItem}>• Menjaga kerahasiaan akun dan kata sandi Anda</Text>
            <Text style={styles.listItem}>• Menggunakan aplikasi hanya untuk tujuan yang sah</Text>
            <Text style={styles.listItem}>• Tidak melakukan aktivitas yang melanggar hukum</Text>
            <Text style={styles.listItem}>• Menghormati hak pengguna lain</Text>

            <Text style={styles.sectionTitle}>4. Privasi dan Data</Text>
            <Text style={styles.sectionContent}>
              Kami mematuhi Kebijakan Privasi kami dalam pengumpulan, penggunaan, dan perlindungan data pribadi Anda. Dengan menggunakan NovaApp, Anda menyetujui pengumpulan dan penggunaan data Anda sesuai dengan kebijakan privasi kami.
            </Text>

            <Text style={styles.sectionTitle}>5. Hak Kekayaan Intelektual</Text>
            <Text style={styles.sectionContent}>
              NovaApp dan seluruh kontennya, termasuk namun tidak terbatas pada perangkat lunak, teks, grafik, logo, dan ikon, dilindungi oleh hak cipta dan hukum kekayaan intelektual lainnya. Anda tidak boleh mereproduksi, mendistribusikan, atau membuat karya turunan dari aplikasi kami tanpa izin tertulis.
            </Text>

            <Text style={styles.sectionTitle}>6. Batasan Tanggung Jawab</Text>
            <Text style={styles.sectionContent}>
              NovaApp disediakan "sebagaimana adanya" tanpa jaminan dalam bentuk apa pun. Kami tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan aplikasi kami.
            </Text>

            <Text style={styles.sectionTitle}>7. Layanan Pihak Ketiga</Text>
            <Text style={styles.sectionContent}>
              Aplikasi kami mungkin mengandung tautan ke layanan pihak ketiga atau mengintegrasikan layanan pihak ketiga. Kami tidak bertanggung jawab atas praktik privasi atau konten layanan pihak ketiga tersebut.
            </Text>

            <Text style={styles.sectionTitle}>8. Pembatalan dan Penghentian</Text>
            <Text style={styles.sectionContent}>
              Kami berhak untuk membatalkan atau menghentikan akun Anda kapan saja jika Anda melanggar syarat dan ketentuan ini. Anda juga dapat menghapus akun Anda kapan saja melalui pengaturan aplikasi.
            </Text>

            <Text style={styles.sectionTitle}>9. Perubahan Syarat dan Ketentuan</Text>
            <Text style={styles.sectionContent}>
              Kami berhak untuk mengubah syarat dan ketentuan ini kapan saja. Perubahan akan berlaku efektif segera setelah diposting dalam aplikasi. Penggunaan berkelanjutan Anda dari aplikasi setelah perubahan menandakan penerimaan Anda terhadap syarat dan ketentuan yang diperbarui.
            </Text>

            <Text style={styles.sectionTitle}>10. Hukum yang Berlaku</Text>
            <Text style={styles.sectionContent}>
              Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum yang berlaku. Setiap sengketa yang timbul dari atau sehubungan dengan syarat dan ketentuan ini akan diselesaikan melalui arbitrase yang mengikat.
            </Text>

            <Text style={styles.sectionTitle}>11. Hubungi Kami</Text>
            <Text style={styles.sectionContent}>
              Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami di:
            </Text>
            <Text style={styles.contactInfo}>Email: {APP_CONFIG.SUPPORT_EMAIL}</Text>
            <Text style={styles.contactInfo}>Alamat: {APP_CONFIG.OFFICE_ADDRESS}</Text>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Dengan menggunakan NovaApp, Anda mengakui bahwa telah membaca, memahami, dan menyetujui syarat dan ketentuan ini.
              </Text>
            </View>

            <Text style={styles.lastUpdated}>Terakhir Diperbarui: 3 November 2025</Text>
          </View>
        </ScrollView>
      </View>
    </PaperProvider>
  );
};


export default TermsOfServiceScreen;