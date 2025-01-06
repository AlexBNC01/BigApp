// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext'; // Импортируем контекст для авторизации

export default function LoginScreen({ navigation }) {
  const { login } = useAuth(); // Используем хук для логина
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username && password) {
      login({ username, password });  // Логиним пользователя через контекст
      if (username === '1' && password === '1') {
        navigation.replace('Главная');  // Перенаправляем на главный экран после логина
      } else {
        alert('Неверный логин или пароль');
      }
    } else {
      alert('Введите правильные данные!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Войти</Text>
      <TextInput
        style={styles.input}
        placeholder="Логин"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Войти</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Регистрация')}>
        <Text style={styles.linkText}>Еще нет аккаунта? Зарегистрироваться</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10 },
  button: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center' },
  linkText: { color: '#007BFF', textAlign: 'center', marginTop: 10 },
});