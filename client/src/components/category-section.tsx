import { motion } from "framer-motion";
import type { CategoryWithItems } from "@shared/schema";
import { MenuItemCard } from "./menu-item-card";

interface CategorySectionProps {
  category: CategoryWithItems;
  index: number;
}

const getCategoryGradient = (color: string): string => {
  const gradients: Record<string, string> = {
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600", 
    pink: "from-pink-500 to-pink-600",
    purple: "from-purple-500 to-purple-600",
    blue: "from-blue-500 to-blue-600",
  };
  
  return gradients[color] || "from-gray-500 to-gray-600";
};

const getCategoryDescription = (name: string): string => {
  const descriptions: Record<string, string> = {
    sabji: "Fresh Vegetables",
    farsan: "Crunchy Delights",
    sweet: "Divine Desserts",
    evening: "Evening Delights",
    beverages: "Cool & Refreshing",
  };
  
  return descriptions[name] || "Delicious Items";
};

export function CategorySection({ category, index }: CategorySectionProps) {
  const availableItems = category.items.filter(item => item.isAvailable);
  
  if (availableItems.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      className="category-card bg-white rounded-2xl shadow-lg mb-6 overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
    >
      <div className={`bg-gradient-to-r ${getCategoryGradient(category.color)} p-4`}>
        <div className="flex items-center text-white">
          <i className={`${category.icon} text-2xl mr-3`}></i>
          <div>
            <h3 className="text-xl font-semibold">{category.displayName}</h3>
            <p className="text-white/80 text-sm">
              {getCategoryDescription(category.name)}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4">
        {availableItems.map((item, itemIndex) => (
          <MenuItemCard key={item.id} item={item} index={itemIndex} />
        ))}
      </div>
    </motion.div>
  );
}
