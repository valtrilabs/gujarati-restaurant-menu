import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMenuItemSchema, insertCategorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories endpoints
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/with-items", async (req, res) => {
    try {
      const categoriesWithItems = await storage.getCategoriesWithItems();
      res.json(categoriesWithItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories with items" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create category" });
      }
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, updates);
      
      if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
      }
      
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update category" });
      }
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCategory(id);
      
      if (!success) {
        res.status(404).json({ message: "Category not found" });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Menu items endpoints
  app.get("/api/menu-items", async (req, res) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.get("/api/menu-items/with-category", async (req, res) => {
    try {
      const items = await storage.getMenuItemsWithCategory();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items with categories" });
    }
  });

  app.post("/api/menu-items", async (req, res) => {
    try {
      const itemData = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create menu item" });
      }
    }
  });

  app.put("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertMenuItemSchema.partial().parse(req.body);
      const item = await storage.updateMenuItem(id, updates);
      
      if (!item) {
        res.status(404).json({ message: "Menu item not found" });
        return;
      }
      
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update menu item" });
      }
    }
  });

  app.put("/api/menu-items/:id/toggle", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.toggleItemAvailability(id);
      
      if (!item) {
        res.status(404).json({ message: "Menu item not found" });
        return;
      }
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle item availability" });
    }
  });

  app.delete("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMenuItem(id);
      
      if (!success) {
        res.status(404).json({ message: "Menu item not found" });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete menu item" });
    }
  });

  // Analytics endpoint
  app.get("/api/analytics", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      const items = await storage.getMenuItems();
      const availableItems = items.filter(item => item.isAvailable);
      
      res.json({
        totalCategories: categories.length,
        totalItems: items.length,
        availableItems: availableItems.length,
        viewsToday: Math.floor(Math.random() * 200) + 50, // Mock data for demo
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
