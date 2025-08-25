import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';

interface MetricsScreenProps {
  onGoBack: () => void;
}

const MetricsScreen: React.FC<MetricsScreenProps> = ({onGoBack}) => {
  // Sample data for the chart
  const data = [
    {name: 'Lun', intentos: 8, foco: 5},
    {name: 'Mar', intentos: 10, foco: 6},
    {name: 'Mié', intentos: 7, foco: 4},
    {name: 'Jue', intentos: 12, foco: 8},
    {name: 'Vie', intentos: 9, foco: 7},
    {name: 'Sáb', intentos: 5, foco: 3},
    {name: 'Dom', intentos: 6, foco: 4},
  ];

  const maxValue = Math.max(...data.map(d => Math.max(d.intentos, d.foco)));
  const chartHeight = 200;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Tu progreso</Text>
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>📈 Estadísticas de esta semana</Text>
        </View>
        
        {/* Simple Bar Chart */}
        <View style={styles.chart}>
          <View style={styles.chartBars}>
            {data.map((item, index) => (
              <View key={index} style={styles.barGroup}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      styles.intentosBar,
                      {height: (item.intentos / maxValue) * chartHeight},
                    ]}
                  />
                  <View
                    style={[
                      styles.bar,
                      styles.focoBar,
                      {height: (item.foco / maxValue) * chartHeight},
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, {backgroundColor: '#F2D98D'}]} />
            <Text style={styles.legendText}>Intentos de distracción</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, {backgroundColor: '#E9CC7A'}]} />
            <Text style={styles.legendText}>Veces que elegiste enfocarte</Text>
          </View>
        </View>
      </View>

      <View style={styles.todayContainer}>
        <View style={styles.todayHeader}>
          <Text style={styles.todayTitle}>Hoy</Text>
          <Text style={styles.todayDate}>Jueves</Text>
        </View>
        <View style={styles.todayStats}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Intentos</Text>
            <Text style={styles.statValue}>12</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Enfoque</Text>
            <Text style={styles.statValue}>8</Text>
          </View>
        </View>
        <Text style={styles.todayMessage}>
          Hoy redirigiste tu foco 8 veces. ¡Bien hecho!
        </Text>
      </View>

      <View style={styles.streakContainer}>
        <Text style={styles.streakTitle}>Tu racha actual</Text>
        <View style={styles.streakContent}>
          <Text style={styles.streakValue}>5 días</Text>
          <Text style={styles.streakMessage}>Mantén el buen trabajo</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#F2D98D',
    borderWidth: 1,
    borderColor: '#E9CC7A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 20,
    color: '#374151',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#374151',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chartHeader: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
  },
  chart: {
    height: 240,
    marginBottom: 20,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    paddingHorizontal: 10,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2,
    marginBottom: 8,
  },
  bar: {
    width: 12,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 4,
  },
  intentosBar: {
    backgroundColor: '#F2D98D',
  },
  focoBar: {
    backgroundColor: '#E9CC7A',
  },
  barLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'column',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#6b7280',
  },
  todayContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
  },
  todayDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  todayStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '500',
    color: '#1f2937',
  },
  todayMessage: {
    textAlign: 'center',
    color: '#374151',
    fontWeight: '500',
    fontSize: 16,
  },
  streakContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    marginHorizontal: 24,
    marginBottom: 40,
    padding: 20,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 16,
  },
  streakContent: {
    alignItems: 'center',
  },
  streakValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  streakMessage: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default MetricsScreen;