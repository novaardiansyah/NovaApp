import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Appbar, Text } from 'react-native-paper';
import { Theme } from '@/constants/colors';
import { getScrollContainerStyle, statusBarConfig } from '@/styles';
import { legalScreenStyles as styles } from '@/styles/LegalScreenStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import APP_CONFIG from '@/config/app';

interface PrivacyPolicyScreenProps {
  navigation: any;
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <PaperProvider theme={Theme}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar {...statusBarConfig} />

        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Kebijakan Privasi" />
        </Appbar.Header>

        <ScrollView
          contentContainerStyle={getScrollContainerStyle(insets)}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>1. Informasi yang Kami Kumpulkan</Text>
            <Text style={styles.sectionContent}>
              NovaApp mengumpulkan informasi yang Anda berikan langsung kepada kami, seperti saat membuat akun, memperbarui profil, atau menggunakan layanan kami. Ini termasuk:
            </Text>
            <Text style={styles.listItem}>• Informasi akun (nama, email, kata sandi)</Text>
            <Text style={styles.listItem}>• Data keuangan (pendapatan, pengeluaran, anggaran)</Text>
            <Text style={styles.listItem}>• Informasi profil dan preferensi</Text>
            <Text style={styles.listItem}>• Data penggunaan dan analitik</Text>

            <Text style={styles.sectionTitle}>2. Cara Kami Menggunakan Informasi Anda</Text>
            <Text style={styles.sectionContent}>
              Kami menggunakan informasi yang kami kumpulkan untuk:
            </Text>
            <Text style={styles.listItem}>• Menyediakan dan memelihara layanan kami</Text>
            <Text style={styles.listItem}>• Memproses transaksi dan mengelola akun Anda</Text>
            <Text style={styles.listItem}>• Mengirimkan pemberitahuan teknis dan pesan dukungan</Text>
            <Text style={styles.listItem}>• Meningkatkan layanan kami dan mengembangkan fitur baru</Text>

            <Text style={styles.sectionTitle}>3. Keamanan Informasi</Text>
            <Text style={styles.sectionContent}>
              Kami menerapkan langkah-langkah teknis dan organisasi yang tepat untuk melindungi informasi pribadi Anda dari akses, perubahan, pengungkapan, atau penghancuran yang tidak sah. Data Anda dienkripsi selama transmisi dan disimpan dengan aman.
            </Text>

            <Text style={styles.sectionTitle}>4. Retensi Data</Text>
            <Text style={styles.sectionContent}>
              Kami menyimpan informasi pribadi Anda selama diperlukan untuk menyediakan layanan kami dan memenuhi tujuan yang diuraikan dalam kebijakan privasi ini, kecuali periode retensi yang lebih lama diperlukan atau diizinkan oleh hukum.
            </Text>

            <Text style={styles.sectionTitle}>5. Hak Anda</Text>
            <Text style={styles.sectionContent}>
              Anda memiliki hak untuk:
            </Text>
            <Text style={styles.listItem}>• Mengakses dan memperbarui informasi pribadi Anda</Text>
            <Text style={styles.listItem}>• Menghapus akun dan data terkait</Text>
            <Text style={styles.listItem}>• Berhenti berlangganan komunikasi dari kami</Text>
            <Text style={styles.listItem}>• Meminta salinan data Anda</Text>

            <Text style={styles.sectionTitle}>6. Layanan Pihak Ketiga</Text>
            <Text style={styles.sectionContent}>
              NovaApp dapat menggunakan layanan pihak ketiga untuk membantu kami menyediakan layanan kami. Layanan ini mungkin memiliki akses ke informasi pribadi Anda hanya untuk melakukan tugas tertugas tertentu atas nama kami dan diwajibkan untuk tidak mengungkapkan atau menggunakannya untuk tujuan lain.
            </Text>

            <Text style={styles.sectionTitle}>7. Privasi Anak-Anak</Text>
            <Text style={styles.sectionContent}>
              NovaApp tidak dimaksudkan untuk anak di bawah usia 13 tahun. Kami tidak sengaja mengumpulkan informasi pribadi dari anak di bawah 13 tahun. Jika Anda adalah orang tua atau wali dan percaya anak Anda telah memberikan kami informasi pribadi, silakan hubungi kami.
            </Text>

            <Text style={styles.sectionTitle}>8. Perubahan Kebijakan Ini</Text>
            <Text style={styles.sectionContent}>
              Kami mungkin memperbarui kebijakan privasi kami dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan apa pun dengan memposting kebijakan privasi baru di halaman ini dan memperbarui tanggal "Terakhir Diperbarui" di bagian atas.
            </Text>

            <Text style={styles.sectionTitle}>9. Hubungi Kami</Text>
            <Text style={styles.sectionContent}>
              Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di:
            </Text>
            <Text style={styles.contactInfo}>Email: {APP_CONFIG.PRIVACY_EMAIL}</Text>
            <Text style={styles.contactInfo}>Alamat: {APP_CONFIG.OFFICE_ADDRESS}</Text>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Dengan menggunakan NovaApp, Anda mengakui bahwa telah membaca dan memahami kebijakan privasi ini.
              </Text>
            </View>

            <Text style={styles.lastUpdated}>Terakhir Diperbarui: 3 November 2025</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};


export default PrivacyPolicyScreen;