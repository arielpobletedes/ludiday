import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { defaultPortfolios, defaultTasks } from '@ludiday/core';

export default function MobileApp() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>LudiDay Mobile</Text>
        <Text style={styles.subtitle}>Clean Architecture + React Native</Text>
      </View>
      <ScrollView style={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Portafolios Activos ({defaultPortfolios.length})</Text>
          {defaultPortfolios.map((p) => (
            <View key={p.id} style={styles.item}>
              <Text style={styles.itemText}>{p.name}</Text>
              <Text style={styles.itemCategory}>{p.category}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tareas Principales ({defaultTasks.length})</Text>
          {defaultTasks.slice(0, 5).map((t) => (
            <View key={t.id} style={styles.item}>
              <Text style={styles.itemText}>{t.title}</Text>
              <Text style={styles.itemCategory}>{t.status.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  scroll: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  itemText: {
    color: '#e2e8f0',
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  itemCategory: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
