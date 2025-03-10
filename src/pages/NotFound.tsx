import React, { useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent } from "@/components/common/Card";
import { AlertCircle } from "lucide-react";
import { Button } from '@/components/common/Button';

/**
 * 404 Not Found Page Component
 */
const NotFound: React.FC = () => {
    // Get the base path dynamically based on environment
    const [location] = useLocation();
    const basePath = useMemo(() => (import.meta.env.PROD ? '/WeatherForecast' : ''), []);

    return (
        <div className="container mx-auto flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md">
                <CardContent className="pt-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                        <h1 className="text-2xl font-bold">404 Page Not Found</h1>
                    </div>

                    <p className="mt-2 text-muted-foreground">
                        The page you are looking for doesn't exist or has been moved.
                    </p>

                    <div className="mt-6">
                        <Link href={`${basePath}/`}>
                            <Button aria-label="Return to Home">
                                Return to Home
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default NotFound;
