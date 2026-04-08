import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'

const sectionConfig = {
  'quick-commerce': {
    title: 'Quick Commerce',
    yuktiGreeting: "Hi! I'm Yukti ✦ Tell me what groceries you need and I'll find the cheapest prices across all stores instantly.",
    suggestions: [
      { text: 'Cheapest milk? 🥛', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100&q=80', query: 'milk' },
      { text: 'Best snack value 🍪', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=100&q=80', query: 'snacks' },
      { text: 'Compare butter 🧈', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=100&q=80', query: 'butter' },
      { text: 'Juice deals 🍊', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=100&q=80', query: 'juice' },
      { text: 'Fresh fruits 🍎', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&q=80', query: 'fruits' },
    ],
    prompts: [
      { icon: '💬', text: "What's the cheapest milk right now?" },
      { icon: '🔍', text: 'Compare Amul butter across stores' },
      { icon: '💰', text: 'Where do I save the most today?' },
    ],
    keywords: {
      milk: { categoryId: 'dairy', productName: 'taaza', response: "🥛 Found it! Navigating to Dairy → finding Amul Taaza Milk → comparing prices across all 3 stores for you..." },
      butter: { categoryId: 'dairy', productName: 'butter', response: "🧈 Going to Dairy → finding Amul Butter → DummyJSON has best unit price at ₹46/100g. Pulling up comparison!" },
      snacks: { categoryId: 'snacks', productName: null, response: "🍪 Opening Snacks & Bakery — 10 products ready! Parle-G is best value at ₹6.25/100g." },
      chips: { categoryId: 'snacks', productName: null, response: "🍟 Going to Snacks — Lay's cheapest at ₹20/100g on Open Food Facts!" },
      juice: { categoryId: 'beverages', productName: 'tropicana', response: "🍊 Heading to Beverages → finding Tropicana → showing where it's cheapest..." },
      water: { categoryId: 'beverages', productName: 'bisleri', response: "💧 Finding Bisleri Water — cheapest at ₹2/100ml on Open Food Facts!" },
      fruits: { categoryId: 'fruits', productName: null, response: "🍎 Opening Fruits & Vegetables — Fresh Bananas cheapest at ₹7/100g!" },
      dairy: { categoryId: 'dairy', productName: null, response: "🥛 Taking you to Dairy — 10 products ready to compare!" },
      curd: { categoryId: 'dairy', productName: 'curd', response: "🥛 Going to Dairy → finding Mother Dairy Curd → comparing prices..." },
      beverages: { categoryId: 'beverages', productName: null, response: "☕ Opening Beverages — 8 products. Bisleri Water cheapest at ₹2/100ml!" },
      masala: { categoryId: 'masala', productName: null, response: "🌶️ Taking you to Masala & Spices — great savings here!" },
      household: { categoryId: 'household', productName: null, response: "🧹 Opening Household — Vim and Ariel compared across all stores!" },
      paneer: { categoryId: 'dairy', productName: 'paneer', response: "🧀 Finding Fresh Paneer → best price at ₹44.5/100g on Open Food Facts!" },
      save: { categoryId: 'dairy', productName: null, response: "💰 Top savings today: Amul Milk saves ₹8 on Open Food Facts, Parle-G saves ₹5, Tropicana saves ₹11. Showing Dairy first!" },
    },
  },
  'ecommerce': {
    title: 'E-Commerce',
    yuktiGreeting: "Hi! I'm Yukti ✦ I compare electronics, fashion and lifestyle products so you never overpay. What are you looking for?",
    suggestions: [
      { text: 'Best phone deals 📱', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&q=80', query: 'phone' },
      { text: 'Fashion discounts 👕', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&q=80', query: 'fashion' },
      { text: 'Kitchen deals 🏠', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&q=80', query: 'kitchen' },
      { text: 'Sports gear 🏋️', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100&q=80', query: 'sports' },
      { text: 'Books cheap 📚', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&q=80', query: 'books' },
    ],
    prompts: [
      { icon: '💬', text: 'Find me best deals on electronics' },
      { icon: '🔍', text: 'Compare shoes across all stores' },
      { icon: '💰', text: 'Where do I save the most today?' },
    ],
    keywords: {
      phone: { categoryId: 'electronics', productName: 'earphones', response: "📱 Opening Electronics → finding best phone accessories → comparing prices..." },
      electronics: { categoryId: 'electronics', productName: null, response: "⚡ Taking you to Electronics — up to 30% off right now!" },
      earphones: { categoryId: 'electronics', productName: 'earphones', response: "🎧 Finding boAt Earphones — cheapest at ₹399 on Open Food Facts!" },
      fashion: { categoryId: 'fashion', productName: null, response: "👕 Opening Fashion — 78 products, up to 25% off this week!" },
      shirt: { categoryId: 'fashion', productName: 'shirt', response: "👕 Finding Classic White T-Shirt → comparing prices across stores..." },
      shoes: { categoryId: 'fashion', productName: 'shoes', response: "👟 Finding Running Shoes → best price at ₹1499!" },
      kitchen: { categoryId: 'home', productName: null, response: "🏠 Taking you to Home & Kitchen — great appliance deals!" },
      home: { categoryId: 'home', productName: null, response: "🏠 Opening Home & Kitchen section..." },
      sports: { categoryId: 'sports', productName: null, response: "🏋️ Opening Sports & Fitness — compare gym gear!" },
      books: { categoryId: 'books', productName: null, response: "📚 Taking you to Books — 92 products, 10% off!" },
      beauty: { categoryId: 'beauty', productName: null, response: "💄 Opening Beauty & Personal Care!" },
      save: { categoryId: 'electronics', productName: null, response: "💰 Best savings today: boAt Earphones 50% off, Running Shoes 50% off. Showing Electronics!" },
    },
  },
  'food': {
    title: 'Food & Meals',
    yuktiGreeting: "Hi! I'm Yukti ✦ I compare meal prices across platforms so you always get the best deal on your favourite food. What are you craving?",
    suggestions: [
      { text: 'Best biryani deal 🍚', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100&q=80', query: 'biryani' },
      { text: 'Cheapest pizza 🍕', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&q=80', query: 'pizza' },
      { text: 'Burger deals 🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&q=80', query: 'burger' },
      { text: 'Healthy meals 🥗', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&q=80', query: 'healthy' },
      { text: 'Dessert prices 🍰', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&q=80', query: 'dessert' },
    ],
    prompts: [
      { icon: '💬', text: 'Which platform has cheapest biryani?' },
      { icon: '🔍', text: 'Compare pizza prices across apps' },
      { icon: '💰', text: 'Where do I save the most today?' },
    ],
    keywords: {
      biryani: { categoryId: 'biryani', productName: 'chicken', response: "🍚 Finding Chicken Biryani → comparing prices across platforms..." },
      pizza: { categoryId: 'fast-food', productName: 'pizza', response: "🍕 Going to Fast Food → finding Margherita Pizza → cheapest platform wins!" },
      burger: { categoryId: 'fast-food', productName: 'burger', response: "🍔 Finding Classic Burger → comparing all food platforms..." },
      healthy: { categoryId: 'healthy', productName: null, response: "🥗 Opening Healthy Meals — salads and bowls compared across platforms!" },
      dessert: { categoryId: 'desserts', productName: null, response: "🍰 Taking you to Desserts — cakes, ice cream, mithai compared!" },
      north: { categoryId: 'north-indian', productName: null, response: "🍛 Opening North Indian — Dal Makhani, Paneer Butter Masala and more!" },
      chinese: { categoryId: 'chinese', productName: null, response: "🍜 Taking you to Chinese — Fried Rice, Noodles, Manchurian compared!" },
      breakfast: { categoryId: 'breakfast-meals', productName: null, response: "🥞 Opening Breakfast Meals — Poha, Idli, Paratha compared!" },
      south: { categoryId: 'south-indian', productName: null, response: "🥘 Opening South Indian — Dosa, Idli, Sambar compared!" },
      dosa: { categoryId: 'south-indian', productName: 'dosa', response: "🫓 Finding Masala Dosa → comparing prices across all platforms..." },
      save: { categoryId: 'fast-food', productName: null, response: "💰 Best meal deals today: Burger saves ₹20 on DummyJSON, Biryani saves ₹32. Showing Fast Food!" },
    },
  },
}

const allCategories = {
  'quick-commerce': [
    { id: 'dairy', name: 'Dairy & Eggs', description: 'Milk, Curd, Paneer, Butter, Ghee', emoji: '🥛', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80', count: 48, tag: 'TOP SELLER', tagColor: '#4CAF50', tagBg: '#0A1F0A', discount: '20% off' },
    { id: 'snacks', name: 'Snacks & Bakery', description: 'Chips, Biscuits, Namkeen, Cookies', emoji: '🍪', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&q=80', count: 64, tag: 'TRENDING', tagColor: '#FF9800', tagBg: '#1F1000', discount: '15% off' },
    { id: 'beverages', name: 'Beverages', description: 'Juice, Water, Soda, Tea, Coffee', emoji: '🥤', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&q=80', count: 36, tag: 'SALE', tagColor: '#FFD700', tagBg: '#1A1500', discount: '10% off' },
    { id: 'fruits', name: 'Fruits & Vegetables', description: 'Fresh produce, seasonal fruits', emoji: '🥦', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80', count: 52, tag: 'FRESH', tagColor: '#4CAF50', tagBg: '#0A1F0A', discount: null },
    { id: 'household', name: 'Household', description: 'Detergent, Cleaners, Paper towels', emoji: '🧹', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300&q=80', count: 29, tag: 'NEW', tagColor: '#CE93D8', tagBg: '#0F001F', discount: null },
    { id: 'personal-care', name: 'Personal Care', description: 'Soap, Shampoo, Toothpaste', emoji: '🧴', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&q=80', count: 41, tag: 'POPULAR', tagColor: '#FFD700', tagBg: '#1A1500', discount: '12% off' },
    { id: 'masala', name: 'Masala & Spices', description: 'Turmeric, Cumin, Garam masala', emoji: '🌶️', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=80', count: 55, tag: 'ESSENTIAL', tagColor: '#FF6B35', tagBg: '#1A0800', discount: '18% off' },
    { id: 'breakfast', name: 'Breakfast & Cereals', description: 'Oats, Cornflakes, Bread', emoji: '🥣', image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=300&q=80', count: 31, tag: 'HEALTHY', tagColor: '#4CAF50', tagBg: '#0A1F0A', discount: null },
    { id: 'frozen', name: 'Frozen Foods', description: 'Ice cream, Frozen veg', emoji: '🧊', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&q=80', count: 22, tag: 'COLD', tagColor: '#64B5F6', tagBg: '#00091A', discount: '8% off' },
    { id: 'bakery', name: 'Bakery & Breads', description: 'Bread, Pav, Rusk', emoji: '🍞', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80', count: 18, tag: 'FRESH', tagColor: '#FFD700', tagBg: '#1A1500', discount: null },
    { id: 'baby', name: 'Baby & Kids', description: 'Baby food, Diapers, Formula', emoji: '👶', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&q=80', count: 34, tag: 'SAFE', tagColor: '#4CAF50', tagBg: '#0A1F0A', discount: '5% off' },
    { id: 'pet', name: 'Pet Supplies', description: 'Dog food, Cat food', emoji: '🐾', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&q=80', count: 26, tag: 'NEW', tagColor: '#CE93D8', tagBg: '#0F001F', discount: null },
  ],
  'ecommerce': [
    { id: 'electronics', name: 'Electronics', description: 'Phones, Laptops, Accessories', emoji: '📱', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&q=80', count: 43, tag: 'HOT', tagColor: '#F44336', tagBg: '#1F0000', discount: '30% off' },
    { id: 'fashion', name: 'Fashion', description: 'Clothing, Shoes, Bags', emoji: '👕', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&q=80', count: 78, tag: 'TRENDING', tagColor: '#FF9800', tagBg: '#1F1000', discount: '25% off' },
    { id: 'home', name: 'Home & Kitchen', description: 'Appliances, Cookware, Decor', emoji: '🏠', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80', count: 55, tag: 'SALE', tagColor: '#FFD700', tagBg: '#1A1500', discount: '20% off' },
    { id: 'beauty', name: 'Beauty & Personal Care', description: 'Skincare, Haircare, Makeup', emoji: '💄', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80', count: 61, tag: 'NEW', tagColor: '#CE93D8', tagBg: '#0F001F', discount: null },
    { id: 'sports', name: 'Sports & Fitness', description: 'Gym equipment, Sportswear', emoji: '🏋️', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&q=80', count: 38, tag: 'POPULAR', tagColor: '#4CAF50', tagBg: '#0A1F0A', discount: '15% off' },
    { id: 'books', name: 'Books & Stationery', description: 'Fiction, Non-fiction, Notebooks', emoji: '📚', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=80', count: 92, tag: 'VAST', tagColor: '#FFD700', tagBg: '#1A1500', discount: '10% off' },
    { id: 'toys', name: 'Toys & Games', description: 'Board games, Action figures', emoji: '🎮', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&q=80', count: 47, tag: 'FUN', tagColor: '#FF9800', tagBg: '#1F1000', discount: null },
    { id: 'health', name: 'Health & Wellness', description: 'Vitamins, Supplements', emoji: '💊', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&q=80', count: 53, tag: 'ESSENTIAL', tagColor: '#4CAF50', tagBg: '#0A1F0A', discount: null },
    { id: 'automotive', name: 'Automotive', description: 'Car accessories, Tools', emoji: '🚗', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&q=80', count: 29, tag: 'NEW', tagColor: '#CE93D8', tagBg: '#0F001F', discount: '12% off' },
    { id: 'office', name: 'Office Supplies', description: 'Printers, Chairs, Desks', emoji: '💼', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80', count: 34, tag: 'WORK', tagColor: '#FFD700', tagBg: '#1A1500', discount: '8% off' },
  ],
  'food': [
    { id: 'north-indian', name: 'North Indian', description: 'Dal Makhani, Paneer, Biryani, Roti', emoji: '🍛', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&q=80', count: 42, tag: 'POPULAR', tagColor: '#FF9800', tagBg: '#1F1000', discount: '20% off' },
    { id: 'south-indian', name: 'South Indian', description: 'Dosa, Idli, Sambar, Vada', emoji: '🥘', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=300&q=80', count: 38, tag: 'LOVED', tagColor: '#4CAF50', tagBg: '#0A1F0A', discount: '15% off' },
    { id: 'chinese', name: 'Chinese', description: 'Fried Rice, Noodles, Manchurian', emoji: '🍜', image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=300&q=80', count: 35, tag: 'TRENDING', tagColor: '#FFD700', tagBg: '#1A1500', discount: '10% off' },
    { id: 'fast-food', name: 'Fast Food', description: 'Burgers, Pizza, Fries, Wraps', emoji: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80', count: 56, tag: 'HOT', tagColor: '#F44336', tagBg: '#1F0000', discount: '25% off' },
    { id: 'healthy', name: 'Healthy Meals', description: 'Salads, Bowls, Smoothies, Wraps', emoji: '🥗', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80', count: 29, tag: 'FRESH', tagColor: '#4CAF50', tagBg: '#0A1F0A', discount: null },
    { id: 'desserts', name: 'Desserts & Sweets', description: 'Cakes, Ice Cream, Mithai, Waffles', emoji: '🍰', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80', count: 33, tag: 'SWEET', tagColor: '#CE93D8', tagBg: '#0F001F', discount: '5% off' },
    { id: 'breakfast-meals', name: 'Breakfast', description: 'Poha, Paratha, Upma, Pancakes', emoji: '🥞', image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=300&q=80', count: 24, tag: 'MORNING', tagColor: '#FFD700', tagBg: '#1A1500', discount: null },
    { id: 'biryani', name: 'Biryani & Rice', description: 'Chicken, Mutton, Veg Biryani', emoji: '🍚', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80', count: 28, tag: 'BESTSELLER', tagColor: '#FF9800', tagBg: '#1F1000', discount: '18% off' },
    { id: 'street-food', name: 'Street Food', description: 'Chaat, Pani Puri, Vada Pav', emoji: '🌮', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&q=80', count: 31, tag: 'DESI', tagColor: '#FF6B35', tagBg: '#1A0800', discount: '12% off' },
    { id: 'beverages-food', name: 'Drinks & Shakes', description: 'Lassi, Smoothies, Cold Coffee', emoji: '🥤', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&q=80', count: 22, tag: 'REFRESHING', tagColor: '#64B5F6', tagBg: '#00091A', discount: null },
    { id: 'continental', name: 'Continental', description: 'Pasta, Sandwiches, Soup', emoji: '🍝', image: 'https://images.unsplash.com/photo-1551183053-bf91798d4c44?w=300&q=80', count: 19, tag: 'NEW', tagColor: '#CE93D8', tagBg: '#0F001F', discount: null },
  ],
}

const allProducts = {
  dairy: [
    { id: 'd1', name: 'Amul Taaza Milk', quantity: '1', unit: 'L', emoji: '🥛', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 54, originalPrice: 68, unitPrice: 5.4, isBest: true }, { name: 'DummyJSON', price: 62, originalPrice: 72, unitPrice: 6.2, isBest: false }, { name: 'FakeStore', price: 60, originalPrice: 70, unitPrice: 6.0, isBest: false }] },
    { id: 'd2', name: 'Mother Dairy Curd', quantity: '400', unit: 'g', emoji: '🥛', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 45, originalPrice: 50, unitPrice: 11.25, isBest: false }, { name: 'DummyJSON', price: 42, originalPrice: 48, unitPrice: 10.5, isBest: true }, { name: 'FakeStore', price: 48, originalPrice: 55, unitPrice: 12.0, isBest: false }] },
    { id: 'd3', name: 'Amul Butter', quantity: '500', unit: 'g', emoji: '🧈', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 245, originalPrice: 280, unitPrice: 49.0, isBest: false }, { name: 'DummyJSON', price: 230, originalPrice: 265, unitPrice: 46.0, isBest: true }, { name: 'FakeStore', price: 255, originalPrice: 290, unitPrice: 51.0, isBest: false }] },
    { id: 'd4', name: 'Fresh Paneer', quantity: '200', unit: 'g', emoji: '🧀', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 89, originalPrice: 100, unitPrice: 44.5, isBest: true }, { name: 'DummyJSON', price: 95, originalPrice: 108, unitPrice: 47.5, isBest: false }, { name: 'FakeStore', price: 92, originalPrice: 105, unitPrice: 46.0, isBest: false }] },
    { id: 'd5', name: 'Amul Gold Full Cream', quantity: '500', unit: 'ml', emoji: '🥛', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 32, originalPrice: 38, unitPrice: 6.4, isBest: false }, { name: 'DummyJSON', price: 28, originalPrice: 35, unitPrice: 5.6, isBest: true }, { name: 'FakeStore', price: 30, originalPrice: 36, unitPrice: 6.0, isBest: false }] },
    { id: 'd6', name: 'Pure Ghee 500g', quantity: '500', unit: 'g', emoji: '🫙', image: 'https://images.unsplash.com/photo-1631949454967-6c40a63b2a76?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 320, originalPrice: 360, unitPrice: 64.0, isBest: false }, { name: 'DummyJSON', price: 295, originalPrice: 340, unitPrice: 59.0, isBest: true }, { name: 'FakeStore', price: 310, originalPrice: 350, unitPrice: 62.0, isBest: false }] },
    { id: 'd7', name: 'Britannia Cheese Slices', quantity: '200', unit: 'g', emoji: '🧀', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 115, originalPrice: 130, unitPrice: 57.5, isBest: false }, { name: 'DummyJSON', price: 108, originalPrice: 125, unitPrice: 54.0, isBest: true }, { name: 'FakeStore', price: 120, originalPrice: 135, unitPrice: 60.0, isBest: false }] },
    { id: 'd8', name: 'Amul Shrikhand', quantity: '200', unit: 'g', emoji: '🍮', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 72, originalPrice: 85, unitPrice: 36.0, isBest: false }, { name: 'DummyJSON', price: 65, originalPrice: 78, unitPrice: 32.5, isBest: true }, { name: 'FakeStore', price: 70, originalPrice: 82, unitPrice: 35.0, isBest: false }] },
    { id: 'd9', name: 'Mishti Doi 200g', quantity: '200', unit: 'g', emoji: '🥛', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 45, originalPrice: 52, unitPrice: 22.5, isBest: true }, { name: 'DummyJSON', price: 50, originalPrice: 58, unitPrice: 25.0, isBest: false }, { name: 'FakeStore', price: 48, originalPrice: 55, unitPrice: 24.0, isBest: false }] },
    { id: 'd10', name: 'Vanilla Ice Cream 700ml', quantity: '700', unit: 'ml', emoji: '🍦', image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 185, originalPrice: 220, unitPrice: 26.4, isBest: false }, { name: 'DummyJSON', price: 170, originalPrice: 205, unitPrice: 24.3, isBest: true }, { name: 'FakeStore', price: 180, originalPrice: 215, unitPrice: 25.7, isBest: false }] },
  ],
  snacks: [
    { id: 's1', name: "Lay's Classic Salted", quantity: '100', unit: 'g', emoji: '🍟', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 20, originalPrice: 25, unitPrice: 20.0, isBest: true }, { name: 'DummyJSON', price: 22, originalPrice: 28, unitPrice: 22.0, isBest: false }, { name: 'FakeStore', price: 24, originalPrice: 30, unitPrice: 24.0, isBest: false }] },
    { id: 's2', name: 'Parle-G Biscuits 800g', quantity: '800', unit: 'g', emoji: '🍪', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 50, originalPrice: 60, unitPrice: 6.25, isBest: true }, { name: 'DummyJSON', price: 55, originalPrice: 65, unitPrice: 6.87, isBest: false }, { name: 'FakeStore', price: 52, originalPrice: 62, unitPrice: 6.5, isBest: false }] },
    { id: 's3', name: 'Kurkure Masala Munch', quantity: '90', unit: 'g', emoji: '🌽', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 20, originalPrice: 25, unitPrice: 22.2, isBest: false }, { name: 'DummyJSON', price: 18, originalPrice: 22, unitPrice: 20.0, isBest: true }, { name: 'FakeStore', price: 22, originalPrice: 27, unitPrice: 24.4, isBest: false }] },
    { id: 's4', name: 'Britannia Bourbon', quantity: '200', unit: 'g', emoji: '🍫', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 30, originalPrice: 38, unitPrice: 15.0, isBest: true }, { name: 'DummyJSON', price: 34, originalPrice: 42, unitPrice: 17.0, isBest: false }, { name: 'FakeStore', price: 32, originalPrice: 40, unitPrice: 16.0, isBest: false }] },
    { id: 's5', name: 'Haldiram Aloo Bhujia', quantity: '200', unit: 'g', emoji: '🥜', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 45, originalPrice: 55, unitPrice: 22.5, isBest: false }, { name: 'DummyJSON', price: 40, originalPrice: 50, unitPrice: 20.0, isBest: true }, { name: 'FakeStore', price: 48, originalPrice: 58, unitPrice: 24.0, isBest: false }] },
    { id: 's6', name: 'Maggi 2 Minute Noodles', quantity: '280', unit: 'g', emoji: '🍜', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 56, originalPrice: 68, unitPrice: 20.0, isBest: true }, { name: 'DummyJSON', price: 62, originalPrice: 74, unitPrice: 22.1, isBest: false }, { name: 'FakeStore', price: 60, originalPrice: 72, unitPrice: 21.4, isBest: false }] },
    { id: 's7', name: 'Pringles Original', quantity: '165', unit: 'g', emoji: '🍟', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 189, originalPrice: 220, unitPrice: 114.5, isBest: false }, { name: 'DummyJSON', price: 175, originalPrice: 210, unitPrice: 106.1, isBest: true }, { name: 'FakeStore', price: 182, originalPrice: 215, unitPrice: 110.3, isBest: false }] },
    { id: 's8', name: 'Good Day Cashew Cookies', quantity: '250', unit: 'g', emoji: '🍪', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 50, originalPrice: 62, unitPrice: 20.0, isBest: true }, { name: 'DummyJSON', price: 55, originalPrice: 68, unitPrice: 22.0, isBest: false }, { name: 'FakeStore', price: 52, originalPrice: 65, unitPrice: 20.8, isBest: false }] },
    { id: 's9', name: 'Bikaji Punjabi Tadka', quantity: '400', unit: 'g', emoji: '🥜', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 80, originalPrice: 95, unitPrice: 20.0, isBest: true }, { name: 'DummyJSON', price: 88, originalPrice: 105, unitPrice: 22.0, isBest: false }, { name: 'FakeStore', price: 85, originalPrice: 100, unitPrice: 21.25, isBest: false }] },
    { id: 's10', name: 'Oreo Original Cookies', quantity: '300', unit: 'g', emoji: '🍫', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 95, originalPrice: 115, unitPrice: 31.7, isBest: false }, { name: 'DummyJSON', price: 88, originalPrice: 108, unitPrice: 29.3, isBest: true }, { name: 'FakeStore', price: 92, originalPrice: 112, unitPrice: 30.7, isBest: false }] },
  ],
  beverages: [
    { id: 'b1', name: 'Tropicana Orange Juice', quantity: '1', unit: 'L', emoji: '🍊', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 99, originalPrice: 120, unitPrice: 9.9, isBest: true }, { name: 'DummyJSON', price: 110, originalPrice: 130, unitPrice: 11.0, isBest: false }, { name: 'FakeStore', price: 105, originalPrice: 125, unitPrice: 10.5, isBest: false }] },
    { id: 'b2', name: 'Red Bull Energy Drink', quantity: '250', unit: 'ml', emoji: '🥤', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 115, originalPrice: 130, unitPrice: 46.0, isBest: false }, { name: 'DummyJSON', price: 108, originalPrice: 125, unitPrice: 43.2, isBest: true }, { name: 'FakeStore', price: 120, originalPrice: 135, unitPrice: 48.0, isBest: false }] },
    { id: 'b3', name: 'Paperboat Aam Panna', quantity: '200', unit: 'ml', emoji: '🥭', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 25, originalPrice: 30, unitPrice: 12.5, isBest: true }, { name: 'DummyJSON', price: 28, originalPrice: 33, unitPrice: 14.0, isBest: false }, { name: 'FakeStore', price: 26, originalPrice: 31, unitPrice: 13.0, isBest: false }] },
    { id: 'b4', name: 'Bisleri Mineral Water', quantity: '1', unit: 'L', emoji: '💧', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 20, originalPrice: 25, unitPrice: 2.0, isBest: true }, { name: 'DummyJSON', price: 22, originalPrice: 27, unitPrice: 2.2, isBest: false }, { name: 'FakeStore', price: 21, originalPrice: 26, unitPrice: 2.1, isBest: false }] },
    { id: 'b5', name: 'Coca-Cola 750ml', quantity: '750', unit: 'ml', emoji: '🥤', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 45, originalPrice: 55, unitPrice: 6.0, isBest: true }, { name: 'DummyJSON', price: 50, originalPrice: 60, unitPrice: 6.67, isBest: false }, { name: 'FakeStore', price: 48, originalPrice: 58, unitPrice: 6.4, isBest: false }] },
    { id: 'b6', name: 'Tata Tea Gold 250g', quantity: '250', unit: 'g', emoji: '🍵', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 145, originalPrice: 170, unitPrice: 58.0, isBest: false }, { name: 'DummyJSON', price: 135, originalPrice: 160, unitPrice: 54.0, isBest: true }, { name: 'FakeStore', price: 140, originalPrice: 165, unitPrice: 56.0, isBest: false }] },
    { id: 'b7', name: 'Nescafé Classic Coffee', quantity: '200', unit: 'g', emoji: '☕', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 380, originalPrice: 430, unitPrice: 190.0, isBest: false }, { name: 'DummyJSON', price: 355, originalPrice: 405, unitPrice: 177.5, isBest: true }, { name: 'FakeStore', price: 370, originalPrice: 420, unitPrice: 185.0, isBest: false }] },
    { id: 'b8', name: 'Raw Pressery Apple Juice', quantity: '250', unit: 'ml', emoji: '🍎', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 65, originalPrice: 80, unitPrice: 26.0, isBest: false }, { name: 'DummyJSON', price: 58, originalPrice: 72, unitPrice: 23.2, isBest: true }, { name: 'FakeStore', price: 62, originalPrice: 77, unitPrice: 24.8, isBest: false }] },
  ],
  fruits: [
    { id: 'f1', name: 'Fresh Bananas 500g', quantity: '500', unit: 'g', emoji: '🍌', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 35, originalPrice: 45, unitPrice: 7.0, isBest: true }, { name: 'DummyJSON', price: 40, originalPrice: 50, unitPrice: 8.0, isBest: false }, { name: 'FakeStore', price: 38, originalPrice: 48, unitPrice: 7.6, isBest: false }] },
    { id: 'f2', name: 'Royal Gala Apples 1kg', quantity: '1', unit: 'kg', emoji: '🍎', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 180, originalPrice: 220, unitPrice: 18.0, isBest: false }, { name: 'DummyJSON', price: 165, originalPrice: 200, unitPrice: 16.5, isBest: true }, { name: 'FakeStore', price: 175, originalPrice: 210, unitPrice: 17.5, isBest: false }] },
    { id: 'f3', name: 'Fresh Spinach 250g', quantity: '250', unit: 'g', emoji: '🥬', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 25, originalPrice: 32, unitPrice: 10.0, isBest: true }, { name: 'DummyJSON', price: 28, originalPrice: 35, unitPrice: 11.2, isBest: false }, { name: 'FakeStore', price: 27, originalPrice: 34, unitPrice: 10.8, isBest: false }] },
    { id: 'f4', name: 'Alphonso Mangoes 1kg', quantity: '1', unit: 'kg', emoji: '🥭', image: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 350, originalPrice: 420, unitPrice: 35.0, isBest: false }, { name: 'DummyJSON', price: 320, originalPrice: 390, unitPrice: 32.0, isBest: true }, { name: 'FakeStore', price: 340, originalPrice: 410, unitPrice: 34.0, isBest: false }] },
    { id: 'f5', name: 'Cherry Tomatoes 250g', quantity: '250', unit: 'g', emoji: '🍅', image: 'https://images.unsplash.com/photo-1546094096-0df4bcabd337?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 45, originalPrice: 55, unitPrice: 18.0, isBest: false }, { name: 'DummyJSON', price: 40, originalPrice: 50, unitPrice: 16.0, isBest: true }, { name: 'FakeStore', price: 42, originalPrice: 52, unitPrice: 16.8, isBest: false }] },
    { id: 'f6', name: 'Green Grapes 500g', quantity: '500', unit: 'g', emoji: '🍇', image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 120, originalPrice: 145, unitPrice: 24.0, isBest: false }, { name: 'DummyJSON', price: 108, originalPrice: 132, unitPrice: 21.6, isBest: true }, { name: 'FakeStore', price: 115, originalPrice: 140, unitPrice: 23.0, isBest: false }] },
    { id: 'f7', name: 'Sweet Corn 2pcs', quantity: '2', unit: 'pcs', emoji: '🌽', image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 40, originalPrice: 50, unitPrice: 20.0, isBest: true }, { name: 'DummyJSON', price: 45, originalPrice: 55, unitPrice: 22.5, isBest: false }, { name: 'FakeStore', price: 42, originalPrice: 52, unitPrice: 21.0, isBest: false }] },
    { id: 'f8', name: 'Baby Potatoes 500g', quantity: '500', unit: 'g', emoji: '🥔', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 38, originalPrice: 48, unitPrice: 7.6, isBest: false }, { name: 'DummyJSON', price: 32, originalPrice: 42, unitPrice: 6.4, isBest: true }, { name: 'FakeStore', price: 35, originalPrice: 45, unitPrice: 7.0, isBest: false }] },
  ],
  household: [
    { id: 'h1', name: 'Ariel Matic Powder 1kg', quantity: '1', unit: 'kg', emoji: '🧺', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 220, originalPrice: 260, unitPrice: 22.0, isBest: false }, { name: 'DummyJSON', price: 198, originalPrice: 240, unitPrice: 19.8, isBest: true }, { name: 'FakeStore', price: 210, originalPrice: 250, unitPrice: 21.0, isBest: false }] },
    { id: 'h2', name: 'Vim Dishwash Bar', quantity: '300', unit: 'g', emoji: '🍽️', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 40, originalPrice: 50, unitPrice: 13.3, isBest: false }, { name: 'DummyJSON', price: 35, originalPrice: 44, unitPrice: 11.7, isBest: true }, { name: 'FakeStore', price: 38, originalPrice: 47, unitPrice: 12.7, isBest: false }] },
    { id: 'h3', name: 'Harpic Bathroom Cleaner', quantity: '500', unit: 'ml', emoji: '🚿', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 120, originalPrice: 145, unitPrice: 24.0, isBest: false }, { name: 'DummyJSON', price: 108, originalPrice: 132, unitPrice: 21.6, isBest: true }, { name: 'FakeStore', price: 115, originalPrice: 140, unitPrice: 23.0, isBest: false }] },
    { id: 'h4', name: 'Colin Glass Cleaner', quantity: '500', unit: 'ml', emoji: '🪟', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 95, originalPrice: 115, unitPrice: 19.0, isBest: false }, { name: 'DummyJSON', price: 85, originalPrice: 105, unitPrice: 17.0, isBest: true }, { name: 'FakeStore', price: 90, originalPrice: 110, unitPrice: 18.0, isBest: false }] },
    { id: 'h5', name: 'Scotch-Brite Scrub 3pcs', quantity: '3', unit: 'pcs', emoji: '🧽', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 55, originalPrice: 68, unitPrice: 18.3, isBest: false }, { name: 'DummyJSON', price: 48, originalPrice: 60, unitPrice: 16.0, isBest: true }, { name: 'FakeStore', price: 52, originalPrice: 65, unitPrice: 17.3, isBest: false }] },
    { id: 'h6', name: 'Surf Excel Liquid 1L', quantity: '1', unit: 'L', emoji: '🧴', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 195, originalPrice: 240, unitPrice: 19.5, isBest: false }, { name: 'DummyJSON', price: 178, originalPrice: 220, unitPrice: 17.8, isBest: true }, { name: 'FakeStore', price: 188, originalPrice: 232, unitPrice: 18.8, isBest: false }] },
  ],
  'personal-care': [
    { id: 'pc1', name: 'Dove Soap 100g', quantity: '100', unit: 'g', emoji: '🧼', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 45, originalPrice: 55, unitPrice: 45.0, isBest: false }, { name: 'DummyJSON', price: 40, originalPrice: 50, unitPrice: 40.0, isBest: true }, { name: 'FakeStore', price: 42, originalPrice: 52, unitPrice: 42.0, isBest: false }] },
    { id: 'pc2', name: 'Head & Shoulders Shampoo', quantity: '340', unit: 'ml', emoji: '🧴', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 299, originalPrice: 350, unitPrice: 87.9, isBest: false }, { name: 'DummyJSON', price: 275, originalPrice: 325, unitPrice: 80.9, isBest: true }, { name: 'FakeStore', price: 285, originalPrice: 338, unitPrice: 83.8, isBest: false }] },
    { id: 'pc3', name: 'Colgate Strong Teeth 200g', quantity: '200', unit: 'g', emoji: '🦷', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 85, originalPrice: 100, unitPrice: 42.5, isBest: false }, { name: 'DummyJSON', price: 78, originalPrice: 95, unitPrice: 39.0, isBest: true }, { name: 'FakeStore', price: 82, originalPrice: 98, unitPrice: 41.0, isBest: false }] },
    { id: 'pc4', name: 'Gillette Mach3 Razor', quantity: '1', unit: 'pcs', emoji: '🪒', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 199, originalPrice: 250, unitPrice: 199, isBest: false }, { name: 'DummyJSON', price: 178, originalPrice: 230, unitPrice: 178, isBest: true }, { name: 'FakeStore', price: 189, originalPrice: 242, unitPrice: 189, isBest: false }] },
    { id: 'pc5', name: 'Nivea Body Lotion 400ml', quantity: '400', unit: 'ml', emoji: '🧴', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 245, originalPrice: 295, unitPrice: 61.25, isBest: false }, { name: 'DummyJSON', price: 225, originalPrice: 275, unitPrice: 56.25, isBest: true }, { name: 'FakeStore', price: 235, originalPrice: 285, unitPrice: 58.75, isBest: false }] },
  ],
  masala: [
    { id: 'm1', name: 'MDH Garam Masala 100g', quantity: '100', unit: 'g', emoji: '🌶️', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 65, originalPrice: 78, unitPrice: 65.0, isBest: false }, { name: 'DummyJSON', price: 58, originalPrice: 70, unitPrice: 58.0, isBest: true }, { name: 'FakeStore', price: 62, originalPrice: 74, unitPrice: 62.0, isBest: false }] },
    { id: 'm2', name: 'Everest Turmeric 200g', quantity: '200', unit: 'g', emoji: '🟡', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 48, originalPrice: 58, unitPrice: 24.0, isBest: false }, { name: 'DummyJSON', price: 42, originalPrice: 52, unitPrice: 21.0, isBest: true }, { name: 'FakeStore', price: 45, originalPrice: 55, unitPrice: 22.5, isBest: false }] },
    { id: 'm3', name: 'Catch Cumin Seeds 100g', quantity: '100', unit: 'g', emoji: '🌿', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 38, originalPrice: 46, unitPrice: 38.0, isBest: false }, { name: 'DummyJSON', price: 32, originalPrice: 40, unitPrice: 32.0, isBest: true }, { name: 'FakeStore', price: 35, originalPrice: 43, unitPrice: 35.0, isBest: false }] },
    { id: 'm4', name: 'Badshah Chole Masala', quantity: '100', unit: 'g', emoji: '🌶️', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 55, originalPrice: 65, unitPrice: 55.0, isBest: false }, { name: 'DummyJSON', price: 48, originalPrice: 58, unitPrice: 48.0, isBest: true }, { name: 'FakeStore', price: 52, originalPrice: 62, unitPrice: 52.0, isBest: false }] },
    { id: 'm5', name: 'Red Chilli Powder 200g', quantity: '200', unit: 'g', emoji: '🌶️', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 72, originalPrice: 88, unitPrice: 36.0, isBest: false }, { name: 'DummyJSON', price: 65, originalPrice: 80, unitPrice: 32.5, isBest: true }, { name: 'FakeStore', price: 68, originalPrice: 84, unitPrice: 34.0, isBest: false }] },
  ],
  breakfast: [
    { id: 'br1', name: 'Quaker Oats 1kg', quantity: '1', unit: 'kg', emoji: '🥣', image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 180, originalPrice: 220, unitPrice: 18.0, isBest: false }, { name: 'DummyJSON', price: 165, originalPrice: 205, unitPrice: 16.5, isBest: true }, { name: 'FakeStore', price: 172, originalPrice: 212, unitPrice: 17.2, isBest: false }] },
    { id: 'br2', name: 'Kelloggs Cornflakes 875g', quantity: '875', unit: 'g', emoji: '🥣', image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 285, originalPrice: 340, unitPrice: 32.6, isBest: false }, { name: 'DummyJSON', price: 262, originalPrice: 318, unitPrice: 29.9, isBest: true }, { name: 'FakeStore', price: 274, originalPrice: 330, unitPrice: 31.3, isBest: false }] },
    { id: 'br3', name: 'Britannia Wheat Bread', quantity: '400', unit: 'g', emoji: '🍞', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 45, originalPrice: 55, unitPrice: 11.25, isBest: false }, { name: 'DummyJSON', price: 40, originalPrice: 50, unitPrice: 10.0, isBest: true }, { name: 'FakeStore', price: 42, originalPrice: 52, unitPrice: 10.5, isBest: false }] },
    { id: 'br4', name: 'Muesli Mixed Nuts 500g', quantity: '500', unit: 'g', emoji: '🥣', image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 245, originalPrice: 295, unitPrice: 49.0, isBest: false }, { name: 'DummyJSON', price: 225, originalPrice: 275, unitPrice: 45.0, isBest: true }, { name: 'FakeStore', price: 235, originalPrice: 285, unitPrice: 47.0, isBest: false }] },
  ],
  frozen: [
    { id: 'fr1', name: 'Amul Vanilla Ice Cream 1L', quantity: '1', unit: 'L', emoji: '🍦', image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 185, originalPrice: 220, unitPrice: 18.5, isBest: false }, { name: 'DummyJSON', price: 168, originalPrice: 205, unitPrice: 16.8, isBest: true }, { name: 'FakeStore', price: 175, originalPrice: 212, unitPrice: 17.5, isBest: false }] },
    { id: 'fr2', name: 'McCain Frozen Fries 420g', quantity: '420', unit: 'g', emoji: '🍟', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 155, originalPrice: 185, unitPrice: 36.9, isBest: false }, { name: 'DummyJSON', price: 142, originalPrice: 172, unitPrice: 33.8, isBest: true }, { name: 'FakeStore', price: 148, originalPrice: 178, unitPrice: 35.2, isBest: false }] },
    { id: 'fr3', name: 'Kwality Walls Magnum', quantity: '100', unit: 'ml', emoji: '🍫', image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 80, originalPrice: 95, unitPrice: 80.0, isBest: false }, { name: 'DummyJSON', price: 72, originalPrice: 88, unitPrice: 72.0, isBest: true }, { name: 'FakeStore', price: 76, originalPrice: 92, unitPrice: 76.0, isBest: false }] },
  ],
  electronics: [
    { id: 'e1', name: 'boAt Bassheads Earphones', quantity: '1', unit: 'pcs', emoji: '🎧', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 399, originalPrice: 799, unitPrice: 399, isBest: true }, { name: 'DummyJSON', price: 449, originalPrice: 799, unitPrice: 449, isBest: false }, { name: 'FakeStore', price: 429, originalPrice: 799, unitPrice: 429, isBest: false }] },
    { id: 'e2', name: 'Mi Power Bank 10000mAh', quantity: '1', unit: 'pcs', emoji: '🔋', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 899, originalPrice: 1299, unitPrice: 899, isBest: true }, { name: 'DummyJSON', price: 999, originalPrice: 1299, unitPrice: 999, isBest: false }, { name: 'FakeStore', price: 950, originalPrice: 1299, unitPrice: 950, isBest: false }] },
    { id: 'e3', name: 'USB-C Charging Cable 2m', quantity: '1', unit: 'pcs', emoji: '🔌', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 199, originalPrice: 499, unitPrice: 199, isBest: true }, { name: 'DummyJSON', price: 249, originalPrice: 499, unitPrice: 249, isBest: false }, { name: 'FakeStore', price: 220, originalPrice: 499, unitPrice: 220, isBest: false }] },
    { id: 'e4', name: 'Wireless Bluetooth Speaker', quantity: '1', unit: 'pcs', emoji: '🔊', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 1299, originalPrice: 2499, unitPrice: 1299, isBest: true }, { name: 'DummyJSON', price: 1499, originalPrice: 2499, unitPrice: 1499, isBest: false }, { name: 'FakeStore', price: 1399, originalPrice: 2499, unitPrice: 1399, isBest: false }] },
    { id: 'e5', name: 'Smart Watch Fitness Band', quantity: '1', unit: 'pcs', emoji: '⌚', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 1999, originalPrice: 3999, unitPrice: 1999, isBest: true }, { name: 'DummyJSON', price: 2299, originalPrice: 3999, unitPrice: 2299, isBest: false }, { name: 'FakeStore', price: 2149, originalPrice: 3999, unitPrice: 2149, isBest: false }] },
  ],
  fashion: [
    { id: 'fa1', name: 'Classic White T-Shirt', quantity: '1', unit: 'pcs', emoji: '👕', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 299, originalPrice: 599, unitPrice: 299, isBest: true }, { name: 'DummyJSON', price: 349, originalPrice: 599, unitPrice: 349, isBest: false }, { name: 'FakeStore', price: 320, originalPrice: 599, unitPrice: 320, isBest: false }] },
    { id: 'fa2', name: 'Running Shoes Size 8', quantity: '1', unit: 'pcs', emoji: '👟', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 1499, originalPrice: 2999, unitPrice: 1499, isBest: true }, { name: 'DummyJSON', price: 1699, originalPrice: 2999, unitPrice: 1699, isBest: false }, { name: 'FakeStore', price: 1599, originalPrice: 2999, unitPrice: 1599, isBest: false }] },
    { id: 'fa3', name: 'Slim Fit Jeans', quantity: '1', unit: 'pcs', emoji: '👖', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 899, originalPrice: 1799, unitPrice: 899, isBest: true }, { name: 'DummyJSON', price: 999, originalPrice: 1799, unitPrice: 999, isBest: false }, { name: 'FakeStore', price: 949, originalPrice: 1799, unitPrice: 949, isBest: false }] },
    { id: 'fa4', name: 'Leather Handbag', quantity: '1', unit: 'pcs', emoji: '👜', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 1299, originalPrice: 2599, unitPrice: 1299, isBest: true }, { name: 'DummyJSON', price: 1499, originalPrice: 2599, unitPrice: 1499, isBest: false }, { name: 'FakeStore', price: 1399, originalPrice: 2599, unitPrice: 1399, isBest: false }] },
  ],
  home: [
    { id: 'ho1', name: 'Prestige Non-Stick Tawa', quantity: '1', unit: 'pcs', emoji: '🍳', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 699, originalPrice: 999, unitPrice: 699, isBest: true }, { name: 'DummyJSON', price: 799, originalPrice: 999, unitPrice: 799, isBest: false }, { name: 'FakeStore', price: 749, originalPrice: 999, unitPrice: 749, isBest: false }] },
    { id: 'ho2', name: 'Philips Air Fryer 4.1L', quantity: '1', unit: 'pcs', emoji: '🍗', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 6999, originalPrice: 9999, unitPrice: 6999, isBest: true }, { name: 'DummyJSON', price: 7499, originalPrice: 9999, unitPrice: 7499, isBest: false }, { name: 'FakeStore', price: 7299, originalPrice: 9999, unitPrice: 7299, isBest: false }] },
    { id: 'ho3', name: 'Milton Steel Bottle 1L', quantity: '1', unit: 'L', emoji: '🍶', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 399, originalPrice: 599, unitPrice: 399, isBest: true }, { name: 'DummyJSON', price: 449, originalPrice: 599, unitPrice: 449, isBest: false }, { name: 'FakeStore', price: 425, originalPrice: 599, unitPrice: 425, isBest: false }] },
    { id: 'ho4', name: 'Borosil Glass Set 6pcs', quantity: '6', unit: 'pcs', emoji: '🥛', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 599, originalPrice: 899, unitPrice: 599, isBest: true }, { name: 'DummyJSON', price: 699, originalPrice: 899, unitPrice: 699, isBest: false }, { name: 'FakeStore', price: 649, originalPrice: 899, unitPrice: 649, isBest: false }] },
  ],
  sports: [
    { id: 'sp1', name: 'Cosco Cricket Ball', quantity: '1', unit: 'pcs', emoji: '🏏', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 299, originalPrice: 499, unitPrice: 299, isBest: true }, { name: 'DummyJSON', price: 349, originalPrice: 499, unitPrice: 349, isBest: false }, { name: 'FakeStore', price: 325, originalPrice: 499, unitPrice: 325, isBest: false }] },
    { id: 'sp2', name: 'Yoga Mat 6mm', quantity: '1', unit: 'pcs', emoji: '🧘', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 499, originalPrice: 899, unitPrice: 499, isBest: true }, { name: 'DummyJSON', price: 599, originalPrice: 899, unitPrice: 599, isBest: false }, { name: 'FakeStore', price: 549, originalPrice: 899, unitPrice: 549, isBest: false }] },
    { id: 'sp3', name: 'Whey Protein 1kg Chocolate', quantity: '1', unit: 'kg', emoji: '💪', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 1299, originalPrice: 1999, unitPrice: 1299, isBest: true }, { name: 'DummyJSON', price: 1499, originalPrice: 1999, unitPrice: 1499, isBest: false }, { name: 'FakeStore', price: 1399, originalPrice: 1999, unitPrice: 1399, isBest: false }] },
    { id: 'sp4', name: 'Resistance Bands Set 5pcs', quantity: '5', unit: 'pcs', emoji: '🏋️', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 399, originalPrice: 699, unitPrice: 399, isBest: true }, { name: 'DummyJSON', price: 449, originalPrice: 699, unitPrice: 449, isBest: false }, { name: 'FakeStore', price: 425, originalPrice: 699, unitPrice: 425, isBest: false }] },
  ],
  books: [
    { id: 'bk1', name: 'Atomic Habits - James Clear', quantity: '1', unit: 'pcs', emoji: '📖', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 299, originalPrice: 499, unitPrice: 299, isBest: true }, { name: 'DummyJSON', price: 349, originalPrice: 499, unitPrice: 349, isBest: false }, { name: 'FakeStore', price: 320, originalPrice: 499, unitPrice: 320, isBest: false }] },
    { id: 'bk2', name: 'Rich Dad Poor Dad', quantity: '1', unit: 'pcs', emoji: '📚', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 199, originalPrice: 350, unitPrice: 199, isBest: true }, { name: 'DummyJSON', price: 249, originalPrice: 350, unitPrice: 249, isBest: false }, { name: 'FakeStore', price: 225, originalPrice: 350, unitPrice: 225, isBest: false }] },
    { id: 'bk3', name: 'A4 Notebook 200 Pages', quantity: '1', unit: 'pcs', emoji: '📓', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 85, originalPrice: 120, unitPrice: 85, isBest: true }, { name: 'DummyJSON', price: 99, originalPrice: 120, unitPrice: 99, isBest: false }, { name: 'FakeStore', price: 92, originalPrice: 120, unitPrice: 92, isBest: false }] },
  ],
  beauty: [
    { id: 'be1', name: 'Lakme 9to5 Foundation', quantity: '30', unit: 'ml', emoji: '💄', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 499, originalPrice: 699, unitPrice: 166.3, isBest: false }, { name: 'DummyJSON', price: 449, originalPrice: 699, unitPrice: 149.7, isBest: true }, { name: 'FakeStore', price: 475, originalPrice: 699, unitPrice: 158.3, isBest: false }] },
    { id: 'be2', name: 'Mamaearth Vitamin C Serum', quantity: '30', unit: 'ml', emoji: '✨', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 599, originalPrice: 799, unitPrice: 199.7, isBest: false }, { name: 'DummyJSON', price: 549, originalPrice: 799, unitPrice: 183.0, isBest: true }, { name: 'FakeStore', price: 575, originalPrice: 799, unitPrice: 191.7, isBest: false }] },
    { id: 'be3', name: 'Biotique Bio Honey Gel', quantity: '175', unit: 'g', emoji: '🍯', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 199, originalPrice: 280, unitPrice: 113.7, isBest: false }, { name: 'DummyJSON', price: 178, originalPrice: 280, unitPrice: 101.7, isBest: true }, { name: 'FakeStore', price: 188, originalPrice: 280, unitPrice: 107.4, isBest: false }] },
  ],
  'north-indian': [
    { id: 'ni1', name: 'Butter Chicken + Naan', quantity: '1', unit: 'serving', emoji: '🍛', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 220, originalPrice: 280, unitPrice: 220, isBest: false }, { name: 'DummyJSON', price: 195, originalPrice: 255, unitPrice: 195, isBest: true }, { name: 'FakeStore', price: 210, originalPrice: 270, unitPrice: 210, isBest: false }] },
    { id: 'ni2', name: 'Dal Makhani + Rice', quantity: '1', unit: 'serving', emoji: '🫘', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 180, originalPrice: 230, unitPrice: 180, isBest: false }, { name: 'DummyJSON', price: 160, originalPrice: 210, unitPrice: 160, isBest: true }, { name: 'FakeStore', price: 170, originalPrice: 220, unitPrice: 170, isBest: false }] },
    { id: 'ni3', name: 'Paneer Butter Masala', quantity: '1', unit: 'serving', emoji: '🧀', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 199, originalPrice: 260, unitPrice: 199, isBest: false }, { name: 'DummyJSON', price: 178, originalPrice: 238, unitPrice: 178, isBest: true }, { name: 'FakeStore', price: 188, originalPrice: 249, unitPrice: 188, isBest: false }] },
    { id: 'ni4', name: 'Chicken Biryani Full', quantity: '1', unit: 'serving', emoji: '🍚', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 280, originalPrice: 350, unitPrice: 280, isBest: false }, { name: 'DummyJSON', price: 255, originalPrice: 325, unitPrice: 255, isBest: true }, { name: 'FakeStore', price: 268, originalPrice: 338, unitPrice: 268, isBest: false }] },
    { id: 'ni5', name: 'Mix Veg Thali', quantity: '1', unit: 'serving', emoji: '🍽️', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 149, originalPrice: 199, unitPrice: 149, isBest: false }, { name: 'DummyJSON', price: 129, originalPrice: 179, unitPrice: 129, isBest: true }, { name: 'FakeStore', price: 139, originalPrice: 189, unitPrice: 139, isBest: false }] },
    { id: 'ni6', name: 'Chole Bhature 2pcs', quantity: '2', unit: 'pcs', emoji: '🫓', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 120, originalPrice: 160, unitPrice: 120, isBest: false }, { name: 'DummyJSON', price: 105, originalPrice: 145, unitPrice: 105, isBest: true }, { name: 'FakeStore', price: 112, originalPrice: 152, unitPrice: 112, isBest: false }] },
    { id: 'ni7', name: 'Aloo Paratha + Butter', quantity: '2', unit: 'pcs', emoji: '🫓', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 89, originalPrice: 120, unitPrice: 89, isBest: false }, { name: 'DummyJSON', price: 79, originalPrice: 110, unitPrice: 79, isBest: true }, { name: 'FakeStore', price: 84, originalPrice: 115, unitPrice: 84, isBest: false }] },
    { id: 'ni8', name: 'Lassi Sweet 500ml', quantity: '500', unit: 'ml', emoji: '🥛', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 75, originalPrice: 100, unitPrice: 15.0, isBest: false }, { name: 'DummyJSON', price: 65, originalPrice: 90, unitPrice: 13.0, isBest: true }, { name: 'FakeStore', price: 70, originalPrice: 95, unitPrice: 14.0, isBest: false }] },
  ],
  'south-indian': [
    { id: 'si1', name: 'Masala Dosa with Sambar', quantity: '1', unit: 'serving', emoji: '🫓', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 120, originalPrice: 160, unitPrice: 120, isBest: false }, { name: 'DummyJSON', price: 105, originalPrice: 145, unitPrice: 105, isBest: true }, { name: 'FakeStore', price: 112, originalPrice: 152, unitPrice: 112, isBest: false }] },
    { id: 'si2', name: 'Idli Sambar 4pcs', quantity: '4', unit: 'pcs', emoji: '🍚', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 90, originalPrice: 120, unitPrice: 90, isBest: false }, { name: 'DummyJSON', price: 79, originalPrice: 109, unitPrice: 79, isBest: true }, { name: 'FakeStore', price: 85, originalPrice: 115, unitPrice: 85, isBest: false }] },
    { id: 'si3', name: 'Medu Vada 3pcs', quantity: '3', unit: 'pcs', emoji: '🍩', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 80, originalPrice: 110, unitPrice: 80, isBest: false }, { name: 'DummyJSON', price: 70, originalPrice: 100, unitPrice: 70, isBest: true }, { name: 'FakeStore', price: 75, originalPrice: 105, unitPrice: 75, isBest: false }] },
    { id: 'si4', name: 'Pongal with Coconut Chutney', quantity: '1', unit: 'serving', emoji: '🍛', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 110, originalPrice: 150, unitPrice: 110, isBest: false }, { name: 'DummyJSON', price: 96, originalPrice: 136, unitPrice: 96, isBest: true }, { name: 'FakeStore', price: 103, originalPrice: 143, unitPrice: 103, isBest: false }] },
    { id: 'si5', name: 'Uttapam with Chutney', quantity: '2', unit: 'pcs', emoji: '🥞', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 100, originalPrice: 135, unitPrice: 100, isBest: false }, { name: 'DummyJSON', price: 88, originalPrice: 123, unitPrice: 88, isBest: true }, { name: 'FakeStore', price: 94, originalPrice: 129, unitPrice: 94, isBest: false }] },
  ],
  chinese: [
    { id: 'ch1', name: 'Veg Fried Rice', quantity: '1', unit: 'serving', emoji: '🍚', image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 150, originalPrice: 200, unitPrice: 150, isBest: false }, { name: 'DummyJSON', price: 130, originalPrice: 180, unitPrice: 130, isBest: true }, { name: 'FakeStore', price: 140, originalPrice: 190, unitPrice: 140, isBest: false }] },
    { id: 'ch2', name: 'Chicken Manchurian Gravy', quantity: '1', unit: 'serving', emoji: '🍜', image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 200, originalPrice: 260, unitPrice: 200, isBest: false }, { name: 'DummyJSON', price: 178, originalPrice: 238, unitPrice: 178, isBest: true }, { name: 'FakeStore', price: 189, originalPrice: 249, unitPrice: 189, isBest: false }] },
    { id: 'ch3', name: 'Hakka Noodles Veg', quantity: '1', unit: 'serving', emoji: '🍝', image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 140, originalPrice: 185, unitPrice: 140, isBest: false }, { name: 'DummyJSON', price: 122, originalPrice: 167, unitPrice: 122, isBest: true }, { name: 'FakeStore', price: 131, originalPrice: 176, unitPrice: 131, isBest: false }] },
    { id: 'ch4', name: 'Spring Rolls 4pcs', quantity: '4', unit: 'pcs', emoji: '🥢', image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 120, originalPrice: 160, unitPrice: 120, isBest: false }, { name: 'DummyJSON', price: 105, originalPrice: 145, unitPrice: 105, isBest: true }, { name: 'FakeStore', price: 112, originalPrice: 152, unitPrice: 112, isBest: false }] },
    { id: 'ch5', name: 'Chilli Paneer Dry', quantity: '1', unit: 'serving', emoji: '🧀', image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 189, originalPrice: 249, unitPrice: 189, isBest: false }, { name: 'DummyJSON', price: 168, originalPrice: 228, unitPrice: 168, isBest: true }, { name: 'FakeStore', price: 178, originalPrice: 238, unitPrice: 178, isBest: false }] },
  ],
  'fast-food': [
    { id: 'ff1', name: 'Classic Cheese Burger', quantity: '1', unit: 'pcs', emoji: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 149, originalPrice: 199, unitPrice: 149, isBest: false }, { name: 'DummyJSON', price: 129, originalPrice: 179, unitPrice: 129, isBest: true }, { name: 'FakeStore', price: 139, originalPrice: 189, unitPrice: 139, isBest: false }] },
    { id: 'ff2', name: 'Margherita Pizza 8 inch', quantity: '1', unit: 'pcs', emoji: '🍕', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 199, originalPrice: 299, unitPrice: 199, isBest: false }, { name: 'DummyJSON', price: 175, originalPrice: 275, unitPrice: 175, isBest: true }, { name: 'FakeStore', price: 185, originalPrice: 285, unitPrice: 185, isBest: false }] },
    { id: 'ff3', name: 'Chicken Wrap + Fries', quantity: '1', unit: 'combo', emoji: '🌯', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 179, originalPrice: 239, unitPrice: 179, isBest: false }, { name: 'DummyJSON', price: 155, originalPrice: 215, unitPrice: 155, isBest: true }, { name: 'FakeStore', price: 166, originalPrice: 226, unitPrice: 166, isBest: false }] },
    { id: 'ff4', name: 'French Fries Large', quantity: '1', unit: 'serving', emoji: '🍟', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 99, originalPrice: 139, unitPrice: 99, isBest: false }, { name: 'DummyJSON', price: 85, originalPrice: 125, unitPrice: 85, isBest: true }, { name: 'FakeStore', price: 92, originalPrice: 132, unitPrice: 92, isBest: false }] },
    { id: 'ff5', name: 'Loaded Nachos', quantity: '1', unit: 'serving', emoji: '🌮', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 159, originalPrice: 209, unitPrice: 159, isBest: false }, { name: 'DummyJSON', price: 139, originalPrice: 189, unitPrice: 139, isBest: true }, { name: 'FakeStore', price: 149, originalPrice: 199, unitPrice: 149, isBest: false }] },
    { id: 'ff6', name: 'Pepperoni Pizza 10 inch', quantity: '1', unit: 'pcs', emoji: '🍕', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 299, originalPrice: 449, unitPrice: 299, isBest: false }, { name: 'DummyJSON', price: 265, originalPrice: 415, unitPrice: 265, isBest: true }, { name: 'FakeStore', price: 279, originalPrice: 429, unitPrice: 279, isBest: false }] },
  ],
  healthy: [
    { id: 'he1', name: 'Grilled Chicken Salad', quantity: '1', unit: 'serving', emoji: '🥗', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 199, originalPrice: 259, unitPrice: 199, isBest: false }, { name: 'DummyJSON', price: 175, originalPrice: 235, unitPrice: 175, isBest: true }, { name: 'FakeStore', price: 185, originalPrice: 245, unitPrice: 185, isBest: false }] },
    { id: 'he2', name: 'Acai Bowl', quantity: '1', unit: 'serving', emoji: '🫐', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 249, originalPrice: 320, unitPrice: 249, isBest: false }, { name: 'DummyJSON', price: 218, originalPrice: 290, unitPrice: 218, isBest: true }, { name: 'FakeStore', price: 232, originalPrice: 305, unitPrice: 232, isBest: false }] },
    { id: 'he3', name: 'Quinoa Power Bowl', quantity: '1', unit: 'serving', emoji: '🌾', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 220, originalPrice: 290, unitPrice: 220, isBest: false }, { name: 'DummyJSON', price: 195, originalPrice: 265, unitPrice: 195, isBest: true }, { name: 'FakeStore', price: 207, originalPrice: 277, unitPrice: 207, isBest: false }] },
    { id: 'he4', name: 'Green Detox Smoothie', quantity: '350', unit: 'ml', emoji: '🥬', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 149, originalPrice: 199, unitPrice: 42.6, isBest: false }, { name: 'DummyJSON', price: 129, originalPrice: 179, unitPrice: 36.9, isBest: true }, { name: 'FakeStore', price: 139, originalPrice: 189, unitPrice: 39.7, isBest: false }] },
    { id: 'he5', name: 'Egg White Omelette', quantity: '1', unit: 'serving', emoji: '🍳', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 129, originalPrice: 169, unitPrice: 129, isBest: false }, { name: 'DummyJSON', price: 112, originalPrice: 152, unitPrice: 112, isBest: true }, { name: 'FakeStore', price: 120, originalPrice: 160, unitPrice: 120, isBest: false }] },
  ],
  desserts: [
    { id: 'de1', name: 'Chocolate Truffle Cake Slice', quantity: '1', unit: 'slice', emoji: '🍰', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 149, originalPrice: 199, unitPrice: 149, isBest: false }, { name: 'DummyJSON', price: 129, originalPrice: 179, unitPrice: 129, isBest: true }, { name: 'FakeStore', price: 139, originalPrice: 189, unitPrice: 139, isBest: false }] },
    { id: 'de2', name: 'Gulab Jamun 4pcs', quantity: '4', unit: 'pcs', emoji: '🍮', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 79, originalPrice: 109, unitPrice: 79, isBest: false }, { name: 'DummyJSON', price: 69, originalPrice: 99, unitPrice: 69, isBest: true }, { name: 'FakeStore', price: 74, originalPrice: 104, unitPrice: 74, isBest: false }] },
    { id: 'de3', name: 'Mango Kulfi 2pcs', quantity: '2', unit: 'pcs', emoji: '🍧', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 99, originalPrice: 139, unitPrice: 99, isBest: false }, { name: 'DummyJSON', price: 85, originalPrice: 125, unitPrice: 85, isBest: true }, { name: 'FakeStore', price: 92, originalPrice: 132, unitPrice: 92, isBest: false }] },
    { id: 'de4', name: 'Belgian Waffle + Nutella', quantity: '1', unit: 'pcs', emoji: '🧇', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 179, originalPrice: 229, unitPrice: 179, isBest: false }, { name: 'DummyJSON', price: 155, originalPrice: 205, unitPrice: 155, isBest: true }, { name: 'FakeStore', price: 165, originalPrice: 215, unitPrice: 165, isBest: false }] },
  ],
  biryani: [
    { id: 'bi1', name: 'Chicken Dum Biryani', quantity: '1', unit: 'serving', emoji: '🍚', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 280, originalPrice: 350, unitPrice: 280, isBest: false }, { name: 'DummyJSON', price: 248, originalPrice: 320, unitPrice: 248, isBest: true }, { name: 'FakeStore', price: 265, originalPrice: 336, unitPrice: 265, isBest: false }] },
    { id: 'bi2', name: 'Mutton Biryani Full', quantity: '1', unit: 'serving', emoji: '🍖', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 340, originalPrice: 420, unitPrice: 340, isBest: false }, { name: 'DummyJSON', price: 305, originalPrice: 385, unitPrice: 305, isBest: true }, { name: 'FakeStore', price: 322, originalPrice: 402, unitPrice: 322, isBest: false }] },
    { id: 'bi3', name: 'Veg Biryani', quantity: '1', unit: 'serving', emoji: '🥗', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 180, originalPrice: 240, unitPrice: 180, isBest: false }, { name: 'DummyJSON', price: 158, originalPrice: 218, unitPrice: 158, isBest: true }, { name: 'FakeStore', price: 169, originalPrice: 229, unitPrice: 169, isBest: false }] },
    { id: 'bi4', name: 'Egg Biryani', quantity: '1', unit: 'serving', emoji: '🥚', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 220, originalPrice: 290, unitPrice: 220, isBest: false }, { name: 'DummyJSON', price: 195, originalPrice: 265, unitPrice: 195, isBest: true }, { name: 'FakeStore', price: 207, originalPrice: 277, unitPrice: 207, isBest: false }] },
  ],
  'street-food': [
    { id: 'sf1', name: 'Pani Puri 6pcs', quantity: '6', unit: 'pcs', emoji: '🫙', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 60, originalPrice: 85, unitPrice: 60, isBest: false }, { name: 'DummyJSON', price: 50, originalPrice: 75, unitPrice: 50, isBest: true }, { name: 'FakeStore', price: 55, originalPrice: 80, unitPrice: 55, isBest: false }] },
    { id: 'sf2', name: 'Vada Pav 2pcs', quantity: '2', unit: 'pcs', emoji: '🍔', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 55, originalPrice: 79, unitPrice: 55, isBest: false }, { name: 'DummyJSON', price: 45, originalPrice: 69, unitPrice: 45, isBest: true }, { name: 'FakeStore', price: 50, originalPrice: 74, unitPrice: 50, isBest: false }] },
    { id: 'sf3', name: 'Bhel Puri Large', quantity: '1', unit: 'serving', emoji: '🫘', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 80, originalPrice: 110, unitPrice: 80, isBest: false }, { name: 'DummyJSON', price: 68, originalPrice: 98, unitPrice: 68, isBest: true }, { name: 'FakeStore', price: 74, originalPrice: 104, unitPrice: 74, isBest: false }] },
    { id: 'sf4', name: 'Kathi Roll Chicken', quantity: '1', unit: 'pcs', emoji: '🌯', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 120, originalPrice: 160, unitPrice: 120, isBest: false }, { name: 'DummyJSON', price: 105, originalPrice: 145, unitPrice: 105, isBest: true }, { name: 'FakeStore', price: 112, originalPrice: 152, unitPrice: 112, isBest: false }] },
  ],
  'breakfast-meals': [
    { id: 'bm1', name: 'Poha with Chutney', quantity: '1', unit: 'serving', emoji: '🍚', image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 89, originalPrice: 120, unitPrice: 89, isBest: false }, { name: 'DummyJSON', price: 75, originalPrice: 106, unitPrice: 75, isBest: true }, { name: 'FakeStore', price: 82, originalPrice: 113, unitPrice: 82, isBest: false }] },
    { id: 'bm2', name: 'Aloo Paratha + Curd 2pcs', quantity: '2', unit: 'pcs', emoji: '🫓', image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 99, originalPrice: 135, unitPrice: 99, isBest: false }, { name: 'DummyJSON', price: 85, originalPrice: 121, unitPrice: 85, isBest: true }, { name: 'FakeStore', price: 92, originalPrice: 128, unitPrice: 92, isBest: false }] },
    { id: 'bm3', name: 'Upma Bowl', quantity: '1', unit: 'serving', emoji: '🥣', image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 79, originalPrice: 109, unitPrice: 79, isBest: false }, { name: 'DummyJSON', price: 68, originalPrice: 98, unitPrice: 68, isBest: true }, { name: 'FakeStore', price: 73, originalPrice: 103, unitPrice: 73, isBest: false }] },
    { id: 'bm4', name: 'Pancakes with Maple Syrup', quantity: '3', unit: 'pcs', emoji: '🥞', image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 149, originalPrice: 199, unitPrice: 149, isBest: false }, { name: 'DummyJSON', price: 129, originalPrice: 179, unitPrice: 129, isBest: true }, { name: 'FakeStore', price: 139, originalPrice: 189, unitPrice: 139, isBest: false }] },
    { id: 'bm5', name: 'Masala Omelette + Toast', quantity: '1', unit: 'serving', emoji: '🍳', image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 99, originalPrice: 139, unitPrice: 99, isBest: false }, { name: 'DummyJSON', price: 85, originalPrice: 125, unitPrice: 85, isBest: true }, { name: 'FakeStore', price: 92, originalPrice: 132, unitPrice: 92, isBest: false }] },
  ],
  'beverages-food': [
    { id: 'bvf1', name: 'Mango Lassi 400ml', quantity: '400', unit: 'ml', emoji: '🥭', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 99, originalPrice: 135, unitPrice: 24.75, isBest: false }, { name: 'DummyJSON', price: 85, originalPrice: 121, unitPrice: 21.25, isBest: true }, { name: 'FakeStore', price: 92, originalPrice: 128, unitPrice: 23.0, isBest: false }] },
    { id: 'bvf2', name: 'Cold Coffee with Ice Cream', quantity: '300', unit: 'ml', emoji: '☕', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 149, originalPrice: 199, unitPrice: 49.7, isBest: false }, { name: 'DummyJSON', price: 129, originalPrice: 179, unitPrice: 43.0, isBest: true }, { name: 'FakeStore', price: 139, originalPrice: 189, unitPrice: 46.3, isBest: false }] },
    { id: 'bvf3', name: 'Fresh Lime Soda', quantity: '350', unit: 'ml', emoji: '🍋', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 69, originalPrice: 99, unitPrice: 19.7, isBest: false }, { name: 'DummyJSON', price: 58, originalPrice: 88, unitPrice: 16.6, isBest: true }, { name: 'FakeStore', price: 63, originalPrice: 93, unitPrice: 18.0, isBest: false }] },
    { id: 'bvf4', name: 'Masala Chai 250ml', quantity: '250', unit: 'ml', emoji: '🍵', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 45, originalPrice: 65, unitPrice: 18.0, isBest: false }, { name: 'DummyJSON', price: 38, originalPrice: 58, unitPrice: 15.2, isBest: true }, { name: 'FakeStore', price: 41, originalPrice: 61, unitPrice: 16.4, isBest: false }] },
  ],
  continental: [
    { id: 'co1', name: 'Spaghetti Arrabbiata', quantity: '1', unit: 'serving', emoji: '🍝', image: 'https://images.unsplash.com/photo-1551183053-bf91798d4c44?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 249, originalPrice: 319, unitPrice: 249, isBest: false }, { name: 'DummyJSON', price: 219, originalPrice: 289, unitPrice: 219, isBest: true }, { name: 'FakeStore', price: 234, originalPrice: 304, unitPrice: 234, isBest: false }] },
    { id: 'co2', name: 'Grilled Veg Sandwich', quantity: '1', unit: 'pcs', emoji: '🥪', image: 'https://images.unsplash.com/photo-1551183053-bf91798d4c44?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 129, originalPrice: 169, unitPrice: 129, isBest: false }, { name: 'DummyJSON', price: 112, originalPrice: 152, unitPrice: 112, isBest: true }, { name: 'FakeStore', price: 120, originalPrice: 160, unitPrice: 120, isBest: false }] },
    { id: 'co3', name: 'Tomato Basil Soup 300ml', quantity: '300', unit: 'ml', emoji: '🍲', image: 'https://images.unsplash.com/photo-1551183053-bf91798d4c44?w=200&q=80', providers: [{ name: 'Open Food Facts', price: 149, originalPrice: 199, unitPrice: 49.7, isBest: false }, { name: 'DummyJSON', price: 129, originalPrice: 179, unitPrice: 43.0, isBest: true }, { name: 'FakeStore', price: 139, originalPrice: 189, unitPrice: 46.3, isBest: false }] },
  ],
}

// ===== COMPONENT =====
export default function SectionPage() {
  const router = useRouter()
  const { section } = router.query
  const config = sectionConfig[section] || sectionConfig['quick-commerce']
  const categories = allCategories[section] || allCategories['quick-commerce']

  // Backend section name mapping
  const sectionMap = {
    'quick-commerce': 'quick-commerce',
    'ecommerce': 'e-commerce',
    'food': 'food-meals',
  }

  // API state
  const [apiProducts, setApiProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [apiError, setApiError] = useState(null)

  // Existing state
  const [view, setView] = useState('categories')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [highlightedProductId, setHighlightedProductId] = useState(null)
  const [slideDirection, setSlideDirection] = useState('right')
  const [animating, setAnimating] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [yuktiTyping, setYuktiTyping] = useState(false)
  const [activeTab, setActiveTab] = useState('yukti')
  const [isMobile, setIsMobile] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartFlash, setCartFlash] = useState(false)
  const [cartSection, setCartSection] = useState('all') // 'all' | 'quick-commerce' | 'ecommerce' | 'food'

  // NEW — Toast
  const [toast, setToast] = useState({ show: false, text: '', emoji: '' })
  // NEW — Checkout flow
  const [checkoutStep, setCheckoutStep] = useState(null) // null | 'address' | 'payment' | 'success'
  const [paymentTab, setPaymentTab] = useState('upi')
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [addressForm, setAddressForm] = useState({ name: '', phone: '', address: '', pincode: '', city: '' })
  const [paymentForm, setPaymentForm] = useState({ upiId: '', cardNumber: '', cardExpiry: '', cardCvv: '', cardName: '', bank: '' })
  const [orderResult, setOrderResult] = useState(null)
  const [formErrors, setFormErrors] = useState({})

  // NEW — Multi-item split view
  const [multiItems, setMultiItems] = useState([]) // [{category, product}]
  const [multiIndex, setMultiIndex] = useState(0)  // current pair: 0=items 0-1, 1=items 2-3
  const [multiSliding, setMultiSliding] = useState(null) // 'left' | 'right' | null

  // NEW — Barcode scanner
  const [scannerOpen, setScannerOpen] = useState(false)
  const [scanPhase, setScanPhase] = useState('camera') // 'camera' | 'scanning' | 'found'
  const [scannedProduct, setScannedProduct] = useState(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const leftPanelRef = useRef(null)
  const chatEndRef = useRef(null)

  // Zustand
  const { items: cartItems, addItem, removeItem, updateQty, clearCart, getSubtotal, getTotal, getSavings, getSmartSavings, getItemCount, setAddress, completeOrder, lastOrder, hydrate: hydrateCart } = useCartStore()
  const { user, isLoggedIn, hydrate: hydrateAuth } = useAuthStore()
  const itemCount = getItemCount()

  // Cart section filtering
  const filteredCartItems = cartSection === 'all' ? cartItems : cartItems.filter(item => item.section === cartSection)
  const sectionCounts = {
    'quick-commerce': cartItems.filter(i => i.section === 'quick-commerce').length,
    'ecommerce': cartItems.filter(i => i.section === 'ecommerce').length,
    'food': cartItems.filter(i => i.section === 'food').length,
  }

  // Store optimizer — finds cheapest single store for all items
  const getStoreOptimizer = () => {
    if (cartItems.length < 1) return null
    const itemsWithAllPrices = cartItems.map(item => {
      for (const [catId, prods] of Object.entries(allProducts)) {
        const product = prods.find(p => p.id === item.productId)
        if (product) return { ...item, allProviders: product.providers }
      }
      return { ...item, allProviders: [{ name: item.provider, price: item.price }] }
    })
    const stores = ['Open Food Facts', 'DummyJSON', 'FakeStore']
    const storeTotals = stores.map(store => {
      let total = 0; let originalTotal = 0; let possible = true
      const breakdown = []
      itemsWithAllPrices.forEach(item => {
        const p = item.allProviders.find(pr => pr.name === store)
        if (p) {
          total += p.price * item.qty
          originalTotal += p.originalPrice * item.qty
          breakdown.push({ name: item.name, emoji: item.emoji, price: p.price, originalPrice: p.originalPrice, qty: item.qty, isBest: p.isBest })
        } else { possible = false }
      })
      return { store, total, originalTotal, possible, breakdown, savings: originalTotal - total }
    }).filter(s => s.possible).sort((a, b) => a.total - b.total)
    if (storeTotals.length === 0) return null
    const cheapest = storeTotals[0]
    const mostExpensive = storeTotals[storeTotals.length - 1]
    return { storeTotals, cheapest, mostExpensive, savingsVsWorst: mostExpensive.total - cheapest.total, itemsWithAllPrices }
  }

  useEffect(() => { if (section && sectionConfig[section]) setMessages([{ role: 'yukti', text: sectionConfig[section].yuktiGreeting }]) }, [section])
  useEffect(() => { hydrateAuth(); if (hydrateCart) hydrateCart() }, [])
  useEffect(() => { const check = () => setIsMobile(window.innerWidth < 768); check(); window.addEventListener('resize', check); return () => window.removeEventListener('resize', check) }, [])
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, yuktiTyping])

  const delay = (ms) => new Promise(r => setTimeout(r, ms))

  // Toast helper
  const showToast = (text, emoji = '✓') => {
    setToast({ show: true, text, emoji })
    setTimeout(() => setToast({ show: false, text: '', emoji: '' }), 2500)
  }

  const playSound = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const o = ctx.createOscillator(); const g = ctx.createGain()
      o.connect(g); g.connect(ctx.destination)
      if (type === 'click') { o.frequency.value = 600; g.gain.setValueAtTime(0.1, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1); o.start(); o.stop(ctx.currentTime + 0.1) }
      else if (type === 'navigate') { o.frequency.setValueAtTime(400, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(620, ctx.currentTime + 0.15); g.gain.setValueAtTime(0.08, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2); o.start(); o.stop(ctx.currentTime + 0.2) }
      else if (type === 'yukti') { o.type = 'sine'; o.frequency.setValueAtTime(520, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.12); g.gain.setValueAtTime(0.06, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25); o.start(); o.stop(ctx.currentTime + 0.25) }
      else if (type === 'cart') { o.type = 'sine'; o.frequency.setValueAtTime(880, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.08); g.gain.setValueAtTime(0.07, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15); o.start(); o.stop(ctx.currentTime + 0.15) }
      else if (type === 'success') { o.type = 'sine'; o.frequency.setValueAtTime(523, ctx.currentTime); o.frequency.setValueAtTime(659, ctx.currentTime + 0.1); o.frequency.setValueAtTime(784, ctx.currentTime + 0.2); g.gain.setValueAtTime(0.08, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4); o.start(); o.stop(ctx.currentTime + 0.4) }
    } catch (e) {}
  }

  const handleAddToCart = (product, provider) => {
    playSound('cart')
    addItem(product, provider, section)
    setCartFlash(true)
    setTimeout(() => setCartFlash(false), 600)
    showToast(`${product.emoji} ${product.name} added!`, '🛒')
  }

  const handleStartCheckout = () => {
    playSound('click')
    setCartOpen(false)
    setCheckoutStep('address')
  }

  const handleAddressSubmit = () => {
    const errors = {}
    const name = addressForm.name.trim()
    const phone = addressForm.phone.trim().replace(/\s+/g, '')
    const addr = addressForm.address.trim()
    const pin = addressForm.pincode.trim()
    const city = addressForm.city.trim()

    if (!name || name.length < 3 || !/^[a-zA-Z\s]+$/.test(name)) errors.name = 'Enter full name (letters only, min 3 chars)'
    if (name && name.split(' ').filter(w => w.length > 0).length < 2) errors.name = 'Enter first and last name'
    if (!/^(\+91)?[6-9]\d{9}$/.test(phone)) errors.phone = 'Enter valid 10-digit Indian number'
    if (!addr || addr.length < 10) errors.address = 'Enter full address (min 10 characters)'
    if (!/^\d{6}$/.test(pin)) errors.pincode = 'Enter valid 6-digit pincode'
    if (!city || city.length < 2 || !/^[a-zA-Z\s]+$/.test(city)) errors.city = 'Enter valid city name'

    setFormErrors(errors)
    if (Object.keys(errors).length > 0) { showToast('Please fix the errors below', '⚠️'); return }
    playSound('click')
    setAddress(addressForm)
    setCheckoutStep('payment')
    setFormErrors({})
  }

  const handlePaymentSubmit = async () => {
    const errors = {}
    if (paymentTab === 'upi') {
      const upi = paymentForm.upiId.trim()
      if (!upi || !upi.includes('@') || upi.length < 5) errors.upiId = 'Enter valid UPI ID (e.g. name@upi)'
    }
    if (paymentTab === 'card') {
      if (!/^\d{16}$/.test(paymentForm.cardNumber)) errors.cardNumber = 'Enter valid 16-digit card number'
      if (!paymentForm.cardName || paymentForm.cardName.trim().length < 3 || !/^[a-zA-Z\s]+$/.test(paymentForm.cardName.trim())) errors.cardName = 'Enter cardholder name'
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentForm.cardExpiry)) errors.cardExpiry = 'Use MM/YY format'
      if (!/^\d{3}$/.test(paymentForm.cardCvv)) errors.cardCvv = '3 digits'
    }
    if (paymentTab === 'netbanking') {
      if (!paymentForm.bank) errors.bank = 'Select a bank'
    }

    setFormErrors(errors)
    if (Object.keys(errors).length > 0) { showToast('Please fix the errors', '⚠️'); return }
    setPaymentProcessing(true)
    await delay(2500)
    const method = paymentTab === 'upi' ? `UPI (${paymentForm.upiId})` : paymentTab === 'card' ? `Card ****${paymentForm.cardNumber.slice(-4)}` : `Net Banking (${paymentForm.bank})`
    const order = completeOrder(method)
    setOrderResult(order)
    setPaymentProcessing(false)
    setCheckoutStep('success')
    setFormErrors({})
    playSound('success')
  }

  const handleCloseCheckout = () => {
    setCheckoutStep(null)
    setOrderResult(null)
    setPaymentForm({ upiId: '', cardNumber: '', cardExpiry: '', cardCvv: '', cardName: '', bank: '' })
    setAddressForm({ name: '', phone: '', address: '', pincode: '', city: '' })
  }

  const navigate = (newView, direction = 'right', category = null, product = null) => {
    return new Promise((resolve) => {
      if (animating) { resolve(); return }
      setAnimating(true); setSlideDirection(direction)
      setTimeout(() => {
        setView(newView)
        if (category !== null) setSelectedCategory(category)
        if (product !== null) setSelectedProduct(product)
        setAnimating(false)
        if (leftPanelRef.current) leftPanelRef.current.scrollTop = 0
        if (isMobile) setActiveTab('browse')
        resolve()
      }, 400)
    })
  }

  const fetchCategoryProducts = async (cat) => {
    setLoadingProducts(true)
    setApiError(null)
    setApiProducts([])
    try {
      const backendSection = sectionMap[section] || 'e-commerce'
      const res = await fetch(`http://localhost:8000/api/products/${cat.id}?section=${backendSection}`)
      const data = await res.json()
      const normalized = (data.products || []).map((p, idx) => ({
        id: p.id || `api_${idx}`,
        name: p.name,
        emoji: cat.emoji || '📦',
        image: p.image || cat.image,
        quantity: '1',
        unit: 'unit',
        providers: p.prices && p.prices.length > 0
          ? p.prices.map((pr, i) => ({
              name: pr.provider,
              price: Math.round(pr.price),
              originalPrice: Math.round(pr.price * 1.15),
              unitPrice: pr.price,
              isBest: i === 0,
            }))
          : [{ name: p.provider || 'Store', price: Math.round(p.price || 99), originalPrice: Math.round((p.price || 99) * 1.15), unitPrice: p.price || 99, isBest: true }]
      }))
      setApiProducts(normalized)
    } catch (e) {
      setApiError('Could not load products. Is the backend running?')
      // Fall back to hardcoded data
      setApiProducts(allProducts[cat.id] || [])
    }
    setLoadingProducts(false)
  }

  const handleCategoryClick = (cat) => {
    playSound('navigate')
    fetchCategoryProducts(cat)
    navigate('products', 'right', cat)
  }
  const handleProductClick = async (product) => { playSound('click'); setHighlightedProductId(product.id); await delay(500); await navigate('comparison', 'right', selectedCategory, product); setHighlightedProductId(null) }
  const handleBack = () => { playSound('navigate'); if (view === 'multi') { setMultiItems([]); setMultiIndex(0); setView('categories') } else if (view === 'comparison') navigate('products', 'left'); else if (view === 'products') navigate('categories', 'left') }

  const yuktiNavigate = async (match) => {
    const cat = categories.find(c => c.id === match.categoryId); if (!cat) return
    if (match.productName && allProducts[match.categoryId]) {
      const product = allProducts[match.categoryId].find(p => p.name.toLowerCase().includes(match.productName.toLowerCase()))
      if (product) { await delay(700); await navigate('products', 'right', cat); await delay(1000); setHighlightedProductId(product.id); if (leftPanelRef.current) leftPanelRef.current.scrollTo({ top: 150, behavior: 'smooth' }); await delay(1000); await navigate('comparison', 'right', cat, product); setHighlightedProductId(null); return }
    }
    await delay(700); await navigate('products', 'right', cat)
  }

  const yuktiRespond = async (userMsg) => {
    setYuktiTyping(true)
    await delay(400)
    const lower = userMsg.toLowerCase()
    const keywords = config.keywords

    // Step 1 — keyword matching first (fast, free)
    const allMatches = []
    const usedCategories = new Set()
    for (const [key, val] of Object.entries(keywords)) {
      if (lower.includes(key) && !usedCategories.has(val.categoryId + (val.productName || ''))) {
        const cat = categories.find(c => c.id === val.categoryId)
        let product = null
        if (val.productName && allProducts[val.categoryId]) {
          product = allProducts[val.categoryId].find(p => p.name.toLowerCase().includes(val.productName.toLowerCase()))
        }
        if (!product && allProducts[val.categoryId]?.length > 0) {
          product = allProducts[val.categoryId][0]
        }
        if (cat && product) {
          allMatches.push({ key, category: cat, product, response: val.response })
          usedCategories.add(val.categoryId + (val.productName || ''))
        }
      }
    }

    if (allMatches.length >= 2) {
      const names = allMatches.map(m => m.product.emoji + ' ' + m.product.name)
      const response = `🔍 Found ${allMatches.length} items! Comparing side by side:\n${names.join(', ')}\n\nSwipe through to see all comparisons →`
      setMessages(prev => [...prev, { role: 'yukti', text: response }])
      setYuktiTyping(false); playSound('yukti')
      await delay(500)
      setMultiItems(allMatches.map(m => ({ category: m.category, product: m.product })))
      setMultiIndex(0); setView('multi')
      if (isMobile) setActiveTab('browse')
      if (leftPanelRef.current) leftPanelRef.current.scrollTop = 0
      return
    }

    if (allMatches.length === 1) {
      const matched = Object.entries(keywords).find(([key]) => lower.includes(key))
      const response = matched ? matched[1].response : ''
      setMessages(prev => [...prev, { role: 'yukti', text: response || `I can help you find the best prices in ${config.title}! 🔍` }])
      setYuktiTyping(false); playSound('yukti')
      if (matched) await yuktiNavigate(matched[1])
      return
    }

    // Step 2 — call Claude AI when no keyword matches
    try {
      const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_KEY
      console.log('Yukti AI: key loaded?', !!apiKey, 'starts with:', apiKey?.slice(0, 15))

      if (!apiKey) {
        setMessages(prev => [...prev, { role: 'yukti', text: `API key not found — check your .env.local file has NEXT_PUBLIC_ANTHROPIC_KEY set and restart the dev server. 🔧` }])
        setYuktiTyping(false)
        return
      }

      const categoryList = categories.map(c => `${c.id}: ${c.name}`).join(', ')
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 300,
          system: `You are Yukti, a friendly AI price comparison assistant for Pramā — an Indian price comparison app.
You are currently in the "${config.title}" section.
Available categories: ${categoryList}

When a user asks about a product or item:
1. Give a short helpful response (1-2 sentences max) with a relevant emoji
2. On the very last line, output ONLY a JSON object like: {"navigate": "category-id"}
   Use the exact category id from the list above that best matches what they want.
   If no category fits, use {"navigate": null}

Keep responses warm, concise and Indian-context aware.`,
          messages: [{ role: 'user', content: userMsg }],
        }),
      })

      console.log('Anthropic status:', res.status)
      const data = await res.json()
      console.log('Anthropic data:', JSON.stringify(data).slice(0, 200))

      if (!res.ok) {
        console.error('Anthropic error:', data)
        setMessages(prev => [...prev, { role: 'yukti', text: `Hmm, I had trouble connecting. Try again in a moment! 🔄` }])
        setYuktiTyping(false)
        playSound('yukti')
        return
      }

      const fullText = data.content?.[0]?.text || ''

      // Extract navigation from last line
      let replyText = fullText.trim()
      let navigateTo = null
      const lines = fullText.trim().split('\n')
      const lastLine = lines[lines.length - 1].trim()
      try {
        const parsed = JSON.parse(lastLine)
        if (parsed.navigate !== undefined) {
          navigateTo = parsed.navigate
          replyText = lines.slice(0, -1).join('\n').trim()
        }
      } catch {}

      setMessages(prev => [...prev, { role: 'yukti', text: replyText }])
      setYuktiTyping(false)
      playSound('yukti')

      if (navigateTo) {
        const cat = categories.find(c => c.id === navigateTo)
        if (cat) {
          await delay(600)
          fetchCategoryProducts(cat)
          await navigate('products', 'right', cat)
        }
      }
    } catch (e) {
      console.error('Yukti catch error:', e)
      setMessages(prev => [...prev, { role: 'yukti', text: `I can help you find the best prices in ${config.title}! Try asking about specific items — I'll compare prices instantly. 🔍` }])
      setYuktiTyping(false)
      playSound('yukti')
    }
  }

  // Multi-view slide navigation
  const handleMultiNext = () => {
    if (multiIndex >= Math.ceil(multiItems.length / 2) - 1) return
    playSound('navigate')
    setMultiSliding('left')
    setTimeout(() => { setMultiIndex(prev => prev + 1); setMultiSliding(null) }, 350)
  }
  const handleMultiPrev = () => {
    if (multiIndex <= 0) return
    playSound('navigate')
    setMultiSliding('right')
    setTimeout(() => { setMultiIndex(prev => prev - 1); setMultiSliding(null) }, 350)
  }
  const handleExitMulti = () => {
    playSound('navigate')
    setMultiItems([]); setMultiIndex(0); setView('categories')
  }

  // Barcode Scanner
  const openScanner = async () => {
    setScannerOpen(true); setScanPhase('camera'); setScannedProduct(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream }, 100)
    } catch (err) {
      // Camera denied — still show UI, just simulate
      console.log('Camera access denied, simulating scan')
    }
  }
  const closeScanner = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
    setScannerOpen(false); setScanPhase('camera'); setScannedProduct(null)
  }
  const simulateScan = async () => {
    playSound('click'); setScanPhase('scanning')
    await delay(2000) // Scanning animation
    // Pick a random product from current section
    const catKeys = Object.keys(allProducts).filter(k => {
      const sectionCats = (allCategories[section] || []).map(c => c.id)
      return sectionCats.includes(k) && allProducts[k].length > 0
    })
    const randomCat = catKeys[Math.floor(Math.random() * catKeys.length)]
    const prods = allProducts[randomCat] || []
    const randomProduct = prods[Math.floor(Math.random() * prods.length)]
    const cat = (allCategories[section] || []).find(c => c.id === randomCat)
    if (randomProduct && cat) {
      setScannedProduct({ product: randomProduct, category: cat })
      setScanPhase('found')
      playSound('success')
    }
  }
  const handleScanNavigate = async () => {
    if (!scannedProduct) return
    closeScanner()
    setMessages(prev => [...prev,
      { role: 'user', text: `🔍 Scanned: ${scannedProduct.product.name}` },
      { role: 'yukti', text: `📸 Barcode detected! Found ${scannedProduct.product.emoji} ${scannedProduct.product.name} in ${scannedProduct.category.name}. Showing price comparison across all stores...` }
    ])
    playSound('yukti')
    await delay(500)
    await navigate('comparison', 'right', scannedProduct.category, scannedProduct.product)
    if (isMobile) setActiveTab('browse')
  }

  const handleSend = async () => { if (!input.trim()) return; playSound('click'); const msg = input.trim(); setInput(''); setMessages(prev => [...prev, { role: 'user', text: msg }]); await yuktiRespond(msg) }
  const handleSuggestion = async (s) => { playSound('click'); setMessages(prev => [...prev, { role: 'user', text: s.text || s }]); await yuktiRespond(s.query || s.text || s) }

  const slideStyle = { transform: animating ? `translateX(${slideDirection === 'right' ? '-40px' : '40px'})` : 'translateX(0)', opacity: animating ? 0 : 1, transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }
  const yuktiWidth = isMobile ? '100%' : '40%'
  const browseWidth = isMobile ? '100%' : '60%'
  const products = apiProducts.length > 0
    ? apiProducts
    : (selectedCategory ? (allProducts[selectedCategory.id] || []) : [])

  // Shared input style
  // Product ratings — deterministic from product ID so they never change
  const getProductRating = (productId) => {
    let hash = 0
    for (let i = 0; i < productId.length; i++) hash = ((hash << 5) - hash) + productId.charCodeAt(i)
    const rating = 3.5 + (Math.abs(hash % 15) / 10) // 3.5 to 4.9
    const reviews = 100 + Math.abs(hash % 4900) // 100 to 4999
    return { rating: Math.round(rating * 10) / 10, reviews }
  }
  const StarRating = ({ rating, reviews, size = 10 }) => {
    const full = Math.floor(rating)
    const hasHalf = rating - full >= 0.3
    const empty = 5 - full - (hasHalf ? 1 : 0)
    const fmt = reviews >= 1000 ? `${(reviews / 1000).toFixed(1)}k` : reviews
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div style={{ display: 'flex', gap: '1px' }}>
          {Array(full).fill(0).map((_, i) => <span key={'f'+i} style={{ color: '#FFD700', fontSize: `${size}px`, lineHeight: 1 }}>★</span>)}
          {hasHalf && <span style={{ color: '#FFD700', fontSize: `${size}px`, lineHeight: 1, opacity: 0.5 }}>★</span>}
          {Array(empty).fill(0).map((_, i) => <span key={'e'+i} style={{ color: '#3A3020', fontSize: `${size}px`, lineHeight: 1 }}>★</span>)}
        </div>
        <span style={{ fontSize: `${size - 1}px`, color: '#8A7A5A', fontWeight: '500' }}>{rating}</span>
        <span style={{ fontSize: `${size - 2}px`, color: '#5A4A2A' }}>({fmt})</span>
      </div>
    )
  }

  const inputStyle = { width: '100%', backgroundColor: '#1A1610', border: '1px solid #2A2810', borderRadius: '8px', padding: '10px 12px', color: '#E8DDB8', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }
  const inputErrorStyle = (field) => ({ ...inputStyle, border: formErrors[field] ? '1px solid #F4433680' : '1px solid #2A2810' })
  const FieldError = ({ field }) => formErrors[field] ? <div style={{ fontSize: '10px', color: '#F44336', marginTop: '3px' }}>{formErrors[field]}</div> : null

  return (
    <div style={{ height: '100vh', backgroundColor: '#080806', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 24px', borderBottom: '1px solid #1E1C10', backgroundColor: '#080806', flexShrink: 0, zIndex: 100 }}>
        <div onClick={() => router.push('/')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #2E7D32, #66BB6A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '800', color: '#fff' }}>P</div>
          <span style={{ fontSize: '19px', fontWeight: '700', color: '#F0EDE8', letterSpacing: '-0.5px' }}>Pram<span style={{ color: '#4CAF50' }}>ā</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#FFD700', fontWeight: '600' }}>{config.title}</span>
          {view !== 'categories' && <button onClick={handleBack} style={{ background: 'transparent', border: '1px solid #2A2810', color: '#9E9E9E', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#4CAF50'; e.currentTarget.style.color = '#F0EDE8' }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2810'; e.currentTarget.style.color = '#9E9E9E' }}>{view === 'multi' ? '✕ Exit Compare' : '← Back'}</button>}
          {isLoggedIn && <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#fff', border: '1px solid #4CAF5040' }} title={user?.name}>{user?.name?.charAt(0).toUpperCase()}</div>}
          <button onClick={() => { playSound('click'); setCartOpen(true) }} style={{ position: 'relative', background: 'transparent', border: `1px solid ${cartFlash ? '#4CAF50' : '#2A2810'}`, color: cartFlash ? '#4CAF50' : '#9E9E9E', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', transition: 'all 0.3s ease', transform: cartFlash ? 'scale(1.15)' : 'scale(1)' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#4CAF50'; e.currentTarget.style.color = '#F0EDE8' }} onMouseLeave={e => { if (!cartFlash) { e.currentTarget.style.borderColor = '#2A2810'; e.currentTarget.style.color = '#9E9E9E' } }}>
            🛒
            {itemCount > 0 && <span style={{ position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#4CAF50', color: '#fff', fontSize: '10px', fontWeight: '700', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #080806' }}>{itemCount > 9 ? '9+' : itemCount}</span>}
          </button>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* LEFT — YUKTI */}
        <div style={{ width: yuktiWidth, flexShrink: 0, backgroundColor: '#0C0A06', display: isMobile && activeTab !== 'yukti' ? 'none' : 'flex', flexDirection: 'column', borderRight: '1px solid #1E1C10', overflow: 'hidden' }}>
          <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid #2A2810', background: 'linear-gradient(180deg, #141008 0%, #0C0A06 100%)', flexShrink: 0, textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #1B5E20, #2E7D32, #43A047)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 4px 20px rgba(46,125,50,0.3)', fontSize: '24px', fontWeight: '800', color: '#fff', border: '1.5px solid #4CAF5050' }}>₹</div>
            <div style={{ fontSize: '17px', fontWeight: '700', color: '#F0EDE8', marginBottom: '2px' }}>Yukti</div>
            <div style={{ fontSize: '11px', color: '#4CAF50', marginBottom: '14px' }}>● Pramā's price intelligence AI</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
              {config.prompts.map((prompt, i) => (<div key={i} onClick={() => handleSuggestion({ text: prompt.text, query: prompt.text })} style={{ backgroundColor: '#1A1610', border: '1px solid #2A2810', borderRadius: '10px', padding: '9px 12px', fontSize: '12px', color: '#C8B88A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.15s ease' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#4CAF50'; e.currentTarget.style.backgroundColor = '#221E14'; e.currentTarget.style.color = '#F0EDE8' }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2810'; e.currentTarget.style.backgroundColor = '#1A1610'; e.currentTarget.style.color = '#C8B88A' }}><span style={{ fontSize: '14px', flexShrink: 0 }}>{prompt.icon}</span><span style={{ lineHeight: '1.4' }}>{prompt.text}</span></div>))}
            </div>
          </div>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #2A2810', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0, backgroundColor: '#0A0806' }}>
            {config.suggestions.map((s, i) => (<div key={i} onClick={() => handleSuggestion(s)} style={{ flexShrink: 0, backgroundColor: '#1A1610', border: '1px solid #2A2810', borderRadius: '12px', padding: '8px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', width: '80px', transition: 'all 0.15s ease' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#4CAF50'; e.currentTarget.style.backgroundColor = '#221E14' }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2810'; e.currentTarget.style.backgroundColor = '#1A1610' }}><div style={{ width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #2A2810' }}><img src={s.image} alt={s.text} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div><span style={{ fontSize: '10px', color: '#C8B88A', textAlign: 'center', lineHeight: '1.3', fontWeight: '500' }}>{s.text}</span></div>))}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#0C0A06' }}>
            {messages.map((msg, i) => (<div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '8px' }}>
              {msg.role === 'yukti' && <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#fff', fontWeight: '800', flexShrink: 0 }}>₹</div>}
              <div style={{ maxWidth: '80%', backgroundColor: msg.role === 'user' ? '#1A3A1A' : '#1E1C10', border: `1px solid ${msg.role === 'user' ? '#2E7D32' : '#E8DDB820'}`, borderRadius: msg.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px', padding: '10px 13px', fontSize: '13px', color: msg.role === 'user' ? '#C8E6C9' : '#E8DDB8', lineHeight: '1.6' }}>{msg.role === 'yukti' && <div style={{ fontSize: '9px', color: '#4CAF50', fontWeight: '700', marginBottom: '4px', letterSpacing: '1px' }}>YUKTI</div>}{msg.text}</div>
            </div>))}
            {yuktiTyping && <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}><div style={{ width: '26px', height: '26px', borderRadius: '7px', background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#fff', fontWeight: '800', flexShrink: 0 }}>₹</div><div style={{ backgroundColor: '#1E1C10', border: '1px solid #E8DDB820', borderRadius: '14px 14px 14px 2px', padding: '12px 16px', display: 'flex', gap: '5px', alignItems: 'center' }}>{[0, 1, 2].map(j => <div key={j} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4CAF50', animation: `pulse 1.2s ease-in-out ${j * 0.2}s infinite` }} />)}</div></div>}
            <div ref={chatEndRef} />
          </div>
          <div style={{ padding: '12px 14px', borderTop: '1px solid #2A2810', display: 'flex', gap: '8px', backgroundColor: '#0A0806', flexShrink: 0 }}>
            <button onClick={openScanner} title="Scan barcode" style={{ backgroundColor: '#1A1610', border: '1px solid #2A2810', color: '#8A7A5A', width: '42px', height: '42px', borderRadius: '10px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#4CAF50'; e.currentTarget.style.color = '#4CAF50' }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2810'; e.currentTarget.style.color = '#8A7A5A' }}>📷</button>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder={section === 'food' ? 'What are you craving? Ask Yukti...' : section === 'ecommerce' ? 'Find a product, compare prices...' : 'Find cheapest groceries...'} style={{ flex: 1, backgroundColor: '#1A1610', border: '1px solid #2A2810', borderRadius: '10px', padding: '10px 14px', color: '#E8DDB8', fontSize: '13px', outline: 'none' }} onFocus={e => e.target.style.borderColor = '#4CAF50'} onBlur={e => e.target.style.borderColor = '#2A2810'} />
            <button onClick={handleSend} style={{ backgroundColor: '#2E7D32', border: 'none', color: '#fff', width: '42px', height: '42px', borderRadius: '10px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#388E3C'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2E7D32'}>→</button>
          </div>
        </div>

        {/* RIGHT — BROWSE */}
        <div ref={leftPanelRef} style={{ width: browseWidth, overflowY: 'auto', borderLeft: '1px solid #1E1C10', display: isMobile && activeTab !== 'browse' ? 'none' : 'block', flexShrink: 0, backgroundColor: '#080806' }}>
          <div style={{ padding: '16px', ...slideStyle }}>
            {view === 'categories' && (<div>
              <div style={{ background: 'linear-gradient(135deg, #1C1A0E, #111008)', border: '1px solid #E8DDB820', borderRadius: '14px', padding: '14px 18px', marginBottom: '12px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #FFD700, #4CAF50, #E8DDB8)' }} />
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#F0EDE8', marginBottom: '3px' }}>{config.title}</h2>
                <p style={{ fontSize: '11px', color: '#8A7A5A' }}>Browse manually or let Yukti find the best deal →</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}><span style={{ fontSize: '11px', color: '#4CAF50' }}>● {categories.length} categories</span><span style={{ fontSize: '11px', color: '#FFD700' }}>● Offers live</span></div>
              </div>
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '12px', scrollbarWidth: 'none' }}>
                {[{ label: 'Top offers', icon: '⭐', color: '#FFD700' }, { label: 'Flash deals!', icon: '🔥', color: '#FF6B35' }, { label: 'Save 15%', icon: '💥', color: '#4CAF50' }].map((o, i) => (<div key={i} style={{ flexShrink: 0, backgroundColor: '#1A1810', border: '1px solid #E8DDB815', borderRadius: '20px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ fontSize: '11px' }}>{o.icon}</span><span style={{ fontSize: '10px', fontWeight: '600', color: o.color, whiteSpace: 'nowrap' }}>{o.label}</span></div>))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '0 2px' }}><span style={{ fontSize: '10px', color: '#5A4A2A', letterSpacing: '1px', textTransform: 'uppercase' }}>Categories</span><span style={{ fontSize: '10px', color: '#FFD700' }}>{categories.length} total</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {categories.map(cat => (<div key={cat.id} onClick={() => handleCategoryClick(cat)} style={{ backgroundColor: '#111008', border: '1px solid #2A2810', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#4CAF50'; e.currentTarget.style.backgroundColor = '#1A1608'; e.currentTarget.style.transform = 'translateX(3px)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2810'; e.currentTarget.style.backgroundColor = '#111008'; e.currentTarget.style.transform = 'translateX(0)' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid #2A2810' }}><img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:22px;background:#1A1608">${cat.emoji}</div>` }} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}><span style={{ fontSize: '13px', fontWeight: '600', color: '#F0EDE8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.name}</span><span style={{ fontSize: '8px', fontWeight: '700', padding: '1px 4px', borderRadius: '3px', backgroundColor: cat.tagBg, color: cat.tagColor, flexShrink: 0 }}>{cat.tag}</span></div>
                    <div style={{ fontSize: '10px', color: '#6A5A3A', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.description}</div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}><span style={{ fontSize: '10px', color: '#4CAF50' }}>{cat.count} items</span>{cat.discount && <span style={{ fontSize: '9px', fontWeight: '700', backgroundColor: '#FFD700', color: '#080806', padding: '1px 5px', borderRadius: '3px' }}>{cat.discount}</span>}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#5A4A2A', flexShrink: 0 }}>→</div>
                </div>))}
              </div>
            </div>)}

            {view === 'products' && selectedCategory && (<div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><span style={{ fontSize: '24px' }}>{selectedCategory.emoji}</span><div><h2 style={{ fontSize: '18px', fontWeight: '700', color: '#F0EDE8', marginBottom: '1px' }}>{selectedCategory.name}</h2><p style={{ fontSize: '10px', color: '#8A7A5A' }}>{loadingProducts ? 'Loading...' : `${products.length} items • tap Compare to see prices`}</p></div></div>
              {loadingProducts ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#5A4A2A' }}>
                  <div style={{ width: '32px', height: '32px', border: '3px solid #2A2810', borderTopColor: '#4CAF50', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                  <div style={{ fontSize: '13px', color: '#8A7A5A' }}>Fetching from all stores...</div>
                </div>
              ) : apiError ? (
                <div style={{ textAlign: 'center', padding: '30px 20px', color: '#F44336', backgroundColor: '#1F0000', border: '1px solid #F4433630', borderRadius: '10px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
                  <div style={{ fontSize: '13px', marginBottom: '4px' }}>{apiError}</div>
                  <div style={{ fontSize: '11px', color: '#8A7A5A' }}>Showing cached data instead</div>
                </div>
              ) : products.length === 0 ? <div style={{ textAlign: 'center', padding: '40px 20px', color: '#5A4A2A' }}><div style={{ fontSize: '40px', marginBottom: '10px' }}>🛒</div><div style={{ fontSize: '13px' }}>Ask Yukti to find items here!</div></div> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {products.map(product => {
                    const bestPrice = Math.min(...product.providers.map(p => p.price)); const isHighlighted = highlightedProductId === product.id
                    return (<div key={product.id} style={{ backgroundColor: isHighlighted ? '#0A1F0A' : '#111008', border: `1.5px solid ${isHighlighted ? '#4CAF50' : '#2A2810'}`, borderRadius: '10px', padding: '11px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.3s ease', transform: isHighlighted ? 'scale(1.02)' : 'scale(1)', boxShadow: isHighlighted ? '0 0 0 2px #4CAF5040' : 'none' }} onMouseEnter={e => { if (!isHighlighted) { e.currentTarget.style.borderColor = '#4CAF50'; e.currentTarget.style.backgroundColor = '#1A1608' } }} onMouseLeave={e => { if (!isHighlighted) { e.currentTarget.style.borderColor = '#2A2810'; e.currentTarget.style.backgroundColor = '#111008' } }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid #2A2810', backgroundColor: '#1A1608' }}><img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:22px">${product.emoji}</div>` }} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: '13px', fontWeight: '600', color: '#F0EDE8', marginBottom: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div><div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}><span style={{ fontSize: '10px', color: '#6A5A3A' }}>{product.quantity} {product.unit}</span><StarRating {...getProductRating(product.id)} size={9} /></div><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ fontSize: '15px', fontWeight: '700', color: '#F0EDE8' }}>₹{bestPrice}</span><span style={{ fontSize: '10px', color: '#4CAF50' }}>best price</span></div></div>
                      <button onClick={e => { e.stopPropagation(); handleProductClick(product) }} style={{ backgroundColor: isHighlighted ? '#2E7D32' : '#141208', border: '1px solid #4CAF50', color: isHighlighted ? '#fff' : '#4CAF50', padding: '6px 10px', borderRadius: '7px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2E7D32'; e.currentTarget.style.color = '#fff' }} onMouseLeave={e => { if (!isHighlighted) { e.currentTarget.style.backgroundColor = '#141208'; e.currentTarget.style.color = '#4CAF50' } }}>Compare →</button>
                    </div>)
                  })}
                </div>
              )}
            </div>)}

            {view === 'comparison' && selectedProduct && (<div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><span style={{ fontSize: '24px' }}>{selectedProduct.emoji}</span><div><h2 style={{ fontSize: '16px', fontWeight: '700', color: '#F0EDE8', marginBottom: '2px' }}>{selectedProduct.name}</h2><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><StarRating {...getProductRating(selectedProduct.id)} size={11} /><span style={{ fontSize: '10px', color: '#5A4A2A' }}>•</span><span style={{ fontSize: '10px', color: '#8A7A5A' }}>{selectedProduct.quantity} {selectedProduct.unit}</span></div></div></div>
              <div style={{ backgroundColor: '#1C1A0E', border: '1px solid #E8DDB820', borderRadius: '8px', padding: '8px 12px', marginBottom: '12px', fontSize: '11px', color: '#C8B88A' }}>💡 Sorted cheapest first — green = best value</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[...selectedProduct.providers].sort((a, b) => a.unitPrice - b.unitPrice).map((provider, i) => (
                  <div key={i} style={{ backgroundColor: provider.isBest ? '#0A1F0A' : '#111008', border: `1.5px solid ${provider.isBest ? '#4CAF50' : '#2A2810'}`, borderRadius: '12px', padding: '14px', position: 'relative' }}>
                    {provider.isBest && <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#4CAF50', color: '#fff', fontSize: '9px', fontWeight: '700', padding: '2px 7px', borderRadius: '5px' }}>BEST VALUE ✓</div>}
                    {i === 0 && !provider.isBest && <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#FFD700', color: '#080806', fontSize: '9px', fontWeight: '700', padding: '2px 7px', borderRadius: '5px' }}>LOWEST PRICE</div>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: provider.isBest ? '#4CAF50' : '#5A4A2A' }} /><span style={{ fontSize: '12px', fontWeight: '600', color: '#F0EDE8' }}>{provider.name}</span><span style={{ fontSize: '10px', color: '#5A4A2A' }}>#{i + 1}</span></div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}><span style={{ fontSize: '24px', fontWeight: '700', color: provider.isBest ? '#4CAF50' : '#F0EDE8' }}>₹{provider.price}</span><span style={{ fontSize: '13px', color: '#444', textDecoration: 'line-through' }}>₹{provider.originalPrice}</span><span style={{ fontSize: '11px', color: '#FFD700', fontWeight: '600' }}>{Math.round((1 - provider.price / provider.originalPrice) * 100)}% off</span></div>
                    <div style={{ fontSize: '11px', color: '#8A7A5A', marginBottom: '10px' }}>{provider.isBest ? '🏆 Best value — lowest price per unit' : `₹${(provider.unitPrice - Math.min(...selectedProduct.providers.map(p => p.unitPrice))).toFixed(0)} more expensive per unit`}</div>
                    <button onClick={() => handleAddToCart(selectedProduct, provider)} style={{ width: '100%', backgroundColor: provider.isBest ? '#2E7D32' : '#1A1608', border: `1px solid ${provider.isBest ? '#4CAF50' : '#3A3020'}`, color: provider.isBest ? '#fff' : '#E8DDB8', padding: '9px', borderRadius: '7px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>+ Add from {provider.name}</button>
                  </div>
                ))}
              </div>
            </div>)}

            {/* MULTI-ITEM SPLIT VIEW */}
            {view === 'multi' && multiItems.length >= 2 && (() => {
              const totalPairs = Math.ceil(multiItems.length / 2)
              const currentPair = multiItems.slice(multiIndex * 2, multiIndex * 2 + 2)
              const mSlideStyle = {
                transform: multiSliding === 'left' ? 'translateX(-100%)' : multiSliding === 'right' ? 'translateX(100%)' : 'translateX(0)',
                opacity: multiSliding ? 0 : 1,
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              }
              return (<div>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#F0EDE8', marginBottom: '2px' }}>🔍 Comparing {multiItems.length} items</div>
                    <div style={{ fontSize: '10px', color: '#8A7A5A' }}>Side by side{totalPairs > 1 ? ` • Page ${multiIndex + 1} of ${totalPairs}` : ''}</div>
                  </div>
                  <button onClick={handleExitMulti} style={{ background: 'transparent', border: '1px solid #2A2810', color: '#9E9E9E', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#4CAF50'; e.currentTarget.style.color = '#F0EDE8' }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2810'; e.currentTarget.style.color = '#9E9E9E' }}>✕ Exit</button>
                </div>

                {/* Split cards with arrows */}
                <div style={{ position: 'relative' }}>
                  {multiIndex > 0 && <button onClick={handleMultiPrev} style={{ position: 'absolute', left: '-4px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1A1608', border: '1px solid #4CAF50', color: '#4CAF50', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2E7D32'; e.currentTarget.style.color = '#fff' }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1A1608'; e.currentTarget.style.color = '#4CAF50' }}>←</button>}
                  {multiIndex < totalPairs - 1 && <button onClick={handleMultiNext} style={{ position: 'absolute', right: '-4px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1A1608', border: '1px solid #4CAF50', color: '#4CAF50', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2E7D32'; e.currentTarget.style.color = '#fff' }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1A1608'; e.currentTarget.style.color = '#4CAF50' }}>→</button>}

                  <div style={{ display: 'flex', gap: '10px', overflow: 'hidden', ...mSlideStyle }}>
                    {currentPair.map((item, idx) => {
                      const sorted = [...item.product.providers].sort((a, b) => a.unitPrice - b.unitPrice)
                      return (
                        <div key={item.product.id + '-' + idx} style={{ flex: 1, minWidth: 0, backgroundColor: '#111008', border: '1px solid #2A2810', borderRadius: '12px', overflow: 'hidden' }}>
                          <div style={{ padding: '12px', borderBottom: '1px solid #1E1C10', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#0A0806' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid #2A2810' }}>
                              <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:20px;background:#1A1608">${item.product.emoji}</div>` }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '12px', fontWeight: '600', color: '#F0EDE8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.name}</div>
                              <div style={{ fontSize: '10px', color: '#8A7A5A' }}>{item.product.quantity} {item.product.unit} • {item.category.name}</div>
                              <StarRating {...getProductRating(item.product.id)} size={8} />
                            </div>
                          </div>
                          <div style={{ padding: '8px' }}>
                            {sorted.map((provider, pi) => (
                              <div key={pi} style={{ backgroundColor: provider.isBest ? '#0A1F0A' : 'transparent', border: `1px solid ${provider.isBest ? '#4CAF5060' : '#1E1C10'}`, borderRadius: '8px', padding: '8px 10px', marginBottom: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: provider.isBest ? '#4CAF50' : '#5A4A2A' }} />
                                    <span style={{ fontSize: '10px', fontWeight: '600', color: '#C8B88A' }}>{provider.name}</span>
                                  </div>
                                  {provider.isBest && <span style={{ fontSize: '8px', fontWeight: '700', color: '#4CAF50', backgroundColor: '#0A1F0A', padding: '1px 5px', borderRadius: '3px' }}>BEST</span>}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
                                  <span style={{ fontSize: '18px', fontWeight: '700', color: provider.isBest ? '#4CAF50' : '#F0EDE8' }}>₹{provider.price}</span>
                                  <span style={{ fontSize: '10px', color: '#444', textDecoration: 'line-through' }}>₹{provider.originalPrice}</span>
                                  <span style={{ fontSize: '9px', color: '#FFD700', fontWeight: '600' }}>{Math.round((1 - provider.price / provider.originalPrice) * 100)}%</span>
                                </div>
                                <button onClick={() => handleAddToCart(item.product, provider)} style={{ width: '100%', backgroundColor: provider.isBest ? '#2E7D32' : '#1A1608', border: `1px solid ${provider.isBest ? '#4CAF50' : '#3A3020'}`, color: provider.isBest ? '#fff' : '#C8B88A', padding: '6px', borderRadius: '6px', fontSize: '10px', fontWeight: '600', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>+ Add</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {totalPairs > 1 && <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '14px' }}>
                  {Array.from({ length: totalPairs }).map((_, i) => (
                    <div key={i} onClick={() => { if (i !== multiIndex) { playSound('click'); setMultiSliding(i > multiIndex ? 'left' : 'right'); setTimeout(() => { setMultiIndex(i); setMultiSliding(null) }, 350) } }}
                      style={{ width: i === multiIndex ? '20px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: i === multiIndex ? '#4CAF50' : '#2A2810', cursor: 'pointer', transition: 'all 0.3s ease' }} />
                  ))}
                </div>}

                <div style={{ marginTop: '14px', backgroundColor: '#1C1A0E', border: '1px solid #E8DDB820', borderRadius: '8px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '11px', color: '#C8B88A', marginBottom: '6px' }}>💡 Yukti's tip: Add best-value items from each comparison to maximize savings</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {multiItems.map((item, i) => {
                      const best = item.product.providers.find(p => p.isBest) || item.product.providers[0]
                      return <span key={i} style={{ fontSize: '10px', color: '#4CAF50', backgroundColor: '#0A1F0A', padding: '3px 8px', borderRadius: '4px' }}>{item.product.emoji} {item.product.name}: ₹{best.price}</span>
                    })}
                  </div>
                </div>
              </div>)
            })()}
          </div>
        </div>

      </div>

      {/* ========== CART — FULL PAGE ========== */}
      {cartOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 999, backgroundColor: '#080806', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.25s ease' }}>
        {/* Cart Navbar */}
        <div style={{ padding: '13px 24px', borderBottom: '1px solid #1E1C10', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, backgroundColor: '#080806' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => setCartOpen(false)} style={{ background: 'transparent', border: '1px solid #2A2810', color: '#9E9E9E', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#4CAF50'; e.currentTarget.style.color = '#F0EDE8' }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2810'; e.currentTarget.style.color = '#9E9E9E' }}>← Back</button>
            <div><div style={{ fontSize: '17px', fontWeight: '700', color: '#F0EDE8' }}>Your Cart</div><div style={{ fontSize: '11px', color: '#8A7A5A' }}>{itemCount === 0 ? 'No items yet' : `${itemCount} item${itemCount > 1 ? 's' : ''} • ${config.title}`}</div></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {cartItems.length > 0 && <button onClick={() => { playSound('click'); clearCart() }} style={{ background: 'transparent', border: '1px solid #3A2020', color: '#F44336', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1F0A0A'; e.currentTarget.style.borderColor = '#F44336' }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#3A2020' }}>Clear all</button>}
          </div>
        </div>

        {/* Section Tabs */}
        {cartItems.length > 0 && <div style={{ display: 'flex', borderBottom: '1px solid #2A2810', flexShrink: 0, backgroundColor: '#080806', padding: '0 24px' }}>
          {[
            { id: 'all', label: 'All Items', count: cartItems.length },
            { id: 'quick-commerce', label: '🛒 Quick Commerce', count: sectionCounts['quick-commerce'] },
            { id: 'ecommerce', label: '🛍️ E-Commerce', count: sectionCounts['ecommerce'] },
            { id: 'food', label: '🍔 Food & Meals', count: sectionCounts['food'] },
          ].filter(t => t.id === 'all' || t.count > 0).map(tab => (
            <button key={tab.id} onClick={() => setCartSection(tab.id)} style={{
              padding: '12px 16px', background: 'none', border: 'none',
              borderBottom: cartSection === tab.id ? '2px solid #4CAF50' : '2px solid transparent',
              color: cartSection === tab.id ? '#4CAF50' : '#5A4A2A',
              fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: '6px', transition: 'all 0.2s ease', whiteSpace: 'nowrap',
            }}>
              {tab.label}
              {tab.count > 0 && <span style={{ fontSize: '10px', backgroundColor: cartSection === tab.id ? '#0A1F0A' : '#1A1608', padding: '2px 7px', borderRadius: '10px', color: cartSection === tab.id ? '#4CAF50' : '#5A4A2A' }}>{tab.count}</span>}
            </button>
          ))}
        </div>}

        {/* Main content — two columns on desktop */}
        {cartItems.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: '#5A4A2A' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#8A7A5A', marginBottom: '8px' }}>Your cart is empty</div>
              <div style={{ fontSize: '13px', color: '#5A4A2A', lineHeight: '1.5', marginBottom: '20px' }}>Browse products and tap "Add from..." to start saving!</div>
              <button onClick={() => setCartOpen(false)} style={{ backgroundColor: '#2E7D32', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#388E3C'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2E7D32'}>Continue Shopping</button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', flexDirection: isMobile ? 'column' : 'row' }}>
            {/* LEFT COLUMN — Items */}
            <div style={{ flex: isMobile ? 'none' : '1 1 60%', overflowY: 'auto', padding: '16px 24px', borderRight: isMobile ? 'none' : '1px solid #1E1C10' }}>
              <div style={{ fontSize: '10px', color: '#5A4A2A', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>{filteredCartItems.length} item{filteredCartItems.length !== 1 ? 's' : ''}{cartSection !== 'all' ? ` in ${cartSection.replace('-', ' ')}` : ''}</div>
              {filteredCartItems.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: '#5A4A2A', fontSize: '13px' }}>No items in this section</div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredCartItems.map((item) => {
                  const savedVsWorst = (item.worstPrice - item.price) * item.qty
                  return (<div key={item.id} style={{ backgroundColor: '#111008', border: '1px solid #E8DDB812', borderRadius: '10px', padding: '14px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, border: '1px solid #2A2810', backgroundColor: '#1A1608' }}><img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:24px">${item.emoji}</div>` }} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#F0EDE8', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#8A7A5A' }}>{item.quantity} {item.unit}</span>
                        <span style={{ fontSize: '10px', color: item.isBest ? '#4CAF50' : '#C8B88A', backgroundColor: item.isBest ? '#0A1F0A' : '#1A1608', padding: '2px 7px', borderRadius: '4px', fontWeight: '600' }}>{item.isBest ? '✓ Best Value' : item.provider}</span>
                      </div>
                      {savedVsWorst > 0 && <div style={{ fontSize: '11px', color: '#66BB6A', marginBottom: '6px' }}>💡 Saving ₹{savedVsWorst} vs worst price</div>}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '17px', fontWeight: '700', color: '#F0EDE8' }}>₹{item.price * item.qty}</span>{item.qty > 1 && <span style={{ fontSize: '11px', color: '#8A7A5A' }}>₹{item.price} each</span>}</div>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #2A2810', borderRadius: '8px', overflow: 'hidden' }}>
                          <button onClick={() => { playSound('click'); updateQty(item.id, item.qty - 1) }} style={{ backgroundColor: '#1A1608', border: 'none', color: '#E8DDB8', width: '32px', height: '32px', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2A2810'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1A1608'}>{item.qty === 1 ? '🗑' : '−'}</button>
                          <span style={{ backgroundColor: '#111008', color: '#F0EDE8', width: '36px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', borderLeft: '1px solid #2A2810', borderRight: '1px solid #2A2810' }}>{item.qty}</span>
                          <button onClick={() => { playSound('click'); updateQty(item.id, item.qty + 1) }} style={{ backgroundColor: '#1A1608', border: 'none', color: '#4CAF50', width: '32px', height: '32px', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2A2810'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1A1608'}>+</button>
                        </div>
                      </div>
                    </div>
                  </div>)
                })}
              </div>
            </div>

            {/* RIGHT COLUMN — Optimizer + Summary + Checkout */}
            <div style={{ flex: isMobile ? 'none' : '0 0 40%', maxWidth: isMobile ? '100%' : '40%', overflowY: 'auto', padding: '16px 24px', backgroundColor: '#0A0806' }}>

              {/* Store Optimizer */}
              {(() => {
                const opt = getStoreOptimizer()
                if (!opt) return null
                const { cheapest, storeTotals, savingsVsWorst } = opt
                return (
                  <div style={{ backgroundColor: '#111008', border: '1px solid #2A2810', borderRadius: '10px', overflow: 'hidden', marginBottom: '14px' }}>
                    <div style={{ padding: '10px 14px', backgroundColor: '#0A0806', borderBottom: '1px solid #1E1C10', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '7px', background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: '800' }}>₹</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#F0EDE8' }}>Yukti recommends: {cheapest.store}</div>
                        <div style={{ fontSize: '10px', color: '#8A7A5A' }}>Cheapest for all {cartItems.length} item{cartItems.length > 1 ? 's' : ''}</div>
                      </div>
                      {savingsVsWorst > 0 && <div style={{ backgroundColor: '#0A1F0A', border: '1px solid #4CAF5060', borderRadius: '6px', padding: '4px 8px' }}>
                        <div style={{ fontSize: '10px', color: '#4CAF50', fontWeight: '700' }}>Save ₹{savingsVsWorst}</div>
                      </div>}
                    </div>
                    <div style={{ padding: '10px 14px', borderBottom: '1px solid #1E1C10' }}>
                      <div style={{ fontSize: '10px', color: '#5A4A2A', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total per store</div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {storeTotals.map((s, i) => {
                          const isSelected = i === 0
                          const pctMore = i > 0 ? Math.round((s.total - cheapest.total) / cheapest.total * 100) : 0
                          return (
                            <div key={i} style={{ flex: 1, backgroundColor: isSelected ? '#0A1F0A' : '#0A0806', border: `1.5px solid ${isSelected ? '#4CAF50' : '#1E1C10'}`, borderRadius: '8px', padding: '8px 4px', textAlign: 'center', position: 'relative' }}>
                              {isSelected && <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#4CAF50', color: '#fff', fontSize: '7px', fontWeight: '700', padding: '1px 6px', borderRadius: '0 0 4px 4px' }}>BEST</div>}
                              <div style={{ fontSize: '9px', color: isSelected ? '#66BB6A' : '#5A4A2A', marginBottom: '2px', marginTop: isSelected ? '6px' : '0' }}>{s.store.replace('Open Food Facts', 'OpenFF')}</div>
                              <div style={{ fontSize: '15px', fontWeight: '800', color: isSelected ? '#4CAF50' : '#C8B88A' }}>₹{s.total}</div>
                              {pctMore > 0 && <div style={{ fontSize: '8px', color: '#F44336', marginTop: '1px' }}>+{pctMore}%</div>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div style={{ padding: '10px 14px' }}>
                      <div style={{ fontSize: '10px', color: '#5A4A2A', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Breakdown — {cheapest.store}</div>
                      {cheapest.breakdown.map((item, i) => {
                        const otherPrices = opt.itemsWithAllPrices.find(x => x.name === item.name)?.allProviders.filter(p => p.name !== cheapest.store) || []
                        const worstOther = otherPrices.length > 0 ? Math.max(...otherPrices.map(p => p.price)) : item.price
                        const savedPerItem = worstOther - item.price
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < cheapest.breakdown.length - 1 ? '1px solid #1E1C10' : 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
                              <span style={{ fontSize: '13px' }}>{item.emoji}</span>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: '11px', color: '#E8DDB8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}{item.qty > 1 ? ` ×${item.qty}` : ''}</div>
                                {savedPerItem > 0 && <div style={{ fontSize: '9px', color: '#66BB6A' }}>↓₹{savedPerItem} cheaper</div>}
                              </div>
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#4CAF50', flexShrink: 0 }}>₹{item.price * item.qty}</span>
                          </div>
                        )
                      })}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #2A2810' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#C8B88A' }}>Total</span>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#4CAF50' }}>₹{cheapest.total}</span>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Agent ordering info */}
              <div style={{ backgroundColor: '#111008', border: '1px solid #E8DDB815', borderRadius: '10px', padding: '12px 14px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff', fontWeight: '800' }}>₹</div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#E8DDB8' }}>How Pramā works</span>
                </div>
                <div style={{ fontSize: '11px', color: '#8A7A5A', lineHeight: '1.6' }}>Yukti will place your order directly on the selected store. You pay the store's price — Pramā never handles your money. Any store coupons or discounts will be auto-applied at checkout.</div>
              </div>

              {/* Savings banner */}
              {getSmartSavings() > 0 && <div style={{ backgroundColor: '#0A1F0A', border: '1px solid #2E7D32', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '15px' }}>💰</span><span style={{ fontSize: '13px', color: '#66BB6A', fontWeight: '600' }}>Pramā found you ₹{getSmartSavings()} cheaper vs other stores!</span></div>}

              {/* Price Summary */}
              <div style={{ backgroundColor: '#111008', border: '1px solid #E8DDB815', borderRadius: '10px', padding: '16px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span style={{ color: '#C8B88A' }}>Subtotal ({itemCount} items)</span><span style={{ color: '#E8DDB8' }}>₹{getSubtotal()}</span></div>
                  {getSavings() > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span style={{ color: '#C8B88A' }}>Store discounts</span><span style={{ color: '#4CAF50', fontWeight: '600' }}>−₹{getSavings()}</span></div>}
                  <div style={{ height: '1px', backgroundColor: '#E8DDB815', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700' }}><span style={{ color: '#E8DDB8' }}>Total</span><span style={{ color: '#F0EDE8' }}>₹{getTotal()}</span></div>
                  <div style={{ fontSize: '10px', color: '#5A4A2A', marginTop: '2px' }}>Paid directly to the store — Pramā is free to use</div>
                </div>
              </div>

              {/* Checkout button */}
              <button onClick={handleStartCheckout} style={{ width: '100%', backgroundColor: '#2E7D32', border: 'none', color: '#fff', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.3px', position: 'sticky', bottom: '16px' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#388E3C'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2E7D32'}>Let Yukti Order For You →</button>
            </div>
          </div>
        )}
      </div>}

      {/* ========== CHECKOUT — RAZORPAY STYLE ========== */}
      {checkoutStep && <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div onClick={checkoutStep !== 'success' && !paymentProcessing ? handleCloseCheckout : undefined} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }} />
        <div style={{ position: 'relative', width: isMobile ? '95%' : checkoutStep === 'payment' ? '560px' : '440px', maxHeight: '92vh', overflowY: 'auto', backgroundColor: '#0E0C08', border: '1px solid #E8DDB815', borderRadius: '14px', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', animation: 'modalPop 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>

          {/* ===== ADDRESS STEP ===== */}
          {checkoutStep === 'address' && <div>
            {/* Green header bar */}
            <div style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32, #388E3C)', padding: '16px 24px', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '800', color: '#fff' }}>P</div>
                <div><div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>Pramā Checkout</div><div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>Delivery Details</div></div>
              </div>
              <button onClick={handleCloseCheckout} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.7)', width: '28px', height: '28px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ padding: '24px' }}>
              {/* Progress bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <div style={{ flex: 1, height: '3px', borderRadius: '2px', backgroundColor: '#4CAF50' }} />
                <div style={{ flex: 1, height: '3px', borderRadius: '2px', backgroundColor: '#2A2810' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div><div style={{ fontSize: '11px', color: '#C8B88A', marginBottom: '5px', fontWeight: '600' }}>Full Name</div><input value={addressForm.name} onChange={e => { setAddressForm(p => ({ ...p, name: e.target.value })); setFormErrors(p => ({ ...p, name: undefined })) }} placeholder="Arjun Sharma" style={inputErrorStyle('name')} /><FieldError field="name" /></div>
                <div><div style={{ fontSize: '11px', color: '#C8B88A', marginBottom: '5px', fontWeight: '600' }}>Phone Number</div><input value={addressForm.phone} onChange={e => { setAddressForm(p => ({ ...p, phone: e.target.value })); setFormErrors(p => ({ ...p, phone: undefined })) }} placeholder="+91 98765 43210" style={inputErrorStyle('phone')} /><FieldError field="phone" /></div>
                <div><div style={{ fontSize: '11px', color: '#C8B88A', marginBottom: '5px', fontWeight: '600' }}>Address</div><input value={addressForm.address} onChange={e => { setAddressForm(p => ({ ...p, address: e.target.value })); setFormErrors(p => ({ ...p, address: undefined })) }} placeholder="Flat 302, Green Park Apartments" style={inputErrorStyle('address')} /><FieldError field="address" /></div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}><div style={{ fontSize: '11px', color: '#C8B88A', marginBottom: '5px', fontWeight: '600' }}>Pincode</div><input value={addressForm.pincode} onChange={e => { setAddressForm(p => ({ ...p, pincode: e.target.value })); setFormErrors(p => ({ ...p, pincode: undefined })) }} placeholder="110016" style={inputErrorStyle('pincode')} /><FieldError field="pincode" /></div>
                  <div style={{ flex: 1 }}><div style={{ fontSize: '11px', color: '#C8B88A', marginBottom: '5px', fontWeight: '600' }}>City</div><input value={addressForm.city} onChange={e => { setAddressForm(p => ({ ...p, city: e.target.value })); setFormErrors(p => ({ ...p, city: undefined })) }} placeholder="New Delhi" style={inputErrorStyle('city')} /><FieldError field="city" /></div>
                </div>
              </div>
              <button onClick={handleAddressSubmit} style={{ width: '100%', marginTop: '22px', backgroundColor: '#2E7D32', border: 'none', color: '#fff', padding: '14px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#388E3C'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2E7D32'}>Continue to Payment →</button>
            </div>
          </div>}

          {/* ===== PAYMENT STEP — RAZORPAY LAYOUT ===== */}
          {checkoutStep === 'payment' && <div>
            {/* Header — like Razorpay's merchant bar */}
            <div style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32, #388E3C)', padding: '14px 20px', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800', color: '#fff' }}>P</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>Yukti is ordering for you</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>Paying store directly • {addressForm.name || 'Customer'}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>₹{getTotal()}</div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>{itemCount} item{itemCount > 1 ? 's' : ''}</div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ padding: '12px 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ flex: 1, height: '3px', borderRadius: '2px', backgroundColor: '#4CAF50' }} />
              <div style={{ flex: 1, height: '3px', borderRadius: '2px', backgroundColor: '#4CAF50' }} />
            </div>

            {/* Two-column layout like Razorpay */}
            <div style={{ display: 'flex', minHeight: '340px', flexDirection: isMobile ? 'column' : 'row' }}>
              {/* Left — Payment methods sidebar */}
              <div style={{ width: isMobile ? '100%' : '180px', flexShrink: 0, borderRight: isMobile ? 'none' : '1px solid #1E1C10', borderBottom: isMobile ? '1px solid #1E1C10' : 'none', padding: isMobile ? '12px 20px' : '16px 0', display: isMobile ? 'flex' : 'block', gap: isMobile ? '4px' : '0' }}>
                {[
                  { id: 'upi', label: 'UPI / QR', icon: '📱', desc: 'GPay, PhonePe' },
                  { id: 'card', label: 'Cards', icon: '💳', desc: 'Debit / Credit' },
                  { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All banks' },
                ].map(method => (
                  <div key={method.id} onClick={() => { setPaymentTab(method.id); setFormErrors({}) }} style={{
                    padding: isMobile ? '8px 14px' : '12px 16px',
                    backgroundColor: paymentTab === method.id ? '#0A1F0A' : 'transparent',
                    borderLeft: !isMobile && paymentTab === method.id ? '3px solid #4CAF50' : !isMobile ? '3px solid transparent' : 'none',
                    borderBottom: isMobile && paymentTab === method.id ? '2px solid #4CAF50' : isMobile ? '2px solid transparent' : 'none',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    flex: isMobile ? 1 : 'none', justifyContent: isMobile ? 'center' : 'flex-start',
                  }} onMouseEnter={e => { if (paymentTab !== method.id) e.currentTarget.style.backgroundColor = '#111008' }} onMouseLeave={e => { if (paymentTab !== method.id) e.currentTarget.style.backgroundColor = 'transparent' }}>
                    <span style={{ fontSize: isMobile ? '16px' : '18px' }}>{method.icon}</span>
                    <div style={{ display: isMobile ? 'none' : 'block' }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: paymentTab === method.id ? '#4CAF50' : '#E8DDB8' }}>{method.label}</div>
                      <div style={{ fontSize: '9px', color: '#5A4A2A' }}>{method.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right — Payment form */}
              <div style={{ flex: 1, padding: '20px' }}>
                {/* UPI */}
                {paymentTab === 'upi' && <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#E8DDB8', marginBottom: '14px' }}>Pay via UPI</div>

                  {/* QR Code — DEMO MODE (safe, no real payments) */}
                  <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '14px', textAlign: 'center' }}>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`PRAMA-DEMO-CHECKOUT-INR-${getTotal()}-${Date.now().toString(36).toUpperCase()}`)}&bgcolor=ffffff&color=1B5E20`} alt="Demo QR Code" style={{ width: '180px', height: '180px', borderRadius: '8px' }} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                    <div style={{ display: 'none', width: '180px', height: '180px', margin: '0 auto', backgroundColor: '#f5f5f5', borderRadius: '8px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '32px' }}>📱</span>
                      <span style={{ fontSize: '10px', color: '#666' }}>QR loads on network</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#1B5E20', fontWeight: '700', marginTop: '8px' }}>₹{getTotal()}</div>
                    <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>Scan with any UPI app to pay</div>
                    <div style={{ fontSize: '9px', color: '#E65100', backgroundColor: '#FFF3E0', padding: '3px 10px', borderRadius: '4px', marginTop: '6px', display: 'inline-block' }}>Demo mode — no real payments</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '14px' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#1E1C10' }} />
                    <span style={{ padding: '0 12px', fontSize: '10px', color: '#5A4A2A' }}>or enter UPI ID</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#1E1C10' }} />
                  </div>

                  <div style={{ fontSize: '11px', color: '#C8B88A', marginBottom: '6px', fontWeight: '600' }}>UPI ID</div>
                  <input value={paymentForm.upiId} onChange={e => { setPaymentForm(p => ({ ...p, upiId: e.target.value })); setFormErrors(p => ({ ...p, upiId: undefined })) }} placeholder="yourname@upi" style={{ ...inputErrorStyle('upiId'), border: formErrors.upiId ? '1px solid #F4433680' : '1px solid #E8DDB820' }} />
                  <FieldError field="upiId" />
                  <div style={{ fontSize: '10px', color: '#5A4A2A', marginTop: '4px' }}>You will receive a payment request on your UPI app</div>
                  <div style={{ marginTop: '14px' }}>
                    <div style={{ fontSize: '10px', color: '#C8B88A', marginBottom: '8px', fontWeight: '600' }}>Quick pay via</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {[
                        { name: 'GPay', color: '#4285F4' },
                        { name: 'PhonePe', color: '#5F259F' },
                        { name: 'Paytm', color: '#00BAF2' },
                        { name: 'BHIM', color: '#00695C' },
                      ].map(app => (
                        <div key={app.name} style={{ backgroundColor: '#111008', border: '1px solid #E8DDB815', borderRadius: '8px', padding: '10px 16px', fontSize: '12px', color: '#E8DDB8', cursor: 'pointer', fontWeight: '600', transition: 'all 0.15s ease' }} onMouseEnter={e => { e.currentTarget.style.borderColor = app.color; e.currentTarget.style.color = app.color }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8DDB815'; e.currentTarget.style.color = '#E8DDB8' }}>{app.name}</div>
                      ))}
                    </div>
                  </div>
                </div>}

                {/* Card */}
                {paymentTab === 'card' && <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#E8DDB8', marginBottom: '14px' }}>Card Details</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div><div style={{ fontSize: '11px', color: '#C8B88A', marginBottom: '5px', fontWeight: '600' }}>Card Number</div><input value={paymentForm.cardNumber} onChange={e => { setPaymentForm(p => ({ ...p, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16) })); setFormErrors(p => ({ ...p, cardNumber: undefined })) }} placeholder="4242 4242 4242 4242" style={{ ...inputErrorStyle('cardNumber'), border: formErrors.cardNumber ? '1px solid #F4433680' : '1px solid #E8DDB820', letterSpacing: '2px' }} /><FieldError field="cardNumber" /></div>
                    <div><div style={{ fontSize: '11px', color: '#C8B88A', marginBottom: '5px', fontWeight: '600' }}>Name on Card</div><input value={paymentForm.cardName} onChange={e => { setPaymentForm(p => ({ ...p, cardName: e.target.value })); setFormErrors(p => ({ ...p, cardName: undefined })) }} placeholder="ARJUN SHARMA" style={{ ...inputErrorStyle('cardName'), border: formErrors.cardName ? '1px solid #F4433680' : '1px solid #E8DDB820', textTransform: 'uppercase' }} /><FieldError field="cardName" /></div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ flex: 1 }}><div style={{ fontSize: '11px', color: '#C8B88A', marginBottom: '5px', fontWeight: '600' }}>Expiry Date</div><input value={paymentForm.cardExpiry} onChange={e => { setPaymentForm(p => ({ ...p, cardExpiry: e.target.value })); setFormErrors(p => ({ ...p, cardExpiry: undefined })) }} placeholder="MM / YY" style={{ ...inputErrorStyle('cardExpiry'), border: formErrors.cardExpiry ? '1px solid #F4433680' : '1px solid #E8DDB820' }} /><FieldError field="cardExpiry" /></div>
                      <div style={{ flex: 1 }}><div style={{ fontSize: '11px', color: '#C8B88A', marginBottom: '5px', fontWeight: '600' }}>CVV</div><input value={paymentForm.cardCvv} onChange={e => { setPaymentForm(p => ({ ...p, cardCvv: e.target.value.replace(/\D/g, '').slice(0, 3) })); setFormErrors(p => ({ ...p, cardCvv: undefined })) }} placeholder="•••" type="password" style={{ ...inputErrorStyle('cardCvv'), border: formErrors.cardCvv ? '1px solid #F4433680' : '1px solid #E8DDB820' }} /><FieldError field="cardCvv" /></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                    {['Visa', 'Mastercard', 'RuPay'].map(card => (
                      <span key={card} style={{ fontSize: '9px', color: '#5A4A2A', backgroundColor: '#111008', border: '1px solid #1E1C10', padding: '3px 8px', borderRadius: '4px' }}>{card}</span>
                    ))}
                  </div>
                </div>}

                {/* Net Banking */}
                {paymentTab === 'netbanking' && <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#E8DDB8', marginBottom: '14px' }}>Select Bank</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[
                      { name: 'State Bank of India', short: 'SBI' },
                      { name: 'HDFC Bank', short: 'HDFC' },
                      { name: 'ICICI Bank', short: 'ICICI' },
                      { name: 'Axis Bank', short: 'Axis' },
                      { name: 'Kotak Mahindra', short: 'Kotak' },
                      { name: 'Punjab National Bank', short: 'PNB' },
                    ].map(bank => (
                      <div key={bank.name} onClick={() => setPaymentForm(p => ({ ...p, bank: bank.name }))} style={{
                        backgroundColor: paymentForm.bank === bank.name ? '#0A1F0A' : '#111008',
                        border: `1px solid ${paymentForm.bank === bank.name ? '#4CAF50' : '#E8DDB815'}`,
                        borderRadius: '8px', padding: '11px 14px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.15s ease',
                      }} onMouseEnter={e => { if (paymentForm.bank !== bank.name) e.currentTarget.style.borderColor = '#E8DDB830' }} onMouseLeave={e => { if (paymentForm.bank !== bank.name) e.currentTarget.style.borderColor = '#E8DDB815' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: paymentForm.bank === bank.name ? '#1B5E20' : '#1A1608', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: paymentForm.bank === bank.name ? '#4CAF50' : '#5A4A2A' }}>{bank.short}</div>
                          <span style={{ fontSize: '13px', color: paymentForm.bank === bank.name ? '#4CAF50' : '#E8DDB8' }}>{bank.name}</span>
                        </div>
                        {paymentForm.bank === bank.name && <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff' }}>✓</div>}
                      </div>
                    ))}
                  </div>
                </div>}
              </div>
            </div>

            {/* Bottom bar — Razorpay style */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #1E1C10', backgroundColor: '#0A0806', borderRadius: '0 0 14px 14px' }}>
              <button onClick={handlePaymentSubmit} disabled={paymentProcessing} style={{
                width: '100%', backgroundColor: paymentProcessing ? '#1A3A1A' : '#2E7D32',
                border: 'none', color: '#fff', padding: '14px', borderRadius: '10px',
                fontSize: '15px', fontWeight: '700', cursor: paymentProcessing ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: paymentProcessing ? 0.8 : 1, transition: 'all 0.2s ease',
              }} onMouseEnter={e => { if (!paymentProcessing) e.currentTarget.style.backgroundColor = '#388E3C' }} onMouseLeave={e => { if (!paymentProcessing) e.currentTarget.style.backgroundColor = '#2E7D32' }}>
                {paymentProcessing ? (<><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Yukti is placing your order...</>) : (<>Pay ₹{getTotal()} to store <span style={{ opacity: 0.6, fontSize: '12px' }}>via Yukti</span></>)}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                <button onClick={() => setCheckoutStep('address')} style={{ background: 'none', border: 'none', color: '#5A4A2A', fontSize: '11px', cursor: 'pointer' }}>← Change address</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '10px', color: '#5A4A2A' }}>🔒</span>
                  <span style={{ fontSize: '10px', color: '#5A4A2A' }}>Powered by</span>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#C8B88A' }}>Yukti Agent</span>
                </div>
              </div>
            </div>
          </div>}

          {/* ===== SUCCESS SCREEN ===== */}
          {checkoutStep === 'success' && orderResult && <div style={{ padding: '0' }}>
            {/* Green celebration header */}
            <div style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32, #43A047)', padding: '32px 24px', borderRadius: '14px 14px 0 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              {/* Confetti */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
                {Array.from({ length: 35 }).map((_, i) => (<div key={i} style={{ position: 'absolute', width: `${3 + Math.random() * 5}px`, height: `${3 + Math.random() * 5}px`, borderRadius: Math.random() > 0.5 ? '50%' : '1px', backgroundColor: ['#fff', '#FFD700', '#E8DDB8', '#66BB6A', '#FF6B35', '#CE93D8'][i % 6], left: `${Math.random() * 100}%`, top: '-8px', opacity: 0.8, animation: `confettiFall ${1.5 + Math.random() * 2}s ease-in ${Math.random() * 0.5}s forwards` }} />))}
              </div>
              <div style={{ fontSize: '56px', marginBottom: '12px', animation: 'bounceIn 0.5s ease', position: 'relative' }}>✓</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px', position: 'relative' }}>Yukti placed your order!</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', position: 'relative' }}>Ordered directly from the store</div>
            </div>

            <div style={{ padding: '20px 24px' }}>
              {/* Order card */}
              <div style={{ backgroundColor: '#111008', border: '1px solid #E8DDB815', borderRadius: '10px', padding: '16px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#C8B88A' }}>Order ID</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#FFD700', fontFamily: 'monospace', letterSpacing: '0.5px' }}>{orderResult.orderId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#C8B88A' }}>Items</span>
                  <span style={{ fontSize: '12px', color: '#E8DDB8' }}>{orderResult.items.length} products</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#C8B88A' }}>Payment</span>
                  <span style={{ fontSize: '12px', color: '#E8DDB8' }}>{orderResult.paymentMethod}</span>
                </div>
                <div style={{ height: '1px', backgroundColor: '#E8DDB815', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#E8DDB8' }}>Paid to store</span>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: '#4CAF50' }}>₹{orderResult.total}</span>
                </div>
                {orderResult.savings > 0 && <div style={{ fontSize: '11px', color: '#66BB6A', textAlign: 'right', marginTop: '4px' }}>You saved ₹{orderResult.savings} on this order!</div>}
              </div>

              {/* Delivery card */}
              <div style={{ backgroundColor: '#111008', border: '1px solid #E8DDB815', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
                <div style={{ fontSize: '10px', color: '#C8B88A', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Delivering to</div>
                <div style={{ fontSize: '14px', color: '#E8DDB8', fontWeight: '600' }}>{orderResult.address?.name}</div>
                <div style={{ fontSize: '11px', color: '#8A7A5A', marginTop: '3px' }}>{orderResult.address?.address}, {orderResult.address?.city} - {orderResult.address?.pincode}</div>
              </div>

              {/* Actions */}
              <button onClick={handleCloseCheckout} style={{ width: '100%', backgroundColor: '#2E7D32', border: 'none', color: '#fff', padding: '14px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginBottom: '8px' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#388E3C'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2E7D32'}>Continue Shopping</button>
              <button style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid #E8DDB820', color: '#C8B88A', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>📦 Track Order</button>
            </div>
          </div>}
        </div>
      </div>}

      {/* ========== BARCODE SCANNER ========== */}
      {scannerOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div onClick={closeScanner} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)' }} />
        <div style={{ position: 'relative', width: isMobile ? '95%' : '400px', backgroundColor: '#0E0C08', border: '1px solid #E8DDB815', borderRadius: '16px', overflow: 'hidden', animation: 'modalPop 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
          {/* Header */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #1E1C10', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0A0806' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>📷</span>
              <div><div style={{ fontSize: '14px', fontWeight: '700', color: '#E8DDB8' }}>Scan Barcode</div><div style={{ fontSize: '10px', color: '#8A7A5A' }}>Point camera at any product barcode</div></div>
            </div>
            <button onClick={closeScanner} style={{ background: 'transparent', border: '1px solid #2A2810', color: '#9E9E9E', width: '30px', height: '30px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>

          {/* Camera viewfinder */}
          <div style={{ position: 'relative', width: '100%', height: '280px', backgroundColor: '#000', overflow: 'hidden' }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {/* Viewfinder overlay */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '220px', height: '140px', border: '2px solid #4CAF50', borderRadius: '12px', position: 'relative', boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)' }}>
                {/* Corner accents */}
                {[{ top: '-2px', left: '-2px', borderTop: '3px solid #4CAF50', borderLeft: '3px solid #4CAF50', borderRadius: '12px 0 0 0' },
                  { top: '-2px', right: '-2px', borderTop: '3px solid #4CAF50', borderRight: '3px solid #4CAF50', borderRadius: '0 12px 0 0' },
                  { bottom: '-2px', left: '-2px', borderBottom: '3px solid #4CAF50', borderLeft: '3px solid #4CAF50', borderRadius: '0 0 0 12px' },
                  { bottom: '-2px', right: '-2px', borderBottom: '3px solid #4CAF50', borderRight: '3px solid #4CAF50', borderRadius: '0 0 12px 0' },
                ].map((s, i) => <div key={i} style={{ position: 'absolute', width: '24px', height: '24px', ...s }} />)}
                {/* Scanning line */}
                {scanPhase === 'scanning' && <div style={{ position: 'absolute', left: '8px', right: '8px', height: '2px', backgroundColor: '#4CAF50', boxShadow: '0 0 8px #4CAF50, 0 0 20px #4CAF5060', animation: 'scanLine 1.5s ease-in-out infinite', borderRadius: '2px' }} />}
              </div>
            </div>
            {/* No camera fallback */}
            {!streamRef.current && scanPhase === 'camera' && <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0806' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px', opacity: 0.5 }}>📷</div>
              <div style={{ fontSize: '12px', color: '#5A4A2A' }}>Camera preview</div>
              <div style={{ fontSize: '10px', color: '#3A3020', marginTop: '2px' }}>Tap "Scan" to detect a product</div>
            </div>}
            {/* Found overlay */}
            {scanPhase === 'found' && scannedProduct && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10,31,10,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>✓</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#4CAF50' }}>Product Found!</div>
              <div style={{ fontSize: '13px', color: '#E8DDB8', marginTop: '4px' }}>{scannedProduct.product.emoji} {scannedProduct.product.name}</div>
              <div style={{ fontSize: '10px', color: '#8A7A5A', marginTop: '2px' }}>{scannedProduct.category.name}</div>
            </div>}
          </div>

          {/* Bottom actions */}
          <div style={{ padding: '16px 20px', backgroundColor: '#0A0806' }}>
            {scanPhase === 'camera' && <button onClick={simulateScan} style={{ width: '100%', backgroundColor: '#2E7D32', border: 'none', color: '#fff', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#388E3C'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2E7D32'}>📸 Scan Product</button>}
            {scanPhase === 'scanning' && <div style={{ width: '100%', backgroundColor: '#1A3A1A', border: 'none', color: '#66BB6A', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><div style={{ width: '14px', height: '14px', border: '2px solid rgba(76,175,80,0.3)', borderTopColor: '#4CAF50', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Scanning barcode...</div>}
            {scanPhase === 'found' && <button onClick={handleScanNavigate} style={{ width: '100%', backgroundColor: '#2E7D32', border: 'none', color: '#fff', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#388E3C'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2E7D32'}>Compare Prices →</button>}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '10px' }}>
              <span style={{ fontSize: '10px', color: '#5A4A2A' }}>Powered by</span>
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#C8B88A' }}>Yukti Vision</span>
            </div>
          </div>
        </div>
      </div>}

      {/* ========== TOAST ========== */}
      {toast.show && <div style={{ position: 'fixed', bottom: isMobile ? '72px' : '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 1100, backgroundColor: '#1A3A1A', border: '1px solid #2E7D32', borderRadius: '10px', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px', animation: 'toastSlide 0.3s ease', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        <span style={{ fontSize: '16px' }}>{toast.emoji}</span>
        <span style={{ fontSize: '13px', color: '#C8E6C9', fontWeight: '600' }}>{toast.text}</span>
      </div>}

      {/* Mobile tabs */}
      {isMobile && <div style={{ height: '56px', borderTop: '1px solid #2A2810', backgroundColor: '#080806', display: 'flex', flexShrink: 0 }}>
        {[{ id: 'yukti', label: 'Yukti', icon: '₹' }, { id: 'browse', label: 'Browse', icon: '🛍️' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', cursor: 'pointer', borderTop: activeTab === tab.id ? '2px solid #4CAF50' : '2px solid transparent' }}><span style={{ fontSize: '18px', color: activeTab === tab.id ? '#4CAF50' : '#5A4A2A' }}>{tab.icon}</span><span style={{ fontSize: '11px', color: activeTab === tab.id ? '#4CAF50' : '#5A4A2A', fontWeight: '500' }}>{tab.label}</span></button>
        ))}
      </div>}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }
        @keyframes scanLine { 0%, 100% { top: 8px; } 50% { top: calc(100% - 10px); } }
        @keyframes modalPop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes toastSlide { from { transform: translateX(-50%) translateY(20px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(200px) rotate(720deg); opacity: 0; } }
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>
    </div>
  )
}