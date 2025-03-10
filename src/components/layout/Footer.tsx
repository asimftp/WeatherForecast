import React from "react";

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[hsl(var(--footer-background))] border-t border-border py-6 mt-8 shadow-inner">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                <p>
                    Powered by{" "}
                    <a
                        href="https://openweathermap.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        OpenWeatherMap
                    </a>
                    <span className="mx-2">•</span> &copy; {currentYear} Weather Forecast
                </p>
            </div>
        </footer>
    );
};

export default Footer;
