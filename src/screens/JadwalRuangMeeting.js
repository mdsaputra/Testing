import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CalendarIcon from '../assets/calendar.svg';

const JadwalRuangMeeting = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [ruang, setRuang] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [showDate, setShowDate] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await AsyncStorage.getItem('bookings');
      if (data) setBookings(JSON.parse(data));
    };
    loadData();
  }, []);

  useEffect(() => {
    if (ruang || tanggal) {
      const f = bookings.filter(
        item =>
          (!ruang || item.ruang === ruang) &&
          (!tanggal || item.tanggal === tanggal),
      );
      setFiltered(f);
    } else {
      setFiltered(bookings);
    }
  }, [ruang, tanggal, bookings]);

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowDate(false);
      return;
    }
    const date = selectedDate.toISOString().split('T')[0];
    setTanggal(date);
    setShowDate(false);
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        backgroundColor: '#d9d9d9',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginBottom: 10,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '600' }}>
        {item.mulai} - {item.selesai}
      </Text>
      <Text style={{ color: '#fff', fontWeight: '600' }}>{item.ruang}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F3F3', padding: 20 }}>
      {/* Header otomatis sudah diatur dari Stack.Navigator */}

      {/* Filter */}
      <ScrollView>
        {/* Dropdown Ruang */}
        <View
          style={{
            backgroundColor: '#f9f7f7',
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            marginBottom: 15,
            paddingHorizontal: 8,
          }}
        >
          <Picker
            selectedValue={ruang}
            onValueChange={value => setRuang(value)}
            style={{ color: ruang ? '#000' : '#999' }}
            dropdownIconColor="#000"
          >
            <Picker.Item label="Ruang Meeting" value="" color="#999" />
            <Picker.Item label="Bali" value="bali" />
            <Picker.Item label="Jambi" value="jambi" />
            <Picker.Item label="Palembang" value="palembang" />
          </Picker>
        </View>

        {/* Tanggal Meeting */}
        <TouchableOpacity
          onPress={() => setShowDate(true)}
          style={{
            backgroundColor: '#f9f7f7',
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            paddingVertical: 14,
            paddingHorizontal: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: tanggal ? '#000' : '#999' }}>
            {tanggal || 'Tanggal Meeting'}
          </Text>
          <CalendarIcon width={22} height={22} fill="#000" />
        </TouchableOpacity>

        {showDate && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* List Booking */}
        <View style={{ marginTop: 20 }}>
          <FlatList
            data={filtered}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text
                style={{ color: '#999', textAlign: 'center', marginTop: 20 }}
              >
                Belum ada jadwal meeting
              </Text>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default JadwalRuangMeeting;
