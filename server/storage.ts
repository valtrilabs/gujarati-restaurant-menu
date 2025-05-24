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
    // Create default categories
    const defaultCategories: InsertCategory[] = [
      { name: "sabji", displayName: "Sabji", icon: "fas fa-leaf", color: "green", order: 1 },
      { name: "farsan", displayName: "Farsan", icon: "fas fa-cookie-bite", color: "orange", order: 2 },
      { name: "sweet", displayName: "Sweet", icon: "fas fa-candy-cane", color: "pink", order: 3 },
      { name: "evening", displayName: "Evening Specials", icon: "fas fa-moon", color: "purple", order: 4 },
      { name: "beverages", displayName: "Beverages", icon: "fas fa-glass-whiskey", color: "blue", order: 5 },
    ];

    defaultCategories.forEach(cat => {
      const category: Category = { ...cat, id: this.categoryIdCounter++ };
      this.categories.set(category.id, category);
    });

    // Create default menu items
    const defaultMenuItems: InsertMenuItem[] = [
      // Sabji items
      { name: "Aloo Gobi", description: "Fresh & Spicy", categoryId: 1, isAvailable: true, order: 1 },
      { name: "Dal Tadka", description: "Rich & Creamy", categoryId: 1, isAvailable: true, order: 2 },
      { name: "Mix Veg", description: "Garden Fresh", categoryId: 1, isAvailable: true, order: 3 },
      { name: "Bhindi Masala", description: "Crispy & Flavorful", categoryId: 1, isAvailable: true, order: 4 },
      
      // Farsan items
      { name: "Dhokla", description: "Steamed & Soft", categoryId: 2, isAvailable: true, order: 1 },
      { name: "Khandvi", description: "Rolled Delight", categoryId: 2, isAvailable: true, order: 2 },
      { name: "Thepla", description: "Spiced Flatbread", categoryId: 2, isAvailable: true, order: 3 },
      
      // Sweet items
      { name: "Gulab Jamun", description: "Sweet & Juicy", categoryId: 3, isAvailable: true, order: 1 },
      { name: "Mohanthal", description: "Rich & Nutty", categoryId: 3, isAvailable: true, order: 2 },
      { name: "Jalebi", description: "Crispy & Sweet", categoryId: 3, isAvailable: true, order: 3 },
      
      // Evening items
      { name: "Chole Bhature", description: "", price: 12000, categoryId: 4, isAvailable: true, order: 1 },
      { name: "Pav Bhaji", description: "", price: 10000, categoryId: 4, isAvailable: true, order: 2 },
      
      // Beverages
      { name: "Cold Drinks", description: "", price: 3000, categoryId: 5, isAvailable: true, order: 1 },
      { name: "Lassi", description: "", price: 4000, categoryId: 5, isAvailable: true, order: 2 },
      { name: "Buttermilk", description: "Fresh & Cool", price: 2500, categoryId: 5, isAvailable: true, order: 3 },
    ];

    defaultMenuItems.forEach(item => {
      const menuItem: MenuItem = { 
        ...item, 
        id: this.menuItemIdCounter++,
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
    const newCategory: Category = { ...category, id: this.categoryIdCounter++ };
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
      ...item, 
      id: this.menuItemIdCounter++,
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
