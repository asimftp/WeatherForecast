import React from 'react';
import { Link } from 'wouter';
import ThemeToggle from '@/components/layout/themeToggle';
import { CloudSun } from 'lucide-react';
import Search from '@/components/weather/search';

interface HeaderProps {
  onSearch: (lat: string, lon: string, cityName?: string) => void;
}

/**
 * Header component with navigation and search
 */
const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  return (
    <header className="bg-[hsl(var(--header-background))] border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <CloudSun className="h-6 w-6 text-blue-500 dark:text-blue-400" />
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl">Weather Forecast</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Get accurate weather forecasts for any location</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex-grow md:w-64">
              <Search onSearch={onSearch} />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 