import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ContinueLayout() {
  const router = useRouter();

  const handleContinue = () => {
    // Navigate to the main app screen
    router.push('/main');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ready to get started?</Text>
        <Text style={styles.subtitle}>Swipe or tap to continue to your tasks</Text>
      </View>
      
      <View style={styles.sliderContainer}>
        <TouchableOpacity 
          style={styles.slider}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <View style={styles.sliderTrack}>
            <View style={styles.sliderButton}>
              <ChevronRight size={24} color="#ffffff" />
            </View>
            <Text style={styles.sliderText}>Continue to App</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  content: {
    alignItems: 'center',
    marginBottom: 80,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  sliderContainer: {
    width: width - 80,
    position: 'absolute',
    bottom: 60,
  },
  slider: {
    width: '100%',
  },
  sliderTrack: {
    height: 60,
    backgroundColor: '#f3f4f6',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    position: 'relative',
  },
  sliderButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginRight: 52,
  },
});