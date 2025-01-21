import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axiosInstance from '../utils/axiosInstance';

interface FoodItem {
  _id: string;
  name: string;
  price: number;
  description: string;
}

const FoodCatalogManagementScreen = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchFoodItems = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/foods');
      setFoodItems(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to fetch food items.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateFoodItem = async () => {
    if (!name || !price || !description) {
      Alert.alert('Validation', 'All fields are required.');
      return;
    }

    try {
      if (editMode && editingId) {
        await axiosInstance.put(`/foods/${editingId}`, { name, price, description });
        Alert.alert('Success', 'Food item updated successfully!');
      } else {
        const response = await axiosInstance.post('/foods', { name, price, description });
        Alert.alert('Success', 'Food item added successfully!');
        setFoodItems((prev) => [...prev, response.data]);
      }
      resetForm();
      fetchFoodItems();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to save food item.');
    }
  };

  const handleDeleteFoodItem = async (id: string) => {
    try {
      await axiosInstance.delete(`/foods/${id}`);
      Alert.alert('Success', 'Food item deleted successfully!');
      fetchFoodItems();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to delete food item.');
    }
  };

  const handleEditFoodItem = (foodItem: FoodItem) => {
    setName(foodItem.name);
    setPrice(foodItem.price.toString());
    setDescription(foodItem.description);
    setEditMode(true);
    setEditingId(foodItem._id);
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setDescription('');
    setEditMode(false);
    setEditingId(null);
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const renderFoodCard = ({ item }: { item: FoodItem }) => (
    <View style={styles.foodCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <TouchableOpacity onPress={() => handleEditFoodItem(item)}>
          <AntDesign name="edit" size={20} color="#6BBF59" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.rowContent}>
          <Text style={styles.cardLabel}>Price:</Text>
          <Text style={styles.cardText}>${item.price}</Text>
        </View>
        <View style={styles.rowContent}>
          <Text style={styles.cardLabel}>Description:</Text>
          <Text style={styles.cardText}>{item.description}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteFoodItem(item._id)}
      >
        <AntDesign name="delete" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Food Catalog Management</Text>
      <View style={styles.formSection}>
        <View style={styles.formCard}>
          <Text style={styles.formHeader}>
            {editMode ? 'Edit Food Item' : 'Add New Food Item'}
          </Text>
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <AntDesign name="isv" size={20} color="#6BBF59" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Food Name"
                placeholderTextColor="#B0B0B0"
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={styles.inputContainer}>
              <AntDesign name="tag" size={20} color="#6BBF59" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Price"
                placeholderTextColor="#B0B0B0"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <AntDesign name="filetext1" size={20} color="#6BBF59" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Description"
                placeholderTextColor="#B0B0B0"
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>
          <Pressable style={styles.addButton} onPress={handleAddOrUpdateFoodItem}>
            <Text style={styles.addButtonText}>
              {editMode ? 'Update Food Item' : 'Add Food Item'}
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.foodListSection}>
        <FlatList
          data={foodItems}
          keyExtractor={(item) => item._id}
          renderItem={renderFoodCard}
          refreshing={loading}
          onRefresh={fetchFoodItems}
        />
      </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E8E8E8',
    textAlign: 'center',
    paddingTop: 50,
    marginBottom: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: '#2A2A2A',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#6BBF59',
  },
  formHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E8E8E8',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#4F4F4F',
    color: '#E8E8E8',
  },
  addButton: {
    backgroundColor: '#6BBF59',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: '#1B1B1B',
    fontWeight: 'bold',
  },
  foodListSection: {
    flex: 1,
    marginTop: 10,
  },
  foodCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#6BBF59',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E8E8E8',
  },
  cardContent: {
    marginBottom: 10,
  },
  rowContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#C0C0C0',
  },
  cardLabel: {
    fontWeight: 'bold',
    color: '#A3D89F',
  },
  deleteButton: {
    backgroundColor: '#D9534F',
    padding: 10,
    borderRadius: 50,
    alignSelf: 'flex-end',
  },
});

export default FoodCatalogManagementScreen;
