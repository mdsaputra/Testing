import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';

// import icon SVG
import JadwalIcon from '../assets/jadwal.svg';
import BookingIcon from '../assets/booking.svg';

export default function Home({ navigation }) {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const res = await fetch(
          'https://uat-api.ftlgym.com/api/v1/test/jadwalruangan',
        );
        const data = await res.json();
        console.log('DATA JADWAL:', data);
        setJadwal(data.data || data);
      } catch (error) {
        console.warn('Fetch jadwal error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJadwal();
  }, []);

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
      <FlatList
        data={jadwal}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.time}>
              {item.waktu ||
                `${item.jamMulai || ''} - ${item.jamSelesai || ''}`}
            </Text>
            <Text style={styles.room}>{item.ruangan || item.namaRuangan}</Text>
          </View>
        )}
      />

      {/* BOTTOM NAV */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navButton}>
          <JadwalIcon width={24} height={24} fill="#007C6D" />
          <Text style={[styles.navLabel, { color: '#007C6D' }]}>
            Jadwal{'\n'}Ruang Meeting
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Booking')}
        >
          <BookingIcon width={24} height={24} fill="#555" />
          <Text style={styles.navLabel}>Booking{'\n'}Ruang Meeting</Text>
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
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: { alignItems: 'center' },
  navLabel: { textAlign: 'center', fontSize: 12, color: '#555', marginTop: 4 },
});
