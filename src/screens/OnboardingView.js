import React, { Component } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

export default class Onboarding extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.large}>Selamat Datang</Text>
          <Text style={styles.medium}>Di Aplikasi</Text>
          <Text style={styles.large}>Ruang Meeting</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => this.props.navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 36,
    marginTop: 120,
  },
  large: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  medium: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000',
    marginBottom: 24,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#e3e3e3',
    width: 240,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '70%',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});
