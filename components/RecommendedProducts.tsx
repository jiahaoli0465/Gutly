import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

type IconName = keyof typeof Ionicons.glyphMap;

export interface Product {
  id: number;
  name: string;
  brand: string;
  rating: number;
  price: string;
  image: any;
  benefits: string[];
  aiMatch: string;
}

interface RecommendedProductsProps {
  products: Product[];
  onProductPress?: (product: Product) => void;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  products,
  onProductPress,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        Recommended Products
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.productsScroll}
      >
        {products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={[
              styles.productCard,
              { backgroundColor: theme.colors.background.paper },
              theme.shadows.sm,
            ]}
            onPress={() => onProductPress?.(product)}
            activeOpacity={0.9}
          >
            <View style={{ backgroundColor: theme.colors.background.paper }}>
              <Image
                source={
                  typeof product.image === 'string'
                    ? { uri: product.image }
                    : product.image
                }
                style={styles.productImage}
                resizeMode="contain"
              />
            </View>
            <View
              style={[
                styles.productInfo,
                { backgroundColor: theme.colors.background.paper },
              ]}
            >
              <Text
                style={[
                  styles.productBrand,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {product.brand}
              </Text>
              <Text
                style={[
                  styles.productName,
                  { color: theme.colors.text.primary },
                ]}
              >
                {product.name}
              </Text>
              <View style={styles.productRating}>
                <Ionicons
                  name="star"
                  size={16}
                  color={theme.colors.warning.main}
                />
                <Text
                  style={[
                    styles.ratingText,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  {product.rating}
                </Text>
              </View>
              <Text
                style={[
                  styles.productPrice,
                  { color: theme.colors.primary.main },
                ]}
              >
                {product.price}
              </Text>
              <View style={styles.benefitsContainer}>
                {product.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={theme.colors.success.main}
                    />
                    <Text
                      style={[
                        styles.benefitText,
                        { color: theme.colors.text.secondary },
                      ]}
                    >
                      {benefit}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  productsScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  productCard: {
    width: 280,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  productImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    resizeMode: 'contain',
  },
  productInfo: {
    padding: 16,
    backgroundColor: '#fff',
  },
  productBrand: {
    fontSize: 14,
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  benefitsContainer: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 14,
    flex: 1,
  },
});

export default RecommendedProducts;
