import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import axiosInstance from '../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/profile');
        setUser(response.data);
      } catch (error: any) {
        console.error('Error fetching user data:', error.response || error.message);
        Alert.alert(
          'Error',
          error.response?.data?.error || 'Failed to fetch user data.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
        navigation.replace('Login');
        return;
      }

      await axiosInstance.post('/profile/logout');

      await AsyncStorage.removeItem('jwtToken');

      Alert.alert('Logout', 'You have successfully logged out.');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again later.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6BBF59" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Profile</Text>
        <Text style={styles.errorText}>Failed to load user data.</Text>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={require('../../assets/icon/profile.png')}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{user.name}</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoText}>{user.email}</Text>
        <Text style={styles.infoLabel}>Phone:</Text>
        <Text style={styles.infoText}>{user.phone || '+62 123 456 789'}</Text>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E8E8E8',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B1B1B',
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 50,
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#6BBF59',
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6BBF59',
  },
  profileInfo: {
    backgroundColor: '#2A2A2A',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 5,
    borderLeftColor: '#A3D89F',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A3D89F',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#E8E8E8',
    marginBottom: 10,
  },
  settingsSection: {
    backgroundColor: '#2A2A2A',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 5,
    borderLeftColor: '#6BBF59',
  },
  settingsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6BBF59',
    marginBottom: 15,
  },
  settingItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#4F4F4F',
  },
  settingText: {
    fontSize: 16,
    color: '#E8E8E8',
  },
  logoutButton: {
    backgroundColor: '#D9534F',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 18,
    color: '#1B1B1B',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#D9534F',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ProfileScreen;
