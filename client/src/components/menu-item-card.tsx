import { motion } from "framer-motion";
import type { MenuItem } from "@shared/schema";

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
}

const getImageUrl = (categoryId: number, itemName: string): string => {
  // Map different items to appropriate stock photos
  const imageMap: Record<string, string> = {
    // Sabji items
    "Aloo Gobi": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    "Dal Tadka": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    "Mix Veg": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    "Bhindi Masala": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    
    // Farsan items
    "Dhokla": "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    "Khandvi": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    "Thepla": "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    
    // Sweet items
    "Gulab Jamun": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    "Mohanthal": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    "Jalebi": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    
    // Evening items
    "Chole Bhature": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    "Pav Bhaji": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  };
  
  return imageMap[itemName] || "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100";
};

const formatPrice = (price?: number | null): string => {
  if (!price) return "";
  return `₹${(price / 100).toFixed(0)}`;
};

export function MenuItemCard({ item, index }: MenuItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="menu-item flex items-center justify-between py-3 px-3 rounded-lg mb-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-warm-cream hover:to-orange-50"
    >
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 shadow-sm">
          <img 
            src={getImageUrl(item.categoryId, item.name)} 
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100";
            }}
          />
        </div>
        <div>
          <h4 className="font-medium text-dark-brown">{item.name}</h4>
          <p className="text-sm text-gray-500">
            {item.description || formatPrice(item.price)}
          </p>
        </div>
      </div>
      <div className="text-right">
        {item.price && item.description && (
          <div className="text-sm font-medium text-dark-brown mb-1">
            {formatPrice(item.price)}
          </div>
        )}
        <span className={`inline-flex items-center text-sm ${
          item.isAvailable ? 'text-green-600' : 'text-red-500'
        }`}>
          <i className={`fas fa-circle text-xs mr-1 ${
            item.isAvailable ? 'text-green-500' : 'text-red-500'
          }`}></i>
          {item.isAvailable ? 'Available' : 'Unavailable'}
        </span>
      </div>
    </motion.div>
  );
}
