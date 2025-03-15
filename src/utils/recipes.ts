
import { InventoryItem } from './scanner';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  cookingTime: number; // minutes
  servings: number;
  ingredients: {
    name: string;
    amount: number;
    unit: string;
    optional?: boolean;
  }[];
  instructions: string[];
  image?: string;
  tags: string[];
}

export const DEFAULT_RECIPES: Recipe[] = [
  {
    id: "1",
    name: "Pasta with Tomato Sauce",
    description: "A simple and delicious pasta dish with fresh tomato sauce",
    cookingTime: 20,
    servings: 2,
    ingredients: [
      { name: "pasta", amount: 200, unit: "g" },
      { name: "tomato", amount: 3, unit: "whole" },
      { name: "garlic", amount: 2, unit: "cloves" },
      { name: "olive oil", amount: 2, unit: "tbsp" },
      { name: "basil", amount: 5, unit: "leaves", optional: true },
      { name: "salt", amount: 1, unit: "tsp" },
      { name: "pepper", amount: 1, unit: "tsp" }
    ],
    instructions: [
      "Boil water in a large pot and cook pasta according to package instructions.",
      "While pasta is cooking, heat olive oil in a pan over medium heat.",
      "Add minced garlic and sauté until fragrant.",
      "Add diced tomatoes and cook for 7-10 minutes until they break down.",
      "Season with salt and pepper to taste.",
      "Drain pasta and mix with sauce.",
      "Garnish with fresh basil leaves if available."
    ],
    image: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1008&q=80",
    tags: ["Italian", "Vegetarian", "Quick"]
  },
  {
    id: "2",
    name: "Chicken Stir Fry",
    description: "A quick and healthy stir fry with chicken and vegetables",
    cookingTime: 25,
    servings: 2,
    ingredients: [
      { name: "chicken", amount: 300, unit: "g" },
      { name: "bell pepper", amount: 1, unit: "whole" },
      { name: "carrot", amount: 1, unit: "whole" },
      { name: "broccoli", amount: 1, unit: "cup" },
      { name: "soy sauce", amount: 2, unit: "tbsp" },
      { name: "garlic", amount: 2, unit: "cloves" },
      { name: "ginger", amount: 1, unit: "thumb" },
      { name: "vegetable oil", amount: 1, unit: "tbsp" },
      { name: "rice", amount: 1, unit: "cup", optional: true }
    ],
    instructions: [
      "Cut chicken into bite-sized pieces.",
      "Slice vegetables into thin strips.",
      "Heat oil in a wok or large frying pan over high heat.",
      "Add chicken and cook until golden brown.",
      "Add garlic and ginger, stir for 30 seconds.",
      "Add vegetables and stir fry for 3-5 minutes until crisp-tender.",
      "Add soy sauce and stir to combine.",
      "Serve over rice if desired."
    ],
    image: "https://images.unsplash.com/photo-1655881995101-1632ebab0070?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    tags: ["Asian", "Protein", "Healthy"]
  },
  {
    id: "3",
    name: "Vegetable Omelette",
    description: "A fluffy omelette packed with fresh vegetables",
    cookingTime: 15,
    servings: 1,
    ingredients: [
      { name: "eggs", amount: 3, unit: "whole" },
      { name: "milk", amount: 2, unit: "tbsp" },
      { name: "cheese", amount: 30, unit: "g", optional: true },
      { name: "bell pepper", amount: 0.5, unit: "whole" },
      { name: "tomato", amount: 1, unit: "small" },
      { name: "spinach", amount: 1, unit: "handful" },
      { name: "salt", amount: 1, unit: "pinch" },
      { name: "pepper", amount: 1, unit: "pinch" },
      { name: "butter", amount: 1, unit: "tbsp" }
    ],
    instructions: [
      "Beat eggs and milk in a bowl. Season with salt and pepper.",
      "Dice vegetables into small pieces.",
      "Melt butter in a non-stick pan over medium heat.",
      "Add vegetables and sauté for 2 minutes.",
      "Pour egg mixture over vegetables.",
      "Cook until the bottom is set but the top is still runny.",
      "Sprinkle cheese on top if using.",
      "Fold omelette in half and cook for another minute.",
      "Serve hot."
    ],
    image: "https://images.unsplash.com/photo-1568625365788-98613c5d6b44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    tags: ["Breakfast", "Quick", "Vegetarian"]
  }
];

// Function to find matching recipes based on inventory
export function findMatchingRecipes(inventory: InventoryItem[], recipes: Recipe[] = DEFAULT_RECIPES): {
  recipes: Recipe[];
  matchPercentages: Record<string, number>;
  expiringIngredients: Record<string, InventoryItem[]>;
} {
  const matchPercentages: Record<string, number> = {};
  const expiringIngredients: Record<string, InventoryItem[]> = {};
  
  // Get the current date
  const now = new Date();
  
  // Find expiring ingredients (within 3 days)
  const expiringItems = inventory.filter(item => {
    const expiryDate = new Date(item.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 3 && daysUntilExpiry > 0;
  });
  
  recipes.forEach(recipe => {
    let matchCount = 0;
    const matchingExpiring: InventoryItem[] = [];
    
    // For each ingredient in the recipe
    recipe.ingredients.forEach(ingredient => {
      // Check if the ingredient is in the inventory
      const inventoryItem = inventory.find(item => 
        item.name.toLowerCase().includes(ingredient.name.toLowerCase()) || 
        ingredient.name.toLowerCase().includes(item.name.toLowerCase())
      );
      
      if (inventoryItem) {
        matchCount++;
        
        // Check if this inventory item is expiring soon
        const expiryDate = new Date(inventoryItem.expiryDate);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry <= 3 && daysUntilExpiry > 0) {
          matchingExpiring.push(inventoryItem);
        }
      }
    });
    
    // Calculate match percentage (excluding optional ingredients)
    const requiredIngredients = recipe.ingredients.filter(ingredient => !ingredient.optional);
    const matchPercentage = Math.round((matchCount / requiredIngredients.length) * 100);
    
    matchPercentages[recipe.id] = matchPercentage;
    
    if (matchingExpiring.length > 0) {
      expiringIngredients[recipe.id] = matchingExpiring;
    }
  });
  
  // Sort recipes by match percentage and whether they contain expiring ingredients
  const sortedRecipes = [...recipes].sort((a, b) => {
    // First prioritize recipes with expiring ingredients
    const aHasExpiring = expiringIngredients[a.id]?.length > 0;
    const bHasExpiring = expiringIngredients[b.id]?.length > 0;
    
    if (aHasExpiring && !bHasExpiring) return -1;
    if (!aHasExpiring && bHasExpiring) return 1;
    
    // Then by match percentage
    return matchPercentages[b.id] - matchPercentages[a.id];
  });
  
  return {
    recipes: sortedRecipes,
    matchPercentages,
    expiringIngredients
  };
}
