import { categories, menuItems, type Category, type MenuItem, type InsertCategory, type InsertMenuItem, type CategoryWithItems, type MenuItemWithCategory } from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Menu Items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemById(id: number): Promise<MenuItem | undefined>;
  getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  toggleItemAvailability(id: number): Promise<MenuItem | undefined>;

  // Combined queries
  getCategoriesWithItems(): Promise<CategoryWithItems[]>;
  getMenuItemsWithCategory(): Promise<MenuItemWithCategory[]>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private menuItems: Map<number, MenuItem>;
  private categoryIdCounter: number;
  private menuItemIdCounter: number;

  constructor() {
    this.categories = new Map();
    this.menuItems = new Map();
    this.categoryIdCounter = 1;
    this.menuItemIdCounter = 1;
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default categories for lunch (Thali components)
    const defaultCategories: InsertCategory[] = [
      { name: "thali", displayName: "Gujarati Thali", icon: "fas fa-utensils", color: "green", order: 1, mealType: "lunch" },
      { name: "sabji", displayName: "Sabji", icon: "fas fa-leaf", color: "green", order: 2, mealType: "lunch" },
      { name: "farsan", displayName: "Farsan", icon: "fas fa-cookie-bite", color: "orange", order: 3, mealType: "lunch" },
      { name: "sweet", displayName: "Sweet", icon: "fas fa-candy-cane", color: "pink", order: 4, mealType: "lunch" },
      { name: "roti", displayName: "Roti & Rice", icon: "fas fa-bread-slice", color: "brown", order: 5, mealType: "lunch" },
      { name: "dinner", displayName: "Dinner Items", icon: "fas fa-moon", color: "purple", order: 1, mealType: "dinner" },
    ];

    defaultCategories.forEach(cat => {
      const category: Category = { 
        id: this.categoryIdCounter++,
        name: cat.name,
        displayName: cat.displayName,
        icon: cat.icon,
        color: cat.color,
        order: cat.order || 0,
        mealType: cat.mealType || "lunch"
      };
      this.categories.set(category.id, category);
    });

    // Create default menu items
    const defaultMenuItems: InsertMenuItem[] = [
      // Thali (Complete meal)
      { name: "Unlimited Gujarati Thali", description: "Complete traditional thali with unlimited servings", price: 20000, categoryId: 1, isAvailable: true, order: 1, mealType: "lunch" },
      
      // Sabji items (part of thali)
      { name: "Aloo Gobi", description: "Fresh & Spicy", categoryId: 2, isAvailable: true, order: 1, mealType: "lunch" },
      { name: "Dal Tadka", description: "Rich & Creamy", categoryId: 2, isAvailable: true, order: 2, mealType: "lunch" },
      { name: "Mix Veg", description: "Garden Fresh", categoryId: 2, isAvailable: true, order: 3, mealType: "lunch" },
      { name: "Bhindi Masala", description: "Crispy & Flavorful", categoryId: 2, isAvailable: true, order: 4, mealType: "lunch" },
      
      // Farsan items (part of thali)
      { name: "Dhokla", description: "Steamed & Soft", categoryId: 3, isAvailable: true, order: 1, mealType: "lunch" },
      { name: "Khandvi", description: "Rolled Delight", categoryId: 3, isAvailable: true, order: 2, mealType: "lunch" },
      { name: "Thepla", description: "Spiced Flatbread", categoryId: 3, isAvailable: true, order: 3, mealType: "lunch" },
      
      // Sweet items (part of thali)
      { name: "Gulab Jamun", description: "Sweet & Juicy", categoryId: 4, isAvailable: true, order: 1, mealType: "lunch" },
      { name: "Mohanthal", description: "Rich & Nutty", categoryId: 4, isAvailable: true, order: 2, mealType: "lunch" },
      { name: "Jalebi", description: "Crispy & Sweet", categoryId: 4, isAvailable: true, order: 3, mealType: "lunch" },
      
      // Roti & Rice (part of thali)
      { name: "Gujarati Roti", description: "Fresh & Soft", categoryId: 5, isAvailable: true, order: 1, mealType: "lunch" },
      { name: "Jeera Rice", description: "Aromatic", categoryId: 5, isAvailable: true, order: 2, mealType: "lunch" },
      
      // Dinner items (sold separately)
      { name: "Chole Bhature", description: "Spicy chickpeas with fried bread", price: 12000, categoryId: 6, isAvailable: true, order: 1, mealType: "dinner" },
      { name: "Pav Bhaji", description: "Mumbai street food special", price: 10000, categoryId: 6, isAvailable: true, order: 2, mealType: "dinner" },
    ];

    defaultMenuItems.forEach(item => {
      const menuItem: MenuItem = { 
        id: this.menuItemIdCounter++,
        name: item.name,
        description: item.description || null,
        price: item.price || null,
        categoryId: item.categoryId,
        isAvailable: item.isAvailable || true,
        imageUrl: item.imageUrl || null,
        order: item.order || 0,
        isSpecial: item.isSpecial || false,
        mealType: item.mealType || "lunch",
        createdAt: new Date()
      };
      this.menuItems.set(menuItem.id, menuItem);
    });
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => a.order - b.order);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = { 
      id: this.categoryIdCounter++,
      name: category.name,
      displayName: category.displayName,
      icon: category.icon,
      color: category.color,
      order: category.order || 0,
      mealType: category.mealType || "lunch"
    };
    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...updates };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).sort((a, b) => a.order - b.order);
  }

  async getMenuItemById(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values())
      .filter(item => item.categoryId === categoryId)
      .sort((a, b) => a.order - b.order);
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const newItem: MenuItem = { 
      id: this.menuItemIdCounter++,
      name: item.name,
      description: item.description || null,
      price: item.price || null,
      categoryId: item.categoryId,
      isAvailable: item.isAvailable || true,
      imageUrl: item.imageUrl || null,
      order: item.order || 0,
      isSpecial: item.isSpecial || false,
      mealType: item.mealType || "lunch",
      createdAt: new Date()
    };
    this.menuItems.set(newItem.id, newItem);
    return newItem;
  }

  async updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const item = this.menuItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates };
    this.menuItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  async toggleItemAvailability(id: number): Promise<MenuItem | undefined> {
    const item = this.menuItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, isAvailable: !item.isAvailable };
    this.menuItems.set(id, updatedItem);
    return updatedItem;
  }

  // Combined queries
  async getCategoriesWithItems(): Promise<CategoryWithItems[]> {
    const categories = await this.getCategories();
    const result: CategoryWithItems[] = [];
    
    for (const category of categories) {
      const items = await this.getMenuItemsByCategory(category.id);
      result.push({ ...category, items });
    }
    
    return result;
  }

  async getMenuItemsWithCategory(): Promise<MenuItemWithCategory[]> {
    const items = await this.getMenuItems();
    const result: MenuItemWithCategory[] = [];
    
    for (const item of items) {
      const category = await this.getCategoryById(item.categoryId);
      if (category) {
        result.push({ ...item, category });
      }
    }
    
    return result;
  }
}

export const storage = new MemStorage();
