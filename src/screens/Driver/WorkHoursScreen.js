import React, { useState, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { HistoryContext } from '../../context/HistoryContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function WorkHoursScreen() {
  const { addHistoryRecord } = useContext(HistoryContext);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [currentPicker, setCurrentPicker] = useState('start');
  const [isLunchSubtracted, setIsLunchSubtracted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const notificationOpacity = useRef(new Animated.Value(0)).current;

  const customers = ['ГВЗХ', 'ГБ', 'Дорожники'];
  const db = getFirestore();

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const showTimePicker = (type) => {
    setCurrentPicker(type);
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    const adjustedTime = new Date(time);
    const minutes = adjustedTime.getMinutes();
    if (minutes < 15) {
      adjustedTime.setMinutes(0);
    } else if (minutes < 45) {
      adjustedTime.setMinutes(30);
    } else {
      adjustedTime.setMinutes(0);
      adjustedTime.setHours(adjustedTime.getHours() + 1);
    }
    adjustedTime.setSeconds(0);
    adjustedTime.setMilliseconds(0);

    if (currentPicker === 'start') {
      setStartTime(adjustedTime);
    } else if (currentPicker === 'end') {
      setEndTime(adjustedTime);
    }
    hideTimePicker();
  };

  const calculateWorkHours = () => {
    if (startTime && endTime) {
      const startHours = startTime.getHours() + startTime.getMinutes() / 60;
      const endHours = endTime.getHours() + endTime.getMinutes() / 60;

      let totalHours;
      if (endHours < startHours) {
        totalHours = 24 - startHours + endHours;
      } else {
        totalHours = endHours - startHours;
      }

      if (isLunchSubtracted) {
        totalHours -= 1;
      }

      return Math.max(totalHours, 0).toFixed(1);
    }
    return 0;
  };

  const toggleLunch = () => {
    setIsLunchSubtracted(!isLunchSubtracted);
  };

  const handleAdd = async () => {
    if (!selectedCustomer || !selectedDate || !startTime || !endTime) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля перед добавлением.');
      return;
    }

    const workHours = calculateWorkHours();

    try {
      await addDoc(collection(db, 'workHours'), {
        date: selectedDate.toLocaleDateString(),
        customer: selectedCustomer,
        hours: workHours,
        timestamp: new Date().toISOString(),
      });

      // Показ уведомления
      setShowNotification(true);
      Animated.timing(notificationOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(notificationOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setShowNotification(false);
          });
        }, 1500);
      });

      // Сброс формы
      setSelectedCustomer(null);
      setSelectedDate(null);
      setStartTime(null);
      setEndTime(null);
      setIsLunchSubtracted(false);
    } catch (error) {
      alert('Ошибка при сохранении данных: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Рабочие часы</Text>

      <Text style={styles.subtitle}>Выберите заказчика:</Text>
      <View style={styles.buttonContainer}>
        {customers.map((customer) => (
          <TouchableOpacity
            key={customer}
            style={[
              styles.button,
              selectedCustomer === customer && styles.selectedButton,
            ]}
            onPress={() => handleCustomerSelect(customer)}
          >
            <Text
              style={[
                styles.buttonText,
                selectedCustomer === customer && styles.selectedButtonText,
              ]}
            >
              {customer}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subtitle}>Выберите дату:</Text>
      <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
        <Text style={styles.dateButtonText}>
          {selectedDate ? selectedDate.toLocaleDateString() : 'Выбрать дату'}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />

      <Text style={styles.subtitle}>Выберите время:</Text>
      <View style={styles.timeButtonContainer}>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => showTimePicker('start')}
        >
          <Text style={styles.timeButtonText}>
            {startTime
              ? `Начало: ${startTime.getHours()}:${startTime
                  .getMinutes()
                  .toString()
                  .padStart(2, '0')}`
              : 'Время начала'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => showTimePicker('end')}
        >
          <Text style={styles.timeButtonText}>
            {endTime
              ? `Конец: ${endTime.getHours()}:${endTime
                  .getMinutes()
                  .toString()
                  .padStart(2, '0')}`
              : 'Время окончания'}
          </Text>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        minuteInterval={30}
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />

      <TouchableOpacity
        style={[
          styles.lunchButton,
          isLunchSubtracted && styles.selectedLunch,
        ]}
        onPress={toggleLunch}
      >
        <Text style={styles.lunchButtonText}>
          {isLunchSubtracted ? 'Убрать обед (+1 час)' : 'Добавить обед (-1 час)'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.workHours}>
        Итоговое количество часов: {calculateWorkHours()}
      </Text>

      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Добавить</Text>
      </TouchableOpacity>

      {showNotification && (
        <Animated.View style={[styles.notification, { opacity: notificationOpacity }]}>
          <Text style={styles.notificationText}>Добавлено успешно!</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#f9f9f9',
    justifyContent: 'space-between',
  },
  notification: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -30 }],
    width: 300,
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  notificationText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 1,
    textAlign: 'center',
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedButton: {
    backgroundColor: '#007BFF',
    borderColor: '#0056b3',
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
  },
  selectedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dateButton: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateButtonText: {
    color: '#333',
    fontSize: 16,
  },
  timeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeButton: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  timeButtonText: {
    color: '#333',
    fontSize: 16,
  },
  lunchButton: {
    backgroundColor: '#d9534f',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
    alignSelf: 'stretch',
  },
  selectedLunch: {
    backgroundColor: '#f8d7da',
  },
  lunchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  workHours: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'stretch',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});