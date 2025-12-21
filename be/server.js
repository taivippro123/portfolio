import express from "express";
import UserRoute from "./routes/userRoute.js";
import FolderRoute from "./routes/folderRoute.js";
import NoteRoute from "./routes/noteRoute.js";
import CVRoute from "./routes/cvRoute.js";
import AnalyticsRoute from "./routes/analyticsRoute.js";
import UploadRoute from "./routes/uploadRoute.js";
import ShareRoute from "./routes/shareRoute.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy để lấy IP đúng khi có reverse proxy
app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ["https://taivippro123.vercel.app", "http://localhost:3000"],
  credentials: true,
}));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portfolio API",
      version: "1.0.0",
      description: "API documentation for Personal Portfolio Management System",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/users", UserRoute);
app.use("/api/folders", FolderRoute);
app.use("/api/notes", NoteRoute);
app.use("/api/cv", CVRoute);
app.use("/api/analytics", AnalyticsRoute);
app.use("/api/upload", UploadRoute);
app.use("/api/share", ShareRoute); // Public route, không cần auth

connectDB().then(() => {
  console.log("Database connected successfully");
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to connect to database:", error);
  process.exit(1);
});
