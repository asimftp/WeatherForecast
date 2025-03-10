import React from "react";
import { Link } from "wouter";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { CloudSun } from "lucide-react";
import Search from "@/components/weather/SearchBar";

interface HeaderProps {
    onSearch: (lat: string, lon: string, cityName?: string) => void;
}

/**
 * Header component with navigation and search bar.
 */
const Header: React.FC<HeaderProps> = ({ onSearch }) => {
    return (
        <header className="bg-[hsl(var(--header-background))] border-b border-border shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Logo and Branding */}
                    <Link href="/" className="flex items-center gap-2" aria-label="Go to Home">
                        <CloudSun className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                        <div className="flex flex-col">
                            <span className="font-bold text-lg sm:text-xl">Weather Forecast</span>
                            <span className="text-xs text-muted-foreground hidden sm:block">
                                Get accurate weather forecasts for any location
                            </span>
                        </div>
                    </Link>

                    {/* Search and Theme Toggle */}
                    <div className="flex items-center gap-4">
                        <div className="w-full md:w-64">
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