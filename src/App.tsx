import React, { useState, useCallback, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/common/Toaster";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Create a client with optimized configuration
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false, // Disable refetching on window focus for better performance
      refetchOnReconnect: true,
      gcTime: 1000 * 60 * 30, // 30 minutes cache time
    },
  },
});

const App: React.FC = () => {
  // Create a memoized query client instance
  const queryClient = useMemo(() => createQueryClient(), []);
  
  // State for search parameters
  const [searchParams, setSearchParams] = useState<{lat: string; lon: string; cityName?: string} | null>(null);

  // Memoized search handler to prevent unnecessary re-renders
  const handleSearch = useCallback((lat: string, lon: string, cityName?: string) => {
    console.log("App handleSearch called with:", { lat, lon, cityName });
    
    // Validate parameters
    if (!lat || !lon) {
      console.error("Invalid search parameters:", { lat, lon, cityName });
      return;
    }
    
    // Update search parameters
    setSearchParams({ lat, lon, cityName });
    console.log("Search params updated:", { lat, lon, cityName });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col">
          <Header onSearch={handleSearch} />
          <main className="flex-grow bg-[hsl(var(--page-background))] overflow-auto">
            <Switch>
              <Route path="/">
                <Home searchParams={searchParams} onSearch={handleSearch} />
              </Route>
              <Route path="/WeatherForecast">
                <Home searchParams={searchParams} onSearch={handleSearch} />
              </Route>
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default React.memo(App);
