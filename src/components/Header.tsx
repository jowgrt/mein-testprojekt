
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scan, LayoutGrid, Search, Menu, X, UtensilsCrossed } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-apple ${
        scrolled ? 'bg-white/80 backdrop-blur-glass shadow-subtle' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex items-center"
        >
          <span className="text-lg font-medium">Pantry</span>
          <span className="ml-1 text-lg font-light text-primary">Scan</span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1">
          <NavButton 
            icon={<Scan size={18} />}
            label="Scan"
            isActive={activeTab === 'scan'}
            onClick={() => setActiveTab('scan')}
          />
          <NavButton 
            icon={<LayoutGrid size={18} />}
            label="Inventory"
            isActive={activeTab === 'inventory'}
            onClick={() => setActiveTab('inventory')}
          />
          <NavButton 
            icon={<UtensilsCrossed size={18} />}
            label="Cooking"
            isActive={activeTab === 'cooking'}
            onClick={() => setActiveTab('cooking')}
          />
          <NavButton 
            icon={<Search size={18} />}
            label="Search"
            isActive={activeTab === 'search'}
            onClick={() => setActiveTab('search')}
          />
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-glass shadow-subtle md:hidden"
          >
            <div className="container mx-auto py-4 space-y-2">
              <MobileNavButton
                icon={<Scan size={18} />}
                label="Scan Receipt"
                isActive={activeTab === 'scan'}
                onClick={() => {
                  setActiveTab('scan');
                  setMobileMenuOpen(false);
                }}
              />
              <MobileNavButton
                icon={<LayoutGrid size={18} />}
                label="Inventory"
                isActive={activeTab === 'inventory'}
                onClick={() => {
                  setActiveTab('inventory');
                  setMobileMenuOpen(false);
                }}
              />
              <MobileNavButton
                icon={<UtensilsCrossed size={18} />}
                label="Cooking"
                isActive={activeTab === 'cooking'}
                onClick={() => {
                  setActiveTab('cooking');
                  setMobileMenuOpen(false);
                }}
              />
              <MobileNavButton
                icon={<Search size={18} />}
                label="Search Items"
                isActive={activeTab === 'search'}
                onClick={() => {
                  setActiveTab('search');
                  setMobileMenuOpen(false);
                }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavButton = ({ icon, label, isActive, onClick }: NavButtonProps) => (
  <Button
    variant={isActive ? "secondary" : "ghost"}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
      isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
    }`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </Button>
);

const MobileNavButton = ({ icon, label, isActive, onClick }: NavButtonProps) => (
  <Button
    variant={isActive ? "secondary" : "ghost"}
    className={`flex items-center w-full justify-start space-x-2 px-4 py-6 rounded-lg transition-all duration-200 ${
      isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
    }`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </Button>
);

export default Header;
