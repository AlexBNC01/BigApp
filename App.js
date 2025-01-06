// app.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthProvider, useAuth } from './src/context/AuthContext'; // Correct import of AuthContext
import { HistoryProvider } from './src/context/HistoryContext'; // Correct import of HistoryContext
import WorkHoursScreen from './src/screens/Driver/WorkHoursScreen';
import HistoryScreen from './src/screens/Driver/HistoryScreen';
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';

import { initializeApp, getApps } from 'firebase/app';
import firebaseConfig from './src/firebase-config'; // Путь к вашему конфигу

// Инициализация Firebase (только если приложение еще не инициализировано)
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
} else {
  // Приложение уже инициализировано
  console.log("Firebase App already initialized");
}

// Initialize tab and stack navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Auth Stack for login and registration
const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Вход" component={LoginScreen} />
    <Stack.Screen name="Регистрация" component={RegisterScreen} />
  </Stack.Navigator>
);

// Main Tab navigator for the app
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'WorkHours') {
          iconName = 'clock-o';
        } else if (route.name === 'История') {
          iconName = 'book';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007BFF',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen
      name="WorkHours"
      component={WorkHoursScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="История"
      component={HistoryScreen}
      options={{ title: 'История работы' }}
    />
  </Tab.Navigator>
);

// AppNavigator uses the authentication context
const AppNavigator = () => {
  const { isAuthenticated } = useAuth(); // Correctly using the context

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider> {/* Wrap everything in AuthProvider */}
      <HistoryProvider> {/* Wrap everything in HistoryProvider */}
        <AppNavigator />
      </HistoryProvider>
    </AuthProvider>
  );
}