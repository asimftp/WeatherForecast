import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from "dotenv";
import open from "open";

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    // Capture JSON responses for logging
    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
    };

    // Log API requests on completion
    res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
            let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
            
            // Include response data in logs for debugging (truncated for readability)
            if (capturedJsonResponse) {
                const responseStr = JSON.stringify(capturedJsonResponse);
                logLine += ` :: ${responseStr.length > 50 ? responseStr.slice(0, 50) + "…" : responseStr}`;
            }

            // Truncate long log lines
            if (logLine.length > 120) {
                logLine = logLine.slice(0, 119) + "…";
            }

            log(logLine);
        }
    });

    next();
});

// Start the server
(async () => {
    try {
        // Register API routes
        const server = await registerRoutes(app);

        // Global error handler
        app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
            const status = err.status || err.statusCode || 500;
            const message = err.message || "Internal Server Error";
            
            log(`ERROR: ${message}`);
            
            // Send error response
            res.status(status).json({ 
                error: message,
                status
            });
        });

        // Setup Vite in development mode
        if (app.get("env") === "development") {
            await setupVite(app, server);
        } else {
            // Serve static files in production
            serveStatic(app);
        }

        // Get port from environment or use default
        const PORT = process.env.PORT || 5000;
        
        // Start listening for requests
        server.listen(PORT, () => {
            log(`Server started on port ${PORT}`);
            
            // Open browser in development mode
            if (app.get("env") === "development") {
                open(`http://localhost:${PORT}`);
            }
        });
        
        // Handle server shutdown gracefully
        const handleShutdown = () => {
            log('Server shutting down...');
            server.close(() => {
                log('Server closed');
                process.exit(0);
            });
            
            // Force close after timeout
            setTimeout(() => {
                log('Forcing server shutdown');
                process.exit(1);
            }, 5000);
        };
        
        process.on('SIGTERM', handleShutdown);
        process.on('SIGINT', handleShutdown);
        
    } catch (error) {
        log(`Failed to start server: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
})();