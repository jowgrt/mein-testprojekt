
import { motion } from 'framer-motion';
import { ShoppingBag, Scan } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onScan?: () => void;
}

const EmptyState = ({ onScan }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto px-4 pt-20 pb-16 flex flex-col items-center justify-center h-[calc(100vh-4rem)]"
    >
      <div className="text-center max-w-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ShoppingBag className="h-12 w-12 text-primary" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-2xl font-medium mb-2"
        >
          Your pantry is empty
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-muted-foreground mb-6"
        >
          Scan your grocery receipts to automatically add items to your food inventory.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {onScan && (
            <Button
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={onScan}
            >
              <Scan className="h-4 w-4 mr-2" />
              Scan Receipt
            </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmptyState;
