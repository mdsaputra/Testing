import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import EyeIcon from '../assets/eye.svg';
import EyeOffIcon from '../assets/eye-off.svg';

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    loading: false,
    hidePassword: true,
  };

  onLogin = async () => {
    const { email, password } = this.state;
    if (!email || !password) {
      Alert.alert('Error', 'Email dan password harus diisi');
      return;
    }

    this.setState({ loading: true });
    try {
      const res = await fetch('https://uat-api.ftlgym.com/api/v1/test/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        Alert.alert('Login gagal', data.message || 'Periksa kredensial');
        this.setState({ loading: false });
        return;
      }

      this.setState({ loading: false });
      Alert.alert('Sukses', 'Login berhasil!');
      this.props.navigation.navigate('Home');
    } catch (error) {
      console.warn('LOGIN ERROR', error);
      this.setState({ loading: false });
      Alert.alert('Kesalahan', 'Tidak dapat menghubungi server.');
    }
  };

  render() {
    const { email, password, loading, hidePassword } = this.state;

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.avoider}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Text style={styles.titleTop}>Ruangan Meeting</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>

            {/* Email Field */}
            <TextInput
              value={email}
              onChangeText={email => this.setState({ email })}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Email..."
              placeholderTextColor="#bbb"
            />

            {/* Password Field dengan Toggle Eye */}
            <View style={styles.passwordContainer}>
              <TextInput
                value={password}
                onChangeText={password => this.setState({ password })}
                style={styles.passwordInput}
                secureTextEntry={hidePassword}
                placeholder="Password..."
                placeholderTextColor="#bbb"
              />
              <TouchableOpacity
                onPress={() => this.setState({ hidePassword: !hidePassword })}
                style={styles.iconContainer}
              >
                {hidePassword ? (
                  <EyeOffIcon width={22} height={22} />
                ) : (
                  <EyeIcon width={22} height={22} />
                )}
              </TouchableOpacity>
            </View>

            {/* Button Sign In */}
            <TouchableOpacity
              style={[styles.signButton, loading && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={this.onLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.signButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  avoider: { flex: 1, alignItems: 'center' },
  titleTop: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginTop: '20%',
    alignSelf: 'center',
  },
  card: {
    width: '92%',
    backgroundColor: '#efefef',
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 22,
    marginTop: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: { fontSize: 24, fontWeight: '400', marginBottom: 40 },

  input: {
    width: '86%',
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 14,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '86%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
    marginBottom: 14,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    color: '#000',
  },
  iconContainer: {
    marginLeft: 8,
  },

  signButton: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  signButtonText: { fontSize: 16, fontWeight: '400', color: '#000' },
});
