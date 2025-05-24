import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all origins (Vercel frontend)
app.use(cors());
app.use(express.json());

// In-memory storage for restaurant data
let categories = [
  { id: 1, name: "thali", displayName: "Gujarati Thali", icon: "🍽️", color: "green", order: 1, mealType: "lunch" },
  { id: 2, name: "sabji", displayName: "Sabji", icon: "🥬", color: "green", order: 2, mealType: "lunch" },
  { id: 3, name: "farsan", displayName: "Farsan", icon: "🍪", color: "orange", order: 3, mealType: "lunch" },
  { id: 4, name: "sweet", displayName: "Sweet", icon: "🍬", color: "pink", order: 4, mealType: "lunch" },
  { id: 5, name: "roti", displayName: "Roti & Rice", icon: "🍞", color: "brown", order: 5, mealType: "lunch" },
  { id: 6, name: "dinner", displayName: "Dinner Items", icon: "🌙", color: "purple", order: 1, mealType: "dinner" }
];

let menuItems = [
  // Thali (Complete meal)
  { id: 1, name: "Unlimited Gujarati Thali", description: "Complete traditional thali with unlimited servings", price: 20000, categoryId: 1, isAvailable: true, order: 1, mealType: "lunch" },
  
  // Sabji items (part of thali)
  { id: 2, name: "Aloo Gobi", description: "Fresh & Spicy", categoryId: 2, isAvailable: true, order: 1, mealType: "lunch" },
  { id: 3, name: "Dal Tadka", description: "Rich & Creamy", categoryId: 2, isAvailable: true, order: 2, mealType: "lunch" },
  { id: 4, name: "Mix Veg", description: "Garden Fresh", categoryId: 2, isAvailable: true, order: 3, mealType: "lunch" },
  { id: 5, name: "Bhindi Masala", description: "Crispy & Flavorful", categoryId: 2, isAvailable: true, order: 4, mealType: "lunch" },
  
  // Farsan items (part of thali)
  { id: 6, name: "Dhokla", description: "Steamed & Soft", categoryId: 3, isAvailable: true, order: 1, mealType: "lunch" },
  { id: 7, name: "Khandvi", description: "Rolled Delight", categoryId: 3, isAvailable: true, order: 2, mealType: "lunch" },
  { id: 8, name: "Thepla", description: "Spiced Flatbread", categoryId: 3, isAvailable: true, order: 3, mealType: "lunch" },
  
  // Sweet items (part of thali)
  { id: 9, name: "Gulab Jamun", description: "Sweet & Juicy", categoryId: 4, isAvailable: true, order: 1, mealType: "lunch" },
  { id: 10, name: "Mohanthal", description: "Rich & Nutty", categoryId: 4, isAvailable: true, order: 2, mealType: "lunch" },
  { id: 11, name: "Jalebi", description: "Crispy & Sweet", categoryId: 4, isAvailable: true, order: 3, mealType: "lunch" },
  
  // Roti & Rice (part of thali)
  { id: 12, name: "Gujarati Roti", description: "Fresh & Soft", categoryId: 5, isAvailable: true, order: 1, mealType: "lunch" },
  { id: 13, name: "Jeera Rice", description: "Aromatic", categoryId: 5, isAvailable: true, order: 2, mealType: "lunch" },
  
  // Dinner items (sold separately)
  { id: 14, name: "Chole Bhature", description: "Spicy chickpeas with fried bread", price: 12000, categoryId: 6, isAvailable: true, order: 1, mealType: "dinner" },
  { id: 15, name: "Pav Bhaji", description: "Mumbai street food special", price: 10000, categoryId: 6, isAvailable: true, order: 2, mealType: "dinner" }
];

// Get categories with their items
app.get('/api/categories', (req, res) => {
  const categoriesWithItems = categories.map(category => ({
    ...category,
    items: menuItems.filter(item => item.categoryId === category.id && item.isAvailable)
  }));
  res.json(categoriesWithItems);
});

// Toggle item availability (admin)
app.put('/api/items/:id/toggle', (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = menuItems.find(item => item.id === itemId);
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  item.isAvailable = !item.isAvailable;
  res.json(item);
});

// Add new menu item (admin)
app.post('/api/items', (req, res) => {
  const { name, description, price, categoryId, mealType } = req.body;
  
  const newItem = {
    id: Math.max(...menuItems.map(item => item.id)) + 1,
    name,
    description: description || '',
    price: price ? parseInt(price * 100) : null, // Convert to paise
    categoryId: parseInt(categoryId),
    isAvailable: true,
    order: menuItems.filter(item => item.categoryId === parseInt(categoryId)).length + 1,
    mealType: mealType || 'lunch'
  };
  
  menuItems.push(newItem);
  res.json(newItem);
});

// Delete menu item (admin)
app.delete('/api/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const itemIndex = menuItems.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  menuItems.splice(itemIndex, 1);
  res.json({ message: 'Item deleted successfully' });
});

// Analytics endpoint
app.get('/api/analytics', (req, res) => {
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter(item => item.isAvailable).length;
  const totalCategories = categories.length;
  
  res.json({
    totalItems,
    availableItems,
    totalCategories,
    viewsToday: Math.floor(Math.random() * 200) + 50 // Mock data
  });
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Gujarati Restaurant API is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});