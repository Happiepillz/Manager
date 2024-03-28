import { Text, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

// You can import supported modules from npm
import { Card } from 'react-native-paper';

// or any files within the Snack
import Navigator from './components/Navigation'; // Correct import path



export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      
      <Navigator/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#dfc499',
    padding: 8,
  },

});