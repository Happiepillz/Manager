import React from 'react';
import {View, Text,StyleSheet, Image} from 'react-native';


const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manager </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F6FCFC',
  },
  title:{
    color:'#6ed2d5',
    fontWeight:'bold',
    fontSize:40,
  },

});

export default SplashScreen;