import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/common/Button";
import { Moon, Sun } from "lucide-react";

/**
 * ThemeToggle Component - Toggles between light and dark mode.
 */
const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const isLightTheme = theme === "light";

    const icon = isLightTheme ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />;

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${isLightTheme ? "dark" : "light"} mode`}
            className="rounded-full"
        >
            {icon}
        </Button>
    );
};

export default ThemeToggle;