import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem, useToggleMenuItem } from "@/hooks/use-menu";
import type { CategoryWithItems, MenuItem, InsertMenuItem } from "@shared/schema";

interface AdminItemManagerProps {
  category: CategoryWithItems;
}

export function AdminItemManager({ category }: AdminItemManagerProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const createMutation = useCreateMenuItem();
  const updateMutation = useUpdateMenuItem();
  const deleteMutation = useDeleteMenuItem();
  const toggleMutation = useToggleMenuItem();

  const handleAddItem = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Item name is required",
        variant: "destructive",
      });
      return;
    }

    const itemData: InsertMenuItem = {
      name: name.trim(),
      description: description.trim() || undefined,
      price: priceStr ? Math.round(parseFloat(priceStr) * 100) : undefined,
      categoryId: category.id,
      isAvailable: true,
      order: category.items.length + 1,
      isSpecial: false,
    };

    try {
      await createMutation.mutateAsync(itemData);
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Item added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = async (formData: FormData) => {
    if (!editingItem) return;
    
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Item name is required",
        variant: "destructive",
      });
      return;
    }

    const updates: Partial<InsertMenuItem> = {
      name: name.trim(),
      description: description.trim() || undefined,
      price: priceStr ? Math.round(parseFloat(priceStr) * 100) : undefined,
    };

    try {
      await updateMutation.mutateAsync({ id: editingItem.id, data: updates });
      setIsEditDialogOpen(false);
      setEditingItem(null);
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      await deleteMutation.mutateAsync(itemId);
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const handleToggleAvailability = async (itemId: number) => {
    try {
      await toggleMutation.mutateAsync(itemId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle item availability",
        variant: "destructive",
      });
    }
  };

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

  const formatPrice = (price?: number | null): string => {
    if (!price) return "";
    return (price / 100).toFixed(2);
  };

  return (
    <Card className="overflow-hidden">
      <div className={`bg-gradient-to-r ${getCategoryGradient(category.color)} p-4 flex items-center justify-between cursor-pointer`}
           onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center text-white">
          <i className={`${category.icon} mr-3`}></i>
          <span className="font-semibold">{category.displayName}</span>
          <span className="ml-2 text-sm text-white/80">({category.items.length})</span>
        </div>
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="p-4">
              {category.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 bg-${category.color}-100 rounded-lg flex items-center justify-center mr-3`}>
                      <i className={`${category.icon} text-${category.color}-600`}></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-dark-brown">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        {item.description && item.price 
                          ? `${item.description} • ₹${formatPrice(item.price)}`
                          : item.description || (item.price ? `₹${formatPrice(item.price)}` : "")
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={item.isAvailable}
                      onCheckedChange={() => handleToggleAvailability(item.id)}
                      disabled={toggleMutation.isPending}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingItem(item);
                        setIsEditDialogOpen(true);
                      }}
                      disabled={updateMutation.isPending}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`w-full mt-3 border-2 border-dashed border-${category.color}-300 text-${category.color}-600 hover:bg-${category.color}-50`}
                    disabled={createMutation.isPending}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add {category.displayName} Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New {category.displayName} Item</DialogTitle>
                  </DialogHeader>
                  <form action={handleAddItem} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Item Name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div>
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Input id="description" name="description" />
                    </div>
                    <div>
                      <Label htmlFor="price">Price (Optional)</Label>
                      <Input id="price" name="price" type="number" step="0.01" placeholder="0.00" />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Adding..." : "Add Item"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit {editingItem?.name}</DialogTitle>
                  </DialogHeader>
                  <form action={handleEditItem} className="space-y-4">
                    <div>
                      <Label htmlFor="edit-name">Item Name</Label>
                      <Input 
                        id="edit-name" 
                        name="name" 
                        defaultValue={editingItem?.name}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-description">Description</Label>
                      <Input 
                        id="edit-description" 
                        name="description" 
                        defaultValue={editingItem?.description || ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-price">Price</Label>
                      <Input 
                        id="edit-price" 
                        name="price" 
                        type="number" 
                        step="0.01"
                        defaultValue={editingItem?.price ? formatPrice(editingItem.price) : ""}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? "Updating..." : "Update Item"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
