import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useToast } from "./useToast";
import { useGeocode } from "./useWeatherData";
import weatherService, { City } from "../services/weatherService";

// Debounce delay in milliseconds
const DEBOUNCE_DELAY = 300;
// Maximum number of recent searches to store
const MAX_RECENT_SEARCHES = 5;

interface UseWeatherSearchProps {
  onSearch: (lat: string, lon: string, cityName?: string) => void;
}

interface UseWeatherSearchResult {
  value: string;
  setValue: (value: string) => void;
  cities: City[];
  isLoading: boolean;
  selectedCity: City | null;
  recentSearches: City[];
  handleSelect: (city: City) => void;
  handleSearchButtonClick: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  dropdownRef: React.RefObject<HTMLDivElement>;
  searchContainerRef: React.RefObject<HTMLDivElement>;
  open: boolean;
  setOpen: (open: boolean) => void;
}

/**
 * Custom hook for weather search functionality
 * 
 * @param props - Props containing onSearch callback
 * @returns Search state and handlers
 */
export function useWeatherSearch({ onSearch }: UseWeatherSearchProps): UseWeatherSearchResult {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [recentSearches, setRecentSearches] = useState<City[]>([]);
  const [skipSearch, setSkipSearch] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  const { toast } = useToast();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const isSearchingRef = useRef(false);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const savedSearches = localStorage.getItem("recentSearches");
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches));
      }
    } catch (error) {
      console.error("Failed to load recent searches:", error);
      localStorage.removeItem("recentSearches");
      setRecentSearches([]);
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    // Skip search if value is too short
    if (value.length < 2) {
      setDebouncedQuery("");
      return;
    }
    
    // Skip this search cycle if flag is set
    if (skipSearch) {
      setSkipSearch(false);
      return;
    }
    
    // Skip search for formatted city names with a selected city
    if (value.includes(',') && selectedCity) return;

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedQuery(value);
    }, DEBOUNCE_DELAY);
    
    // Cleanup on unmount or value change
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [value, skipSearch, selectedCity]);

  // Use the geocode hook for search
  const { data: rawCities = [], isLoading } = useGeocode(debouncedQuery, {
    enabled: debouncedQuery.length >= 2 && !debouncedQuery.includes(',')
  });

  // Deduplicate cities to prevent duplicate results
  const cities = useMemo(() => {
    if (!rawCities.length) return [];
    
    // Use a Map to deduplicate cities based on a unique key
    const uniqueCities = new Map<string, City>();
    
    rawCities.forEach(city => {
      // Create a unique key for each city
      const key = `${city.name}-${city.state || ''}-${city.country}-${city.lat}-${city.lon}`;
      
      // Only add if not already in the map
      if (!uniqueCities.has(key)) {
        uniqueCities.set(key, city);
      }
    });
    
    // Convert back to array
    return Array.from(uniqueCities.values());
  }, [rawCities]);

  // Update dropdown state when cities change
  useEffect(() => {
    if (cities.length > 0 && debouncedQuery) {
      setOpen(document.activeElement === inputRef.current);
    } else if (cities.length === 0 && debouncedQuery) {
      setOpen(false);
    }
  }, [cities, debouncedQuery]);

  // Save recent searches to localStorage
  const saveRecentSearches = useCallback((searches: City[]) => {
    try {
      localStorage.setItem("recentSearches", JSON.stringify(searches));
    } catch (error) {
      console.error("Failed to save recent searches:", error);
    }
  }, []);

  // Add a city to recent searches
  const addToRecentSearches = useCallback((city: City) => {
    setRecentSearches(prev => {
      // Remove duplicates
      const filtered = prev.filter(
        c => !(c.name === city.name && c.country === city.country && c.state === city.state)
      );
      
      // Add new city at the beginning and limit to MAX_RECENT_SEARCHES
      const newSearches = [city, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      
      // Save to localStorage
      saveRecentSearches(newSearches);
      
      return newSearches;
    });
  }, [saveRecentSearches]);

  // Handle city selection
  const handleSelect = useCallback((city: City) => {
    if (isSearchingRef.current) return;
    
    setSkipSearch(true);
    setSelectedCity(city);
    const cityName = weatherService.formatCityName(city);
    setValue(cityName);
    
    // Trigger search with the selected city
    onSearch(city.lat.toString(), city.lon.toString(), cityName);
    
    // Close dropdown
    setOpen(false);
    
    // Add to recent searches
    addToRecentSearches(city);
  }, [onSearch, addToRecentSearches]);

  // Handle search button click
  const handleSearchButtonClick = useCallback(() => {
    if (isSearchingRef.current) return;
    
    if (selectedCity) {
      // If we already have a selected city, just use it
      handleSelect(selectedCity);
    } else if (cities.length > 0) {
      // If we have search results, use the first one
      handleSelect(cities[0]);
    } else if (value.length >= 2) {
      // Only trigger a new search if we don't have results and the input is valid
      if (!isLoading) {
        isSearchingRef.current = true;
        
        // Force a fresh search to get the most up-to-date results
        weatherService.getGeocode(value, true)
          .then(data => {
            if (data && Array.isArray(data) && data.length > 0) {
              // We got results, select the first one
              const city = data[0];
              
              // Important: Set the selected city and update the input value
              // but DON'T trigger another search - we'll do that directly
              setSelectedCity(city);
              const cityName = weatherService.formatCityName(city);
              setValue(cityName);
              
              // Directly call onSearch with the city data
              onSearch(city.lat.toString(), city.lon.toString(), cityName);
              
              // Close dropdown and add to recent searches
              setOpen(false);
              addToRecentSearches(city);
            } else {
              toast({
                variant: "destructive",
                title: "No results",
                description: `No locations found for "${value}"`,
              });
            }
          })
          .catch(error => {
            console.error('Search error:', error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to search cities. Please try again.",
            });
          })
          .finally(() => {
            isSearchingRef.current = false;
          });
      }
    }
  }, [selectedCity, cities, value, isLoading, handleSelect, toast, onSearch, addToRecentSearches]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Clear selected city if input changes
    if (selectedCity && weatherService.formatCityName(selectedCity) !== newValue) {
      setSelectedCity(null);
    }
  }, [selectedCity]);

  // Handle input key press
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Use the improved handleSearchButtonClick function
      handleSearchButtonClick();
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'ArrowDown' && cities.length > 0 && open) {
      // Navigate to the first item in the dropdown
      e.preventDefault();
      const firstItem = document.querySelector('[cmdk-item]') as HTMLElement;
      if (firstItem) {
        firstItem.focus();
      }
    }
  }, [handleSearchButtonClick, cities.length, open]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle dropdown positioning on scroll
  useEffect(() => {
    if (open && dropdownRef.current) {
      const handleScroll = () => {
        if (searchContainerRef.current) {
          const rect = searchContainerRef.current.getBoundingClientRect();
          if (rect.bottom < 100 || rect.top > window.innerHeight - 100) {
            setOpen(false);
          }
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [open]);

  return {
    value,
    setValue,
    cities,
    isLoading,
    selectedCity,
    recentSearches,
    handleSelect,
    handleSearchButtonClick,
    handleInputChange,
    handleKeyDown,
    inputRef,
    dropdownRef,
    searchContainerRef,
    open,
    setOpen
  };
}

export default useWeatherSearch; 