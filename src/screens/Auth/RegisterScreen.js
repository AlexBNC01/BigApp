import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext'; // Используем хук для авторизации

export default function RegisterScreen({ navigation }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (username && password) {
      // Логика регистрации
      login({ username, password });
      navigation.replace('Главная'); // Перенаправляем на главный экран после регистрации
    } else {
      alert('Введите все данные!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Зарегистрироваться</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Войти')}>
        <Text style={styles.linkText}>Уже есть аккаунт? Войти</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10 },
  button: { backgroundColor: '#28a745', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center' },
  linkText: { color: '#007BFF', textAlign: 'center', marginTop: 10 },
});