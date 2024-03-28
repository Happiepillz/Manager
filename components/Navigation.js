import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';

import SplashScreen from './SplashScreen';
import HomeScreen from './HomeScreen';
import AddTask from './AddTask';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const Navigator = () => {
  const [isSplashScreen, setIsSplashScreen] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsSplashScreen(false);
    }, 3000); // Adjust the duration as needed
  }, []);

  return (
    <NavigationContainer>
      {isSplashScreen ? (
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        // Bottom Navigation Bar
        <Tab.Navigator
        screenOptions={({ route }) => ({

          tabBarStyle: { backgroundColor: '#d0efef' },
          tabBarIcon: ({ color }) => {
            let iconName;
            switch (route.name) {
              case 'Home':
                iconName = 'home';
              break;
              case 'Add Task':
                iconName = 'plus';
              break;

              default:
                break;

            }

            return <MCI name={iconName} color={color} size={24} />;
          },
          tabBarInactiveTintColor: '#b8a5b4',
          tabBarActiveTintColor: '#61435b',
        })}
        >
          <Tab.Screen name="Home" component={HomeScreen} options={{headerTitle:"" ,headerStyle: {backgroundColor:'#d0efef'}}}/>  
          <Tab.Screen name="Add Task" component={AddTask} options={{headerTitle: '' ,headerStyle: {backgroundColor:'#d0efef'}}} />        
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigator;
