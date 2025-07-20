import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("user"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("planning"),
  progress: integer("progress").notNull().default(0),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  dueDate: timestamp("due_date"),
  startDate: timestamp("start_date"),
  createdBy: integer("created_by").references(() => users.id),
  category: text("category").notNull().default("general"),
  priority: text("priority").notNull().default("medium"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"),
  assignedTo: integer("assigned_to").references(() => users.id),
  dueDate: timestamp("due_date"),
  priority: text("priority").notNull().default("medium"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const procurementOrders = pgTable("procurement_orders", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  vendorName: text("vendor_name").notNull(),
  orderNumber: text("order_number").notNull().unique(),
  description: text("description"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  orderDate: timestamp("order_date").defaultNow(),
  expectedDelivery: timestamp("expected_delivery"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const engineeringDocuments = pgTable("engineering_documents", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  title: text("title").notNull(),
  documentType: text("document_type").notNull(),
  version: text("version").notNull().default("1.0"),
  filePath: text("file_path"),
  status: text("status").notNull().default("draft"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const importedFiles = pgTable("imported_files", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  status: text("status").notNull().default("processing"),
  processedData: jsonb("processed_data"),
  errorMessage: text("error_message"),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

export const insertProcurementOrderSchema = createInsertSchema(procurementOrders).omit({
  id: true,
  createdAt: true,
});

export const insertEngineeringDocumentSchema = createInsertSchema(engineeringDocuments).omit({
  id: true,
  createdAt: true,
});

export const insertImportedFileSchema = createInsertSchema(importedFiles).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type ProcurementOrder = typeof procurementOrders.$inferSelect;
export type InsertProcurementOrder = z.infer<typeof insertProcurementOrderSchema>;

export type EngineeringDocument = typeof engineeringDocuments.$inferSelect;
export type InsertEngineeringDocument = z.infer<typeof insertEngineeringDocumentSchema>;

export type ImportedFile = typeof importedFiles.$inferSelect;
export type InsertImportedFile = z.infer<typeof insertImportedFileSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
