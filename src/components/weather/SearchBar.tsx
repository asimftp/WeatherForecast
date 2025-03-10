import React, { memo } from "react";
import { Input } from "@/components/common/Input";
import { Loader2, Clock } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/common/Command";
import useWeatherSearch from "@/hooks/useWeatherSearch";
import { City } from "@/services/weatherService";

interface SearchProps {
  onSearch: (lat: string, lon: string, cityName?: string) => void;
  className?: string;
}

/**
 * Weather search component
 * 
 * @param props - Component props
 * @returns Search component
 */
const Search: React.FC<SearchProps> = ({ onSearch, className = "" }) => {
  const {
    value,
    cities,
    isLoading,
    selectedCity,
    recentSearches,
    handleSelect,
    handleInputChange,
    handleKeyDown,
    inputRef,
    dropdownRef,
    searchContainerRef,
    open,
    setOpen
  } = useWeatherSearch({ onSearch });

  // Show dropdown when input is focused, even if empty (to show recent searches)
  const handleFocus = () => {
    if (cities.length > 0 || (recentSearches.length > 0 && value.length === 0)) {
      setOpen(true);
    }
  };

  return (
    <div ref={searchContainerRef} className={`relative w-full max-w-sm ${className}`}>
      <div className="flex w-full items-center space-x-2">
        <div className="relative flex-grow">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for a city..."
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            className="w-full"
            aria-label="Search for a city"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
      
      {open && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full top-full mt-1 bg-background border rounded-md shadow-lg"
          style={{ maxHeight: '300px', overflowY: 'auto' }}
        >
          <Command>
            {cities.length === 0 && value.length > 0 && (
              <CommandEmpty>No results found</CommandEmpty>
            )}
            
            {cities.length > 0 && (
              <CommandGroup heading="Search Results">
                {cities.map((city) => (
                  <CommandItem
                    key={`${city.name}-${city.state || ''}-${city.country}-${city.lat}-${city.lon}`}
                    onSelect={() => handleSelect(city)}
                    className="cursor-pointer hover:bg-accent"
                  >
                    {city.name}
                    {city.state ? `, ${city.state}` : ''}
                    {city.country ? `, ${city.country}` : ''}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            
            {recentSearches.length > 0 && value.length === 0 && (
              <>
                {cities.length > 0 && <CommandSeparator />}
                <CommandGroup heading="Recent Searches">
                  {recentSearches.map((city, index) => (
                    <CommandItem
                      key={`recent-${index}`}
                      onSelect={() => handleSelect(city)}
                      className="cursor-pointer hover:bg-accent"
                    >
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {city.name}
                      {city.state ? `, ${city.state}` : ''}
                      {city.country ? `, ${city.country}` : ''}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </Command>
        </div>
      )}
    </div>
  );
};

export default memo(Search);