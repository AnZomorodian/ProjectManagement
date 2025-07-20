import {
  users,
  projects,
  tasks,
  procurementOrders,
  procurementRequests,
  projectPhases,
  engineeringDocuments,
  importedFiles,
  notifications,
  type User,
  type InsertUser,
  type Project,
  type InsertProject,
  type Task,
  type InsertTask,
  type ProcurementOrder,
  type InsertProcurementOrder,
  type ProcurementRequest,
  type InsertProcurementRequest,
  type ProjectPhase,
  type InsertProjectPhase,
  type EngineeringDocument,
  type InsertEngineeringDocument,
  type ImportedFile,
  type InsertImportedFile,
  type Notification,
  type InsertNotification,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Tasks
  getTasks(projectId?: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Procurement Orders
  getProcurementOrders(projectId?: number): Promise<ProcurementOrder[]>;
  getProcurementOrder(id: number): Promise<ProcurementOrder | undefined>;
  createProcurementOrder(order: InsertProcurementOrder): Promise<ProcurementOrder>;
  updateProcurementOrder(id: number, order: Partial<InsertProcurementOrder>): Promise<ProcurementOrder | undefined>;
  deleteProcurementOrder(id: number): Promise<boolean>;
  
  // Procurement Requests
  getProcurementRequests(projectId?: number): Promise<ProcurementRequest[]>;
  getProcurementRequest(id: number): Promise<ProcurementRequest | undefined>;
  createProcurementRequest(request: InsertProcurementRequest): Promise<ProcurementRequest>;
  updateProcurementRequest(id: number, request: Partial<InsertProcurementRequest>): Promise<ProcurementRequest | undefined>;
  deleteProcurementRequest(id: number): Promise<boolean>;
  
  // Project Phases
  getProjectPhases(projectId?: number): Promise<ProjectPhase[]>;
  getProjectPhase(id: number): Promise<ProjectPhase | undefined>;
  createProjectPhase(phase: InsertProjectPhase): Promise<ProjectPhase>;
  updateProjectPhase(id: number, phase: Partial<InsertProjectPhase>): Promise<ProjectPhase | undefined>;
  deleteProjectPhase(id: number): Promise<boolean>;
  
  // Engineering Documents
  getEngineeringDocuments(projectId?: number): Promise<EngineeringDocument[]>;
  getEngineeringDocument(id: number): Promise<EngineeringDocument | undefined>;
  createEngineeringDocument(doc: InsertEngineeringDocument): Promise<EngineeringDocument>;
  updateEngineeringDocument(id: number, doc: Partial<InsertEngineeringDocument>): Promise<EngineeringDocument | undefined>;
  deleteEngineeringDocument(id: number): Promise<boolean>;
  
  // Imported Files
  getImportedFiles(): Promise<ImportedFile[]>;
  getImportedFile(id: number): Promise<ImportedFile | undefined>;
  createImportedFile(file: InsertImportedFile): Promise<ImportedFile>;
  updateImportedFile(id: number, file: Partial<InsertImportedFile>): Promise<ImportedFile | undefined>;
  
  // Notifications
  getNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<boolean>;
  
  // Analytics
  getDashboardStats(): Promise<{
    activeProjects: number;
    totalBudget: string;
    completionRate: number;
    teamMembers: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private tasks: Map<number, Task>;
  private procurementOrders: Map<number, ProcurementOrder>;
  private procurementRequests: Map<number, ProcurementRequest>;
  private projectPhases: Map<number, ProjectPhase>;
  private engineeringDocuments: Map<number, EngineeringDocument>;
  private importedFiles: Map<number, ImportedFile>;
  private notifications: Map<number, Notification>;
  private currentUserId: number;
  private currentProjectId: number;
  private currentTaskId: number;
  private currentOrderId: number;
  private currentRequestId: number;
  private currentPhaseId: number;
  private currentDocId: number;
  private currentFileId: number;
  private currentNotificationId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.tasks = new Map();
    this.procurementOrders = new Map();
    this.procurementRequests = new Map();
    this.projectPhases = new Map();
    this.engineeringDocuments = new Map();
    this.importedFiles = new Map();
    this.notifications = new Map();
    this.currentUserId = 1;
    this.currentProjectId = 1;
    this.currentTaskId = 1;
    this.currentOrderId = 1;
    this.currentRequestId = 1;
    this.currentPhaseId = 1;
    this.currentDocId = 1;
    this.currentFileId = 1;
    this.currentNotificationId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Create default user
    const defaultUser: User = {
      id: this.currentUserId++,
      username: "admin",
      password: "admin123",
      email: "admin@pmis.com",
      fullName: "John Smith",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "user",
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: new Date() 
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...updateData };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Tasks
  async getTasks(projectId?: number): Promise<Task[]> {
    const tasks = Array.from(this.tasks.values());
    return projectId ? tasks.filter(task => task.projectId === projectId) : tasks;
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const task: Task = { 
      ...insertTask, 
      id, 
      createdAt: new Date() 
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updateData: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updateData };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Procurement Orders
  async getProcurementOrders(projectId?: number): Promise<ProcurementOrder[]> {
    const orders = Array.from(this.procurementOrders.values());
    return projectId ? orders.filter(order => order.projectId === projectId) : orders;
  }

  async getProcurementOrder(id: number): Promise<ProcurementOrder | undefined> {
    return this.procurementOrders.get(id);
  }

  async createProcurementOrder(insertOrder: InsertProcurementOrder): Promise<ProcurementOrder> {
    const id = this.currentOrderId++;
    const order: ProcurementOrder = { 
      ...insertOrder, 
      id, 
      createdAt: new Date() 
    };
    this.procurementOrders.set(id, order);
    return order;
  }

  async updateProcurementOrder(id: number, updateData: Partial<InsertProcurementOrder>): Promise<ProcurementOrder | undefined> {
    const order = this.procurementOrders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...updateData };
    this.procurementOrders.set(id, updatedOrder);
    return updatedOrder;
  }

  async deleteProcurementOrder(id: number): Promise<boolean> {
    return this.procurementOrders.delete(id);
  }

  // Procurement Requests
  async getProcurementRequests(projectId?: number): Promise<ProcurementRequest[]> {
    const requests = Array.from(this.procurementRequests.values());
    return projectId ? requests.filter(req => req.projectId === projectId) : requests;
  }

  async getProcurementRequest(id: number): Promise<ProcurementRequest | undefined> {
    return this.procurementRequests.get(id);
  }

  async createProcurementRequest(insertRequest: InsertProcurementRequest): Promise<ProcurementRequest> {
    const id = this.currentRequestId++;
    const request: ProcurementRequest = { 
      ...insertRequest, 
      id, 
      createdAt: new Date() 
    };
    this.procurementRequests.set(id, request);
    return request;
  }

  async updateProcurementRequest(id: number, updateData: Partial<InsertProcurementRequest>): Promise<ProcurementRequest | undefined> {
    const request = this.procurementRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...updateData };
    this.procurementRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  async deleteProcurementRequest(id: number): Promise<boolean> {
    return this.procurementRequests.delete(id);
  }

  // Project Phases
  async getProjectPhases(projectId?: number): Promise<ProjectPhase[]> {
    const phases = Array.from(this.projectPhases.values());
    return projectId ? phases.filter(phase => phase.projectId === projectId) : phases;
  }

  async getProjectPhase(id: number): Promise<ProjectPhase | undefined> {
    return this.projectPhases.get(id);
  }

  async createProjectPhase(insertPhase: InsertProjectPhase): Promise<ProjectPhase> {
    const id = this.currentPhaseId++;
    const phase: ProjectPhase = { 
      ...insertPhase, 
      id, 
      createdAt: new Date() 
    };
    this.projectPhases.set(id, phase);
    return phase;
  }

  async updateProjectPhase(id: number, updateData: Partial<InsertProjectPhase>): Promise<ProjectPhase | undefined> {
    const phase = this.projectPhases.get(id);
    if (!phase) return undefined;
    
    const updatedPhase = { ...phase, ...updateData };
    this.projectPhases.set(id, updatedPhase);
    return updatedPhase;
  }

  async deleteProjectPhase(id: number): Promise<boolean> {
    return this.projectPhases.delete(id);
  }

  // Engineering Documents
  async getEngineeringDocuments(projectId?: number): Promise<EngineeringDocument[]> {
    const docs = Array.from(this.engineeringDocuments.values());
    return projectId ? docs.filter(doc => doc.projectId === projectId) : docs;
  }

  async getEngineeringDocument(id: number): Promise<EngineeringDocument | undefined> {
    return this.engineeringDocuments.get(id);
  }

  async createEngineeringDocument(insertDoc: InsertEngineeringDocument): Promise<EngineeringDocument> {
    const id = this.currentDocId++;
    const doc: EngineeringDocument = { 
      ...insertDoc, 
      id, 
      createdAt: new Date() 
    };
    this.engineeringDocuments.set(id, doc);
    return doc;
  }

  async updateEngineeringDocument(id: number, updateData: Partial<InsertEngineeringDocument>): Promise<EngineeringDocument | undefined> {
    const doc = this.engineeringDocuments.get(id);
    if (!doc) return undefined;
    
    const updatedDoc = { ...doc, ...updateData };
    this.engineeringDocuments.set(id, updatedDoc);
    return updatedDoc;
  }

  async deleteEngineeringDocument(id: number): Promise<boolean> {
    return this.engineeringDocuments.delete(id);
  }

  // Imported Files
  async getImportedFiles(): Promise<ImportedFile[]> {
    return Array.from(this.importedFiles.values());
  }

  async getImportedFile(id: number): Promise<ImportedFile | undefined> {
    return this.importedFiles.get(id);
  }

  async createImportedFile(insertFile: InsertImportedFile): Promise<ImportedFile> {
    const id = this.currentFileId++;
    const file: ImportedFile = { 
      ...insertFile, 
      id, 
      createdAt: new Date() 
    };
    this.importedFiles.set(id, file);
    return file;
  }

  async updateImportedFile(id: number, updateData: Partial<InsertImportedFile>): Promise<ImportedFile | undefined> {
    const file = this.importedFiles.get(id);
    if (!file) return undefined;
    
    const updatedFile = { ...file, ...updateData };
    this.importedFiles.set(id, updatedFile);
    return updatedFile;
  }

  // Notifications
  async getNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(n => n.userId === userId);
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.currentNotificationId++;
    const notification: Notification = { 
      ...insertNotification, 
      id, 
      createdAt: new Date() 
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    
    notification.read = true;
    this.notifications.set(id, notification);
    return true;
  }

  // Analytics
  async getDashboardStats(): Promise<{
    activeProjects: number;
    totalBudget: string;
    completionRate: number;
    teamMembers: number;
  }> {
    const projects = Array.from(this.projects.values());
    const activeProjects = projects.filter(p => p.status === "in-progress" || p.status === "planning").length;
    const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.budget || "0")), 0);
    const avgProgress = projects.length > 0 ? projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length : 0;
    const teamMembers = this.users.size;

    return {
      activeProjects,
      totalBudget: `$${(totalBudget / 1000000).toFixed(1)}M`,
      completionRate: Math.round(avgProgress),
      teamMembers,
    };
  }
}

export const storage = new MemStorage();
