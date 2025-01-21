import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Text, StyleSheet, View } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import FoodCatalogManagementScreen from '../screens/FoodCatalogManagementScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const CustomTabBarLabel = ({ label, color }: { label: string; color: string }) => (
  <Text style={[styles.tabLabel, { color }]}>{label}</Text>
);

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1B1B1B',
          height: 90,
          borderTopColor: '#A3D89F',
          borderTopWidth: 2,
          paddingVertical: 10,
          paddingTop: 6,
          elevation: 5,
        },
        tabBarActiveTintColor: '#A3D89F',
        tabBarInactiveTintColor: '#E8E8E8',
        tabBarLabel: ({ color }) => {
          const label =
            route.name === 'Home'
              ? 'Home'
              : route.name === 'Food'
              ? 'Food'
              : route.name === 'Profile'
              ? 'Profile'
              : 'Data';
          return <CustomTabBarLabel label={label} color={color} />;
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: string;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Food':
              iconName = 'isv';
              break;
            case 'Profile':
              iconName = 'user';
              break;
            default:
              iconName = 'question';
              break;
          }
          return <AntDesign name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Food" component={FoodCatalogManagementScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#F8F8F2',
  },
});

export default BottomNavigator;
