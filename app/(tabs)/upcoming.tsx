import { View, Text, StyleSheet } from 'react-native';

export default function UpcomingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming</Text>
      <Text style={styles.subtitle}>Your upcoming tasks will appear here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
  },
});