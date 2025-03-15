
import { motion } from 'framer-motion';
import { Clock, UtensilsCrossed, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recipe } from '@/utils/recipes';
import { InventoryItem } from '@/utils/scanner';

interface RecipeCardProps {
  recipe: Recipe;
  matchPercentage: number;
  expiringIngredients?: InventoryItem[];
  onClick: () => void;
  index: number;
}

const RecipeCard = ({ 
  recipe, 
  matchPercentage, 
  expiringIngredients = [], 
  onClick,
  index
}: RecipeCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
        <CardContent className="p-0">
          <div className="relative">
            {recipe.image && (
              <div className="w-full h-32 overflow-hidden">
                <img 
                  src={recipe.image} 
                  alt={recipe.name} 
                  className="w-full h-full object-cover" 
                />
                
                {/* Match percentage indicator */}
                <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
                  {matchPercentage}% match
                </div>
                
                {/* Expiring ingredients indicator */}
                {expiringIngredients.length > 0 && (
                  <div className="absolute top-2 left-2 bg-amber-500/90 backdrop-blur-sm rounded-full p-1">
                    <AlertTriangle className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            )}
            
            <div className="p-4">
              <h3 className="font-medium text-lg mb-1">{recipe.name}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                {recipe.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {recipe.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{recipe.cookingTime} min</span>
                </div>
                <div className="flex items-center">
                  <UtensilsCrossed className="h-3 w-3 mr-1" />
                  <span>{recipe.ingredients.length} ingredients</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>
              
              {/* Expiring ingredients list */}
              {expiringIngredients.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/60">
                  <div className="flex items-center text-amber-600 mb-1 text-xs font-medium">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    <span>Use these expiring items:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {expiringIngredients.map(item => (
                      <Badge key={item.id} variant="outline" className="text-xs bg-amber-50">
                        {item.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecipeCard;
