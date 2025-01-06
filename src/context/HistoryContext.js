import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Загрузка данных из AsyncStorage
    const loadLocalHistory = async () => {
      const storedData = await AsyncStorage.getItem('workHours');
      if (storedData) {
        setHistory(JSON.parse(storedData));
      }
    };
    
    // Синхронизация с Firebase
    const syncWithFirebase = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'workHours'));
      const firebaseHistory = [];
      querySnapshot.forEach((doc) => {
        firebaseHistory.push(doc.data());
      });
      setHistory(firebaseHistory);
    };

    loadLocalHistory();
    syncWithFirebase();
  }, []);

  const addHistoryRecord = async (record) => {
    const updatedHistory = [...history, record];
    setHistory(updatedHistory);
    
    // Обновление данных в AsyncStorage
    await AsyncStorage.setItem('workHours', JSON.stringify(updatedHistory));

    // Синхронизация с Firebase
    const db = getFirestore();
    await addDoc(collection(db, 'workHours'), record);
  };

  return (
    <HistoryContext.Provider value={{ history, addHistoryRecord }}>
      {children}
    </HistoryContext.Provider>
  );
};