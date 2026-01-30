// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Family Types
export enum RelationshipType {
  BLOOD = 'blood',
  ADOPTED = 'adopted',
  MARRIAGE = 'marriage',
  PARTNER = 'partner',
}

export interface FamilyMember {
  id: string;
  userId: string; // The user who owns this family tree
  name: string;
  dateOfBirth?: Date;
  dateOfDeath?: Date;
  relationship?: RelationshipType;
  isAlive: boolean;
  notes?: string;
  parentId?: string;
  spouseId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Asset Types
export enum AssetCategory {
  BANK = 'bank',
  INSURANCE = 'insurance',
  BROKERAGE = 'brokerage',
  FUND = 'fund',
  REAL_ESTATE = 'real_estate',
  CRYPTOCURRENCY = 'cryptocurrency',
  STOCK = 'stock',
  COLLECTION = 'collection',
  INTELLECTUAL_PROPERTY = 'intellectual_property',
  OTHER = 'other',
}

export enum AssetLocation {
  DOMESTIC = 'domestic',
  OVERSEAS = 'overseas',
}

export interface Asset {
  id: string;
  userId: string;
  category: AssetCategory;
  name: string;
  description?: string;
  value?: number;
  currency?: string;
  location: AssetLocation;
  institution?: string;
  accountNumber?: string;
  isEncrypted: boolean;
  documents?: string[]; // File URLs
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Inheritance Types
export enum InheritanceStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DISPUTED = 'disputed',
}

export interface Inheritance {
  id: string;
  assetId: string;
  heirId: string; // Family member ID
  percentage: number;
  conditions?: string;
  status: InheritanceStatus;
  notificationSent: boolean;
  notificationSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Will Types
export interface Will {
  id: string;
  userId: string;
  title: string;
  content: string;
  jurisdiction?: string; // Legal jurisdiction
  isSigned: boolean;
  signedAt?: Date;
  isWitnessed: boolean;
  documentUrl?: string;
  blockchainHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Notification Types
export enum NotificationType {
  INHERITANCE_START = 'inheritance_start',
  INHERITANCE_COMPLETED = 'inheritance_completed',
  DOCUMENT_EXPIRY = 'document_expiry',
  SYSTEM = 'system',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}
