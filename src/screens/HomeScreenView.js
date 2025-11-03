import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JadwalIcon from '../assets/jadwal.svg';
import BookingIcon from '../assets/booking.svg';

export default function Home({ navigation }) {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        // 🔹 Ambil dari API
        const res = await fetch(
          'https://uat-api.ftlgym.com/api/v1/test/jadwalruangan',
        );
        const data = await res.json();
        const apiData = data.data || data;

        // 🔹 Ambil dari AsyncStorage
        const localDataRaw = await AsyncStorage.getItem('bookings');
        const localData = localDataRaw ? JSON.parse(localDataRaw) : [];

        // 🔹 Gabungkan (API + lokal)
        const merged = [
          ...apiData.map(item => ({
            waktu:
              item.waktu ||
              `${item.jamMulai || '-'} - ${item.jamSelesai || '-'}`,
            ruang: item.ruangan || item.namaRuangan || '-',
          })),
          ...localData.map(item => ({
            waktu: `${item.mulai} - ${item.selesai}`,
            ruang: item.ruang,
          })),
        ];

        setJadwal(merged);
      } catch (error) {
        console.warn('Fetch jadwal error:', error);
      } finally {
        setLoading(false);
      }
    };

    // Panggil saat pertama dan setiap screen difokuskan
    const unsubscribe = navigation.addListener('focus', fetchJadwal);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>Y</Text>
        </View>
        <View>
          <Text style={styles.name}>Yosi</Text>
          <Text style={styles.role}>Web Developer</Text>
        </View>
      </View>

      {/* JUDUL */}
      <Text style={styles.title}>Jadwal Ruang Meeting Hari Ini</Text>

      {/* LIST JADWAL */}
      {jadwal.length === 0 ? (
        <Text style={{ color: '#777', textAlign: 'center', marginTop: 20 }}>
          Belum ada jadwal meeting hari ini
        </Text>
      ) : (
        <FlatList
          data={jadwal}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.time}>{item.waktu}</Text>
              <Text style={styles.room}>{item.ruang}</Text>
            </View>
          )}
        />
      )}

      {/* BOTTOM NAV */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navButtonActive}>
          <JadwalIcon width={34} height={38} fill="#007C6D" />
          <View style={{ flexDirection: 'column', marginLeft: 8 }}>
            <Text style={styles.navLabelActive}>Jadwal</Text>
            <Text style={styles.navLabelActive}>Ruang Meeting</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Booking')}
        >
          <BookingIcon width={34} height={38} fill="#555" />
          <View style={{ flexDirection: 'column', marginLeft: 8 }}>
            <Text style={styles.navLabel}>Booking</Text>
            <Text style={styles.navLabel}>Ruang Meeting</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: { fontSize: 32, color: '#fff', fontWeight: '600' },
  name: { fontSize: 20, fontWeight: '600', color: '#000' },
  role: { fontSize: 14, color: '#555' },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  card: {
    backgroundColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: { fontSize: 16, color: '#888', fontWeight: '500' },
  room: { fontSize: 16, color: '#333', fontWeight: '600' },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#D9D9D982',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navButtonActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navLabel: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  navLabelActive: {
    fontSize: 13,
    color: '#007C6D',
    fontWeight: '600',
  },
});
