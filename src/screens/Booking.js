import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputField from '../components/InputField';
import CalendarIcon from '../assets/calendar.svg';
import ClockIcon from '../assets/clock.svg';

const BookingView = ({ navigation }) => {
  const [form, setForm] = useState({
    divisi: '',
    ruang: '',
    tanggal: '',
    mulai: '',
    selesai: '',
    peserta: '',
  });

  const onChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = async () => {
    try {
      const existing = await AsyncStorage.getItem('bookings');
      const data = existing ? JSON.parse(existing) : [];

      data.push(form);
      await AsyncStorage.setItem('bookings', JSON.stringify(data));

      Alert.alert('Sukses', 'Booking berhasil disimpan!');
      navigation.navigate('JadwalRuangMeeting');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Gagal menyimpan data');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <InputField
        placeholder="Divisi"
        value={form.divisi}
        onChangeText={v => onChange('divisi', v)}
      />
      <InputField
        placeholder="Ruang Meeting"
        value={form.ruang}
        onChangeText={v => onChange('ruang', v)}
      />
      <InputField
        placeholder="Tanggal Meeting"
        value={form.tanggal}
        onChangeText={v => onChange('tanggal', v)}
        icon={<CalendarIcon width={20} height={20} />}
      />
      <InputField
        placeholder="Waktu Mulai Meeting"
        value={form.mulai}
        onChangeText={v => onChange('mulai', v)}
        icon={<ClockIcon width={20} height={20} />}
      />
      <InputField
        placeholder="Waktu Selesai Meeting"
        value={form.selesai}
        onChangeText={v => onChange('selesai', v)}
        icon={<ClockIcon width={20} height={20} />}
      />
      <InputField
        placeholder="Jumlah Peserta"
        value={form.peserta}
        onChangeText={v => onChange('peserta', v)}
      />

      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          backgroundColor: '#E9E9E9',
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: 'center',
          marginTop: 20,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BookingView;
