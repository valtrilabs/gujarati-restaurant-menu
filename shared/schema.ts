import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  order: integer("order").notNull().default(0),
  mealType: text("meal_type").notNull().default("lunch"), // "lunch" or "dinner"
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price"), // in paise/cents
  categoryId: integer("category_id").notNull().references(() => categories.id),
  isAvailable: boolean("is_available").notNull().default(true),
  imageUrl: text("image_url"),
  order: integer("order").notNull().default(0),
  isSpecial: boolean("is_special").notNull().default(false),
  mealType: text("meal_type").notNull().default("lunch"), // "lunch" or "dinner"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

// Combined types for API responses
export type MenuItemWithCategory = MenuItem & {
  category: Category;
};

export type CategoryWithItems = Category & {
  items: MenuItem[];
};
