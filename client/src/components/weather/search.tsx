import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

interface Props {
  onSearch: (lat: string, lon: string) => void;
}

interface City {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export function Search({ onSearch }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (value.length < 2) {
      setCities([]);
      setOpen(false);
      return;
    }

    const searchCities = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
            value
          )}&limit=5&appid=60a689a67061620d8093314c1fd9ec6c`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }

        const data = await response.json();
        // Enhanced deduplication logic
        const uniqueCities = data.reduce((acc: City[], city: City) => {
          const isDuplicate = acc.some(
            (c) => 
              c.name === city.name && 
              c.state === city.state && 
              c.country === city.country
          );
          if (!isDuplicate) {
            acc.push(city);
          }
          return acc;
        }, []);

        setCities(uniqueCities);
        setOpen(uniqueCities.length > 0 && document.activeElement === document.querySelector('input'));
      } catch (error) {
        console.error('Search error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to search cities. Please try again.",
        });
      }
    };

    const timeoutId = setTimeout(searchCities, 300);
    return () => clearTimeout(timeoutId);
  }, [value, toast]);

  const formatCityName = (city: City) => {
    let formattedName = city.name;
    if (city.state) formattedName += `, ${city.state}`;
    if (city.country) formattedName += `, ${city.country}`;
    return formattedName;
  };

  const handleSelect = (city: City) => {
    setSelectedCity(city);
    setValue(formatCityName(city));
    onSearch(city.lat.toString(), city.lon.toString());
    setCities([]);
    setOpen(false);
  };

  return (
    <div className="flex gap-2 max-w-md mx-auto">
      <div className="relative flex-1">
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSelectedCity(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && cities.length > 0) {
              handleSelect(cities[0]);
            }
          }}
          placeholder="Enter city name..."
          className="w-full"
        />
        {cities.length > 0 && open && (
          <div className="absolute w-full mt-1 bg-background border rounded-md shadow-lg z-50">
            <Command>
              <CommandGroup>
                {cities.map((city) => (
                  <CommandItem
                    key={`${city.name}-${city.state}-${city.country}`}
                    onSelect={() => handleSelect(city)}
                    className="cursor-pointer hover:bg-accent"
                  >
                    {formatCityName(city)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </div>
        )}
      </div>
      <Button 
        onClick={() => {
          if (cities.length > 0) {
            handleSelect(cities[0]);
          }
        }}
      >
        <SearchIcon className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
}