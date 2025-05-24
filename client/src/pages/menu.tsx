import { motion } from "framer-motion";
import { useMenu } from "@/hooks/use-menu";
import { CategorySection } from "@/components/category-section";
import { QRCodeGenerator } from "@/components/qr-code-generator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function MenuPage() {
  const { data: categories, isLoading, error } = useMenu();
  const [activeTab, setActiveTab] = useState<"lunch" | "dinner">("lunch");

  const lunchCategories = categories?.filter(cat => cat.mealType === "lunch") || [];
  const dinnerCategories = categories?.filter(cat => cat.mealType === "dinner") || [];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-cream">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-dark-brown mb-2">Unable to Load Menu</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-saffron to-warm-brown text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }} 
          className="absolute inset-0"
        ></div>
        <div className="relative max-w-md mx-auto px-6 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl font-bold mb-2 font-devanagari">
              Gujarat Thali Express
            </h1>
            <p className="text-lg opacity-90 mb-4">Authentic Gujarati Cuisine</p>
            <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm mb-4">
              <i className="fas fa-clock mr-2 text-golden"></i>
              <span className="text-sm">
                Fresh Menu - {new Date().toLocaleDateString('en-IN', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

          </motion.div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="max-w-md mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <QRCodeGenerator />
        </motion.div>
      </div>

      {/* Meal Type Tabs */}
      <div className="max-w-md mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-2 mb-6"
        >
          <div className="flex space-x-2">
            <Button
              variant={activeTab === "lunch" ? "default" : "ghost"}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === "lunch" 
                  ? "bg-saffron text-white hover:bg-saffron/90" 
                  : "text-saffron hover:bg-saffron/10"
              }`}
              onClick={() => setActiveTab("lunch")}
            >
              🍽️ Gujarati Thali (Lunch)
            </Button>
            <Button
              variant={activeTab === "dinner" ? "default" : "ghost"}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === "dinner" 
                  ? "bg-saffron text-white hover:bg-saffron/90" 
                  : "text-saffron hover:bg-saffron/10"
              }`}
              onClick={() => setActiveTab("dinner")}
            >
              🌙 Dinner
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Menu Content */}
      <div className="max-w-md mx-auto px-6 mb-8">
        {activeTab === "lunch" && (
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-dark-brown mb-2">આજનું થાળી</h2>
            <p className="text-gray-600">Today's Special Thali - ₹200 (Unlimited)</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
              <p className="text-sm text-green-700 font-medium">🍽️ Complete unlimited meal with all items below</p>
            </div>
          </motion.div>
        )}

        {activeTab === "dinner" && (
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-dark-brown mb-2">સાંજનું ખાવાનું</h2>
            <p className="text-gray-600">Evening Dinner Items</p>
          </motion.div>
        )}

        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <Skeleton className="h-20 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {(activeTab === "lunch" ? lunchCategories : dinnerCategories).map((category, index) => (
              <CategorySection 
                key={category.id} 
                category={category} 
                index={index} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
