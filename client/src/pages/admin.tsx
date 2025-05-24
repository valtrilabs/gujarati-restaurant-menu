import { motion } from "framer-motion";
import { useMenu, useAnalytics } from "@/hooks/use-menu";
import { AdminItemManager } from "@/components/admin-item-manager";
import { QRCodeGenerator } from "@/components/qr-code-generator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Crown, Plus, Edit, BarChart3, QrCode } from "lucide-react";

export default function AdminPage() {
  const { data: categories, isLoading } = useMenu();
  const { data: analytics } = useAnalytics();
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-cream pt-4 pb-8">
        <div className="max-w-md mx-auto px-6 space-y-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream pt-4 pb-8">
      {/* Admin Header */}
      <div className="max-w-md mx-auto px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-dark-brown">Admin Dashboard</h2>
                  <p className="text-gray-600">Manage today's menu</p>
                </div>
                <div className="w-12 h-12 bg-saffron rounded-xl flex items-center justify-center">
                  <Crown className="text-white w-6 h-6" />
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {analytics?.availableItems || 0}
                  </div>
                  <div className="text-xs text-green-600">Available</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {analytics?.totalCategories || 0}
                  </div>
                  <div className="text-xs text-yellow-600">Categories</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analytics?.viewsToday || 0}
                  </div>
                  <div className="text-xs text-blue-600">Views Today</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-md mx-auto px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-dark-brown mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:scale-105 transition-transform h-auto"
                  onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Add Item</span>
                </Button>
                <Button 
                  className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:scale-105 transition-transform h-auto"
                  onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Bulk Edit</span>
                </Button>
                <Button 
                  className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:scale-105 transition-transform h-auto"
                  onClick={() => alert('Analytics feature coming soon!')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Analytics</span>
                </Button>
                
                <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center justify-center p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:scale-105 transition-transform h-auto">
                      <QrCode className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">QR Code</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Menu QR Code</DialogTitle>
                    </DialogHeader>
                    <QRCodeGenerator />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Menu Management Sections */}
      <div className="max-w-md mx-auto px-6 space-y-6">
        {categories?.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
          >
            <AdminItemManager category={category} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
