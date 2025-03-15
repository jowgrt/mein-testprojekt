
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, UtensilsCrossed, Filter, Check, Star, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { InventoryItem } from '@/utils/scanner';
import { Recipe, findMatchingRecipes } from '@/utils/recipes';
import RecipeCard from './RecipeCard';
import EmptyState from './EmptyState';

interface CookingProps {
  items: InventoryItem[];
  onSwitchToInventory: () => void;
}

const Cooking = ({ items, onSwitchToInventory }: CookingProps) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get matching recipes based on inventory
  const { recipes, matchPercentages, expiringIngredients } = findMatchingRecipes(items);
  
  // Filter recipes based on search query
  const filteredRecipes = recipes.filter(recipe => 
    searchQuery === '' || 
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  if (items.length === 0) {
    return (
      <EmptyState onScan={onSwitchToInventory} />
    );
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
            Recipe Suggestions
          </span>
          <h1 className="text-3xl font-medium mb-2">What's Cooking?</h1>
          <p className="text-muted-foreground">
            Discover recipes based on your pantry items
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative mb-6"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search recipes, ingredients or tags..."
            className="pl-10 bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>
        
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredRecipes.map((recipe, index) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                matchPercentage={matchPercentages[recipe.id]}
                expiringIngredients={expiringIngredients[recipe.id]}
                onClick={() => setSelectedRecipe(recipe)}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <UtensilsCrossed className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No recipes found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Try adjusting your search or add more items to your inventory to get recipe suggestions.
            </p>
          </motion.div>
        )}
      </div>
      
      {/* Recipe Detail Dialog */}
      <Dialog open={selectedRecipe !== null} onOpenChange={(open) => !open && setSelectedRecipe(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRecipe.name}</DialogTitle>
                <DialogDescription>
                  {selectedRecipe.description}
                </DialogDescription>
              </DialogHeader>
              
              {selectedRecipe.image && (
                <div className="w-full h-48 rounded-md overflow-hidden mb-4">
                  <img 
                    src={selectedRecipe.image} 
                    alt={selectedRecipe.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedRecipe.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{selectedRecipe.cookingTime} minutes</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{selectedRecipe.servings} servings</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Ingredients</h3>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients.map((ingredient, idx) => {
                    // Find if this ingredient is in the inventory
                    const inventoryItem = items.find(item => 
                      item.name.toLowerCase().includes(ingredient.name.toLowerCase()) ||
                      ingredient.name.toLowerCase().includes(item.name.toLowerCase())
                    );
                    
                    // Check if it's expiring soon
                    const isExpiring = inventoryItem && expiringIngredients[selectedRecipe.id]?.some(
                      item => item.id === inventoryItem.id
                    );
                    
                    return (
                      <li 
                        key={idx} 
                        className={`flex items-center ${
                          isExpiring ? 'bg-amber-50 px-2 py-1 rounded-md' : ''
                        }`}
                      >
                        {inventoryItem ? (
                          <Check className={`h-4 w-4 mr-2 ${isExpiring ? 'text-amber-600' : 'text-green-600'}`} />
                        ) : (
                          <span className="h-4 w-4 mr-2"></span>
                        )}
                        <span className={isExpiring ? 'text-amber-800 font-medium' : ''}>
                          {ingredient.amount} {ingredient.unit} {ingredient.name}
                          {ingredient.optional && <span className="text-muted-foreground"> (optional)</span>}
                        </span>
                        {isExpiring && (
                          <Badge variant="outline" className="ml-2 text-xs bg-amber-100 text-amber-800">
                            Use soon
                          </Badge>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Instructions</h3>
                <ol className="space-y-3 list-decimal list-inside">
                  {selectedRecipe.instructions.map((instruction, idx) => (
                    <li key={idx} className="pl-2 text-sm">
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedRecipe(null)}
                  className="flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Button className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  Save Recipe
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Cooking;
