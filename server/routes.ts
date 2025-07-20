import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import {
  insertProjectSchema,
  insertTaskSchema,
  insertProcurementOrderSchema,
  insertProcurementRequestSchema,
  insertProjectPhaseSchema,
  insertEngineeringDocumentSchema,
  insertImportedFileSchema,
  insertNotificationSchema,
} from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/pdf'
    ];
    cb(null, allowedTypes.includes(file.mimetype));
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard Stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const projectData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, projectData);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProject(id);
      if (!deleted) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Tasks
  app.get("/api/tasks", async (req, res) => {
    try {
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const tasks = await storage.getTasks(projectId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const taskData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(id, taskData);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  // Procurement Orders
  app.get("/api/procurement", async (req, res) => {
    try {
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const orders = await storage.getProcurementOrders(projectId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch procurement orders" });
    }
  });

  app.post("/api/procurement", async (req, res) => {
    try {
      const orderData = insertProcurementOrderSchema.parse(req.body);
      const order = await storage.createProcurementOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: "Invalid procurement order data" });
    }
  });

  app.put("/api/procurement/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const orderData = insertProcurementOrderSchema.partial().parse(req.body);
      const order = await storage.updateProcurementOrder(id, orderData);
      if (!order) {
        return res.status(404).json({ error: "Procurement order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: "Invalid procurement order data" });
    }
  });

  // Procurement Requests
  app.get("/api/procurement-requests", async (req, res) => {
    try {
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const requests = await storage.getProcurementRequests(projectId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch procurement requests" });
    }
  });

  app.post("/api/procurement-requests", async (req, res) => {
    try {
      const requestData = insertProcurementRequestSchema.parse(req.body);
      const request = await storage.createProcurementRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ error: "Invalid procurement request data" });
    }
  });

  app.put("/api/procurement-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const requestData = insertProcurementRequestSchema.partial().parse(req.body);
      const request = await storage.updateProcurementRequest(id, requestData);
      if (!request) {
        return res.status(404).json({ error: "Procurement request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(400).json({ error: "Invalid procurement request data" });
    }
  });

  // Project Phases
  app.get("/api/project-phases", async (req, res) => {
    try {
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const phases = await storage.getProjectPhases(projectId);
      res.json(phases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project phases" });
    }
  });

  app.post("/api/project-phases", async (req, res) => {
    try {
      const phaseData = insertProjectPhaseSchema.parse(req.body);
      const phase = await storage.createProjectPhase(phaseData);
      res.status(201).json(phase);
    } catch (error) {
      res.status(400).json({ error: "Invalid project phase data" });
    }
  });

  // Engineering Documents
  app.get("/api/engineering", async (req, res) => {
    try {
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const docs = await storage.getEngineeringDocuments(projectId);
      res.json(docs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch engineering documents" });
    }
  });

  app.post("/api/engineering", async (req, res) => {
    try {
      const docData = insertEngineeringDocumentSchema.parse(req.body);
      const doc = await storage.createEngineeringDocument(docData);
      res.status(201).json(doc);
    } catch (error) {
      res.status(400).json({ error: "Invalid document data" });
    }
  });

  // File Import
  app.post("/api/import", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileData = {
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        status: "processing" as const,
        uploadedBy: 1, // Default to admin user
      };

      const importedFile = await storage.createImportedFile(fileData);
      
      // Simulate file processing
      setTimeout(async () => {
        await storage.updateImportedFile(importedFile.id, {
          status: "completed",
          processedData: { 
            records: Math.floor(Math.random() * 100) + 1,
            processed: new Date().toISOString()
          }
        });
      }, 2000);

      res.status(201).json(importedFile);
    } catch (error) {
      res.status(500).json({ error: "Failed to process file upload" });
    }
  });

  app.get("/api/import", async (req, res) => {
    try {
      const files = await storage.getImportedFiles();
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch imported files" });
    }
  });

  app.get("/api/import/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const file = await storage.getImportedFile(id);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      res.json(file);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch file" });
    }
  });

  // Notifications
  app.get("/api/notifications", async (req, res) => {
    try {
      const userId = 1; // Default to admin user
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      res.status(201).json(notification);
    } catch (error) {
      res.status(400).json({ error: "Invalid notification data" });
    }
  });

  app.put("/api/notifications/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.markNotificationAsRead(id);
      if (!success) {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
