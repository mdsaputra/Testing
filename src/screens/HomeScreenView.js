import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JadwalIcon from '../assets/jadwal.svg';
import BookingIcon from '../assets/booking.svg';

export default function Home({ navigation }) {
  const [jadwal, setJadwal] = useState([]); // gabungan API + local
  const [localBookings, setLocalBookings] = useState([]); // booking lokal
  const [loading, setLoading] = useState(true);

  // Fetch jadwal dan booking lokal
  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const res = await fetch(
          'https://uat-api.ftlgym.com/api/v1/test/jadwalruangan',
        );
        const data = await res.json();
        const apiData = data.data || data;

        const localDataRaw = await AsyncStorage.getItem('bookings');
        const localData = localDataRaw ? JSON.parse(localDataRaw) : [];
        setLocalBookings(localData); // simpan booking lokal

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

    const unsubscribe = navigation.addListener('focus', fetchJadwal);
    return unsubscribe;
  }, [navigation]);

  // BackHandler hanya untuk Home screen
  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert('Logout', 'Apakah yakin ingin logout?', [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              await AsyncStorage.removeItem('token');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            },
          },
        ]);
        return true; // cegah back default
      }
      return false; // biarkan back normal
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  // Logout handler
  const handleLogout = () => {
    Alert.alert('Logout', 'Apakah yakin ingin logout?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  // Hapus semua booking lokal
  const handleDeleteAll = () => {
    Alert.alert(
      'Hapus Semua',
      'Apakah Anda yakin ingin menghapus semua booking lokal?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('bookings');
            setLocalBookings([]);
            // hapus dari jadwal gabungan
            setJadwal(prev =>
              prev.filter(
                j =>
                  !localBookings.some(
                    l =>
                      l.ruang === j.ruang &&
                      `${l.mulai} - ${l.selesai}` === j.waktu,
                  ),
              ),
            );
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // Filter jadwal yang valid (bukan "-")
  const filteredJadwal = jadwal.filter(j => j.waktu !== '-' && j.ruang !== '-');

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>Y</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Yosi</Text>
          <Text style={styles.role}>Web Developer</Text>
        </View>

        {/* Logout wording */}
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutTextWrapper}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* JUDUL */}
      <Text style={styles.title}>Jadwal Ruang Meeting Hari Ini</Text>

      {/* LIST JADWAL */}
      {filteredJadwal.length === 0 ? (
        <Text style={{ color: '#777', textAlign: 'center', marginTop: 20 }}>
          Belum ada jadwal meeting hari ini
        </Text>
      ) : (
        <FlatList
          data={filteredJadwal}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.time}>{item.waktu}</Text>
              <Text style={styles.room}>{item.ruang}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 160 }}
        />
      )}

      {/* HAPUS SEMUA */}
      {localBookings.length > 0 && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAll}>
          <Text style={styles.deleteText}>Hapus Semua</Text>
        </TouchableOpacity>
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
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#BEC3E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: { fontSize: 32, color: '#fff', fontWeight: '600' },
  name: { fontSize: 20, fontWeight: '600', color: '#000' },
  role: { fontSize: 10, color: '#555' },
  logoutTextWrapper: {
    position: 'absolute',
    right: 0,
    top: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  logoutText: { color: '#007C6D', fontWeight: '600', fontSize: 14 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  card: {
    backgroundColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: { fontSize: 16, color: '#888', fontWeight: '500' },
  room: { fontSize: 16, color: '#888', fontWeight: '600' },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navButtonActive: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navLabel: { fontSize: 13, color: '#555', fontWeight: '500' },
  navLabelActive: { fontSize: 13, color: '#007C6D', fontWeight: '600' },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 20,
  },
  deleteText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
