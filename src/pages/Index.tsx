
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Scanner from '@/components/Scanner';
import Inventory from '@/components/Inventory';
import Cooking from '@/components/Cooking';
import ItemDetail from '@/components/ItemDetail';
import { InventoryItem } from '@/utils/scanner';
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('scan');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const handleScanComplete = (items: InventoryItem[]) => {
    // Add new items to inventory
    setInventoryItems(prev => {
      const newItems = [...prev];
      
      // For each scanned item, either add it or update quantity if it already exists
      items.forEach(item => {
        const existingItemIndex = newItems.findIndex(i => 
          i.name.toLowerCase() === item.name.toLowerCase() && 
          i.category === item.category
        );
        
        if (existingItemIndex >= 0) {
          // Update existing item
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + item.quantity
          };
        } else {
          // Add new item
          newItems.push(item);
        }
      });
      
      return newItems;
    });
    
    // Switch to inventory tab to show the items
    setActiveTab('inventory');
    
    // Show success toast
    toast({
      title: "Items Added",
      description: `${items.length} item${items.length !== 1 ? 's' : ''} added to inventory.`,
      duration: 3000,
    });
  };

  const handleDeleteItem = (id: string) => {
    setInventoryItems(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Item Removed",
      description: "Item has been removed from your inventory.",
      duration: 3000,
    });
  };

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'scan':
        return <Scanner onScanComplete={handleScanComplete} />;
      case 'inventory':
        return (
          <Inventory 
            items={inventoryItems} 
            onSelectItem={setSelectedItem} 
          />
        );
      case 'cooking':
        return (
          <Cooking 
            items={inventoryItems}
            onSwitchToInventory={() => setActiveTab('inventory')}
          />
        );
      case 'search':
        // For now, the search view just shows inventory
        return (
          <Inventory 
            items={inventoryItems} 
            onSelectItem={setSelectedItem} 
          />
        );
      default:
        return <Scanner onScanComplete={handleScanComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <AnimatePresence mode="wait">
        {renderCurrentView()}
      </AnimatePresence>
      
      <ItemDetail 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
        onDelete={handleDeleteItem}
      />
    </div>
  );
};

export default Index;
