
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, DollarSign, Clock, Trash2, Edit, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { InventoryItem, formatDate, formatPrice, getDaysUntilExpiry } from '../utils/scanner';

interface ItemDetailProps {
  item: InventoryItem | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const ItemDetail = ({ item, onClose, onDelete }: ItemDetailProps) => {
  if (!item) return null;
  
  const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
  const isExpiringSoon = daysUntilExpiry <= 3;
  const isExpired = daysUntilExpiry <= 0;

  const handleDelete = () => {
    onDelete(item.id);
    onClose();
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-card w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-glass overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Image Header */}
          <div className="relative h-52">
            {item.image ? (
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center">
                <Tag className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 rounded-full bg-background/80 backdrop-blur-glass hover:bg-background"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="absolute bottom-0 left-0 right-0 px-5 py-3 bg-gradient-to-t from-black/70 to-transparent">
              <h2 className="text-white text-xl font-medium">{item.name}</h2>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-secondary/50 px-3 py-1 rounded-full">
                <span className="text-sm">{item.category}</span>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-sm ${
                isExpired 
                  ? 'bg-destructive/10 text-destructive' 
                  : isExpiringSoon 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-green-100 text-green-700'
              }`}>
                {isExpired 
                  ? 'Expired' 
                  : isExpiringSoon 
                    ? `Expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}` 
                    : 'Fresh'
                }
              </div>
            </div>
            
            <div className="space-y-4">
              <DetailItem 
                icon={<Tag className="h-5 w-5 text-muted-foreground" />}
                label="Quantity"
                value={`${item.quantity} ${item.unit}`}
              />
              
              <DetailItem 
                icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
                label="Price"
                value={formatPrice(item.price)}
              />
              
              <DetailItem 
                icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
                label="Expiry Date"
                value={formatDate(item.expiryDate)}
              />
              
              <DetailItem 
                icon={<Clock className="h-5 w-5 text-muted-foreground" />}
                label="Days Until Expiry"
                value={`${daysUntilExpiry <= 0 ? 'Expired' : `${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`}`}
                highlight={isExpiringSoon}
              />
            </div>
            
            <div className="mt-6 flex space-x-3">
              <Button
                variant="outline"
                className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
              
              <Button className="flex-1" variant="default">
                <Edit className="h-4 w-4 mr-2" />
                Edit Item
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}

const DetailItem = ({ icon, label, value, highlight = false }: DetailItemProps) => (
  <div className="flex items-center">
    <div className="mr-3">{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={highlight ? 'text-destructive font-medium' : ''}>{value}</p>
    </div>
  </div>
);

export default ItemDetail;
