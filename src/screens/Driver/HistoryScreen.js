import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { HistoryContext } from '../../context/HistoryContext';

export default function HistoryScreen() {
  const { history } = useContext(HistoryContext); 

  const totalHours = (history || []).reduce((sum, record) => sum + parseFloat(record.hours), 0);
  const salary = totalHours * 500;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>История работы</Text>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Всего часов:</Text>
          <Text style={styles.summaryValue}>{totalHours.toFixed(1)}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Зарплата:</Text>
          <Text style={styles.summaryValue}>{salary.toFixed(0)} руб.</Text>
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Дата</Text>
        <Text style={styles.tableHeaderText}>Заказчик</Text>
        <Text style={styles.tableHeaderText}>Часы</Text>
      </View>

      <FlatList
        data={history} 
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.date}</Text>
            <Text style={styles.tableCell}>{item.customer}</Text>
            <Text style={styles.tableCell}>{item.hours} ч</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  summaryBox: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e5e7eb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2937',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
    color: '#4b5563',
  },
});