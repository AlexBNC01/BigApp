// src/context/HistoryContext.js
import React, { createContext, useState, useContext } from 'react';

// Контекст для истории
export const HistoryContext = createContext();

// Поставщик контекста для истории
export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]); // Состояние истории

  // Функция добавления записи в историю
  const addHistoryRecord = (record) => {
    setHistory((prevHistory) => [...prevHistory, record]);
  };

  return (
    <HistoryContext.Provider value={{ history, addHistoryRecord }}>
      {children}
    </HistoryContext.Provider>
  );
};

// Хук для использования контекста
export const useHistory = () => useContext(HistoryContext);