
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Loader2, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { scanReceipt, InventoryItem } from '../utils/scanner';
import { useFadeIn } from '../utils/animations';

interface ScannerProps {
  onScanComplete: (items: InventoryItem[]) => void;
}

const Scanner = ({ onScanComplete }: ScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanMode, setScanMode] = useState<'camera' | 'upload'>('camera');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isFadedIn = useFadeIn(true, 300);

  const handleCapture = async (file: File) => {
    setIsScanning(true);
    
    try {
      const result = await scanReceipt(file);
      
      if (result.success && result.items) {
        setScanComplete(true);
        
        // Wait a moment to show success animation
        setTimeout(() => {
          onScanComplete(result.items);
        }, 1500);
      } else {
        toast({
          title: "Scan Failed",
          description: result.error || "Unable to process receipt. Please try again.",
          variant: "destructive",
        });
        setIsScanning(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsScanning(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleCapture(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isFadedIn ? 1 : 0, y: isFadedIn ? 0 : 10 }}
      className="container mx-auto px-4 pt-20 pb-16 min-h-[calc(100vh-4rem)]"
    >
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-3">
              Digital Pantry
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-3xl font-medium mb-2"
          >
            Scan Your Receipt
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-muted-foreground"
          >
            Automatically add groceries to your inventory by scanning your receipt.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="rounded-2xl overflow-hidden shadow-elevated bg-card mb-6"
        >
          <div className="relative h-[300px] bg-gray-100 flex items-center justify-center">
            {isScanning ? (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  {scanComplete ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
                        <Check className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-green-700 font-medium">Scan Complete!</p>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                      <p className="text-muted-foreground">Processing receipt...</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center px-6">
                {scanMode === 'camera' ? (
                  <>
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-1">Position your receipt in frame</p>
                    <p className="text-xs text-muted-foreground">For best results, place on a dark background</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-1">Drag & drop a receipt image</p>
                    <p className="text-xs text-muted-foreground">or click to browse files</p>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>

        <div className="flex flex-col space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="grid grid-cols-2 gap-3"
          >
            <Button
              variant="outline"
              className={`h-12 ${scanMode === 'camera' ? 'bg-secondary border-primary/20' : ''}`}
              onClick={() => setScanMode('camera')}
              disabled={isScanning}
            >
              <Camera size={18} className="mr-2" />
              Camera
            </Button>
            <Button
              variant="outline"
              className={`h-12 ${scanMode === 'upload' ? 'bg-secondary border-primary/20' : ''}`}
              onClick={() => setScanMode('upload')}
              disabled={isScanning}
            >
              <Upload size={18} className="mr-2" />
              Upload
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Button
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
              onClick={triggerFileInput}
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                scanMode === 'camera' ? 'Take Photo' : 'Select File'
              )}
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isScanning}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Scanner;
