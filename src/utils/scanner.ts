
/**
 * Scanner utility functions for processing receipt images
 * In a real app, this would include OCR (Optical Character Recognition) 
 * functionality or API calls to a service like Google Cloud Vision
 */

// Mock receipt scanning function - in production this would use a real OCR service
export const scanReceipt = async (imageFile: File): Promise<{ success: boolean; items?: InventoryItem[]; error?: string }> => {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      try {
        // In a real app, this would process the image using OCR
        // For now, we'll return mock data
        resolve({
          success: true,
          items: generateMockItems()
        });
      } catch (error) {
        resolve({
          success: false,
          error: 'Failed to process receipt. Please try again.'
        });
      }
    }, 1500);
  });
};

// For demo purposes - generate random inventory items
export const generateMockItems = (): InventoryItem[] => {
  const mockItems: InventoryItem[] = [
    {
      id: generateId(),
      name: 'Organic Milk',
      category: 'Dairy',
      quantity: 1,
      unit: 'liter',
      expiryDate: addDays(new Date(), 7),
      price: 2.99,
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bWlsa3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: generateId(),
      name: 'Sourdough Bread',
      category: 'Bakery',
      quantity: 1,
      unit: 'loaf',
      expiryDate: addDays(new Date(), 5),
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1585478259715-1c093a7b7d3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c291cmRvdWdoJTIwYnJlYWR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: generateId(),
      name: 'Avocados',
      category: 'Produce',
      quantity: 3,
      unit: 'pieces',
      expiryDate: addDays(new Date(), 4),
      price: 3.99,
      image: 'https://images.unsplash.com/photo-1601039641847-7857b994d704?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YXZvY2Fkb3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: generateId(),
      name: 'Free-Range Eggs',
      category: 'Dairy',
      quantity: 12,
      unit: 'pieces',
      expiryDate: addDays(new Date(), 14),
      price: 3.49,
      image: 'https://images.unsplash.com/photo-1509479100390-67f4b366d591?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZWdnc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: generateId(),
      name: 'Organic Spinach',
      category: 'Produce',
      quantity: 1,
      unit: 'bag',
      expiryDate: addDays(new Date(), 6),
      price: 2.99,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3BpbmFjaHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: generateId(),
      name: 'Greek Yogurt',
      category: 'Dairy',
      quantity: 1,
      unit: 'container',
      expiryDate: addDays(new Date(), 10),
      price: 5.49,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8eW9ndXJ0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
    }
  ];
  
  return mockItems;
};

// Helper function to generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Helper function to add days to a date
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Format date to display nicely
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

// Format price with currency
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

// Get days until expiry
export const getDaysUntilExpiry = (expiryDate: Date): number => {
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Define types for our inventory items
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: Date;
  price: number;
  image?: string;
}
