import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import InputField from '../components/InputField';
import CalendarIcon from '../assets/calendar.svg';
import ClockIcon from '../assets/clock.svg';
import { Picker } from '@react-native-picker/picker';

const BookingView = ({ navigation }) => {
  const [form, setForm] = useState({
    divisi: '',
    ruang: '',
    tanggal: '',
    mulai: '',
    selesai: '',
    peserta: '',
  });

  const [pickerMode, setPickerMode] = useState(null); // 'date' | 'mulai' | 'selesai'
  const [tempDate, setTempDate] = useState(new Date());

  const onChange = (key, value) => setForm({ ...form, [key]: value });

  // Handler date/time change
  const handlePickerChange = (event, selected) => {
    if (event.type === 'dismissed') {
      setPickerMode(null);
      return;
    }
    const selectedDate = selected || tempDate;

    if (pickerMode === 'date') {
      const formatted = selectedDate.toISOString().split('T')[0];
      onChange('tanggal', formatted);
    } else if (pickerMode === 'mulai' || pickerMode === 'selesai') {
      const h = selectedDate.getHours().toString().padStart(2, '0');
      const m = selectedDate.getMinutes().toString().padStart(2, '0');
      onChange(pickerMode, `${h}:${m}`);
    }

    setPickerMode(null);
  };

  const handleSubmit = async () => {
    // Validasi field kosong
    const { divisi, ruang, tanggal, mulai, selesai, peserta } = form;
    if (!divisi || !ruang || !tanggal || !mulai || !selesai || !peserta) {
      Alert.alert('Validasi Gagal', 'Semua field harus diisi sebelum submit.');
      return;
    }

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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* Dropdown Divisi */}
        <View
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            marginBottom: 15,
            paddingVertical: 8,
            paddingHorizontal: 8,
            backgroundColor: '#f9f7f7',
          }}
        >
          <Picker
            selectedValue={form.divisi}
            onValueChange={value => onChange('divisi', value)}
            style={{ color: form.divisi ? '#000' : '#999' }}
            dropdownIconColor="#000"
          >
            <Picker.Item label="Pilih Divisi" value="" color="#999" />
            <Picker.Item label="Tester" value="tester" />
            <Picker.Item label="Dev" value="dev" />
            <Picker.Item label="PM" value="pm" />
          </Picker>
        </View>

        {/* Dropdown Ruang */}
        <View
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            marginBottom: 15,
            paddingVertical: 8,
            paddingHorizontal: 8,
            backgroundColor: '#f9f7f7',
          }}
        >
          <Picker
            selectedValue={form.ruang}
            onValueChange={value => onChange('ruang', value)}
            style={{ color: form.ruang ? '#000' : '#999' }}
            dropdownIconColor="#000"
          >
            <Picker.Item label="Pilih Ruang" value="" color="#999" />
            <Picker.Item label="Bali" value="bali" />
            <Picker.Item label="Jambi" value="jambi" />
            <Picker.Item label="Palembang" value="palembang" />
          </Picker>
        </View>

        {/* Tanggal Meeting */}
        <TouchableOpacity onPress={() => setPickerMode('date')}>
          <InputField
            placeholder="Tanggal Meeting"
            value={form.tanggal}
            editable={false}
            icon={<CalendarIcon width={20} height={20} />}
          />
        </TouchableOpacity>

        {/* Waktu Mulai */}
        <TouchableOpacity onPress={() => setPickerMode('mulai')}>
          <InputField
            placeholder="Waktu Mulai Meeting"
            value={form.mulai}
            editable={false}
            icon={<ClockIcon width={20} height={20} />}
          />
        </TouchableOpacity>

        {/* Waktu Selesai */}
        <TouchableOpacity onPress={() => setPickerMode('selesai')}>
          <InputField
            placeholder="Waktu Selesai Meeting"
            value={form.selesai}
            editable={false}
            icon={<ClockIcon width={20} height={20} />}
          />
        </TouchableOpacity>

        {/* Jumlah Peserta */}
        <InputField
          placeholder="Jumlah Peserta"
          value={form.peserta}
          onChangeText={v => onChange('peserta', v)}
        />
      </ScrollView>

      {/* Picker Global — Tidak Kondisional */}
      {pickerMode && (
        <DateTimePicker
          value={new Date()}
          mode={pickerMode === 'date' ? 'date' : 'time'}
          display="default"
          onChange={handlePickerChange}
        />
      )}

      {/* Tombol Submit */}
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
        }}
      >
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: '#E9E9E9',
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: '400' }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingView;
