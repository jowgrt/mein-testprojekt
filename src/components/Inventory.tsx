
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, DollarSign, Filter, ChevronRight, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InventoryItem, formatDate, formatPrice, getDaysUntilExpiry } from '../utils/scanner';
import { useStaggeredFadeIn } from '../utils/animations';
import EmptyState from './EmptyState';

interface InventoryProps {
  items: InventoryItem[];
  onSelectItem: (item: InventoryItem) => void;
}

const Inventory = ({ items, onSelectItem }: InventoryProps) => {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const visibleItems = useStaggeredFadeIn(items, 50);

  useEffect(() => {
    // Extract unique categories from items
    const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
    setCategories(uniqueCategories);
  }, [items]);

  const filteredItems = filterCategory 
    ? items.filter(item => item.category === filterCategory)
    : items;

  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 pt-20 pb-16"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-3">
            Current Stock
          </span>
          <h1 className="text-3xl font-medium mb-2">Your Inventory</h1>
          <p className="text-muted-foreground">
            You have {items.length} items in your pantry
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex overflow-x-auto py-2 mb-4 no-scrollbar"
        >
          <Button
            variant={filterCategory === null ? "secondary" : "outline"}
            className="mr-2 flex-shrink-0"
            size="sm"
            onClick={() => setFilterCategory(null)}
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            All
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              variant={filterCategory === category ? "secondary" : "outline"}
              className="mr-2 flex-shrink-0"
              size="sm"
              onClick={() => setFilterCategory(category)}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        <div className="space-y-3">
          {filteredItems.map((item, index) => {
            const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
            const isExpiringSoon = daysUntilExpiry <= 3;
            const isVisible = visibleItems[index] || false;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
                transition={{ duration: 0.3 }}
                onClick={() => onSelectItem(item)}
              >
                <Card className="overflow-hidden transition-all duration-300 card-hover-effect hover:shadow-elevated cursor-pointer border border-border/40">
                  <CardContent className="p-0">
                    <div className="flex">
                      {item.image && (
                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-base sm:text-lg">{item.name}</h3>
                            <Badge variant="outline" className="ml-1 text-xs">
                              {item.category}
                            </Badge>
                          </div>
                          
                          <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              <span>{formatPrice(item.price)}</span>
                            </div>
                            <div className="flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              <span>{item.quantity} {item.unit}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{formatDate(item.expiryDate)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span className={isExpiringSoon ? 'text-destructive' : ''}>
                                {daysUntilExpiry <= 0 
                                  ? 'Expired' 
                                  : `${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''} left`
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-2">
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Inventory;
