import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import axiosInstance from '../utils/axiosInstance';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
}

const HomeScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/foods');
        setProducts(response.data);
      } catch (error: any) {
        Alert.alert('Error', error.response?.data?.error || 'Failed to fetch products.');
      }
    };

    fetchProducts();
  }, []);

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.tableCell, styles.headerCell]}>Name</Text>
      <Text style={[styles.tableCell, styles.headerCell]}>Price</Text>
      <Text style={[styles.tableCell, styles.headerCell]}>Description</Text>
    </View>
  );

  const renderTableRow = (product: Product) => (
    <View key={product._id} style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.rowCell]}>{product.name}</Text>
      <Text style={[styles.tableCell, styles.rowCell]}>${product.price.toFixed(2)}</Text>
      <Text style={[styles.tableCell, styles.rowCell]}>{product.description}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Product Catalog</Text>
        <Text style={styles.subHeader}>View all your products in a modern table</Text>
      </View>
      <View style={styles.tableContainer}>
        {renderTableHeader()}
        {products.length > 0 ? (
          products.map(renderTableRow)
        ) : (
          <Text style={styles.noDataText}>No products available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1B1B1B',
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#E8E8E8',
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 14,
    color: '#A3D89F',
  },
  tableContainer: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#2A2A2A',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#6BBF59',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#4F4F4F',
    paddingBottom: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#4F4F4F',
    paddingVertical: 10,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#A3D89F',
  },
  rowCell: {
    color: '#E8E8E8',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#D9534F',
    marginTop: 20,
  },
});

export default HomeScreen;
