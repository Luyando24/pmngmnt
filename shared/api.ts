/**
 * Shared types for the IPIMS (Integrated Police & Immigration Management System)
 */

export type UUID = string;
export type NRC = string; // Zambian National Registration Card number
export type PassportNumber = string;
export type CaseNumber = string;
export type PermitNumber = string;

export type UserRole =
  | "admin"
  | "police_officer"
  | "immigration_officer"
  | "supervisor"
  | "auditor"
  | "resident";

export interface PoliceStation {
  id: UUID;
  name: string;
  code: string; // unique short code per station
  address: string;
  district?: string;
  province?: string;
  phone?: string;
  commanderId?: UUID; // officer in charge
  createdAt: string;
  updatedAt: string;
}

export interface ImmigrationOffice {
  id: UUID;
  name: string;
  code: string; // unique short code per office
  address: string;
  district?: string;
  province?: string;
  phone?: string;
  chiefOfficerId?: UUID; // officer in charge
  borderPost?: boolean; // true if this is a border crossing
  createdAt: string;
  updatedAt: string;
}

export interface Officer {
  id: UUID;
  stationId?: UUID; // for police officers
  immigrationOfficeId?: UUID; // for immigration officers
  email: string;
  passwordHash?: string; // never sent to clients
  role: Exclude<UserRole, "resident">;
  firstName: string;
  lastName: string;
  badgeNumber: string;
  rank?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Resident {
  id: UUID;
  identityCardId: string; // national identity card for authentication
  nrc: NRC;
  passportNumber?: PassportNumber;
  firstName: string;
  lastName: string;
  gender?: "male" | "female" | "other";
  dob?: string; // ISO date
  phone?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;

  // Additional authentication methods (optional)
  email?: string;
  phoneAuth?: string; // phone number for authentication
  hasPassword?: boolean; // indicates if password is set

  // Resident details
  occupation?: string;
  maritalStatus?: "single" | "married" | "divorced" | "widowed";
  nationality: string;
  residencyStatus: "citizen" | "permanent_resident" | "temporary_resident" | "visitor";

  // Biometric data
  fingerprintHash?: string;
  faceRecognitionHash?: string;

  cardId: string; // digital identity card ID (unique, non-PII)
  cardQrData: string; // signed QR payload (opaque to clients)
  createdAt: string;
  updatedAt: string;
}

export interface Case {
  id: UUID;
  caseNumber: CaseNumber;
  reporterId?: UUID; // resident who reported
  assignedOfficerId?: UUID; // investigating officer
  stationId: UUID;
  title: string;
  description: string;
  category: "theft" | "assault" | "fraud" | "domestic" | "traffic" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "reported" | "investigating" | "resolved" | "closed" | "archived";
  incidentDate?: string; // ISO datetime
  location?: string;
  evidenceFiles?: string[]; // file URLs
  createdAt: string;
  updatedAt: string;
}

export interface Suspect {
  id: UUID;
  nrc?: NRC;
  firstName: string;
  lastName: string;
  aliases?: string[];
  gender?: "male" | "female" | "other";
  dob?: string;
  address?: string;
  phone?: string;
  nationality?: string;
  fingerprintHash?: string;
  faceRecognitionHash?: string;
  photoUrl?: string;
  knownAssociates?: UUID[]; // other suspect IDs
  criminalHistory?: string;
  status: "wanted" | "detained" | "released" | "convicted";
  createdAt: string;
  updatedAt: string;
}

export interface CaseSuspect {
  id: UUID;
  caseId: UUID;
  suspectId: UUID;
  role: "primary" | "accomplice" | "witness" | "victim";
  notes?: string;
  createdAt: string;
}

export interface Permit {
  id: UUID;
  permitNumber: PermitNumber;
  residentId: UUID;
  type: "work" | "study" | "business" | "residence" | "transit";
  status: "pending" | "approved" | "rejected" | "expired" | "revoked";
  issuedById?: UUID; // immigration officer
  immigrationOfficeId: UUID;
  validFrom?: string; // ISO date
  validUntil?: string; // ISO date
  conditions?: string; // special conditions or restrictions
  documentUrl?: string; // PDF or image of permit
  qrCode?: string; // for verification
  createdAt: string;
  updatedAt: string;
}

export interface Visa {
  id: UUID;
  visaNumber: string;
  residentId: UUID;
  passportNumber: PassportNumber;
  type: "tourist" | "business" | "work" | "student" | "transit" | "diplomatic";
  entries: "single" | "multiple";
  status: "pending" | "approved" | "rejected" | "used" | "expired" | "cancelled";
  issuedById?: UUID; // immigration officer
  immigrationOfficeId: UUID;
  validFrom?: string; // ISO date
  validUntil?: string; // ISO date
  purpose?: string;
  documentUrl?: string;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string; // short-lived JWT
  refreshToken?: string; // optional if using refresh flow
  expiresInSec: number;
}

export interface AuthSession {
  userId: UUID;
  role: UserRole;
  stationId?: UUID; // for police officers
  immigrationOfficeId?: UUID; // for immigration officers
  residentId?: UUID; // for resident role
  tokens: AuthTokens;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResidentLoginRequest {
  identityCardId: string; // national identity card
}

export interface ResidentAlternativeLoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

export interface ResidentRegistrationRequest {
  nrc?: NRC; // Optional for foreign nationals
  passportNumber?: PassportNumber;
  firstName: string;
  lastName: string;
  gender?: "male" | "female" | "other";
  dob: string; // Required for registration
  phone?: string;
  email?: string; // For login
  password?: string; // For login  
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  occupation?: string;
  maritalStatus?: "single" | "married" | "divorced" | "widowed";
  nationality: string;
  residencyStatus?: "citizen" | "permanent_resident" | "temporary_resident" | "visitor" | "refugee";
}

// Website Builder Types
export interface DepartmentWebsite {
  id: string;
  stationId?: string; // for police stations
  immigrationOfficeId?: string; // for immigration offices
  domainName?: string;
  subdomain: string;
  title: string;
  description?: string;
  logoUrl?: string;
  faviconUrl?: string;
  themeId?: string;
  isPublished: boolean;
  publishedAt?: string;
  deploymentUrl?: string;
  sslEnabled?: boolean;
  customCss?: string;
  analyticsCode?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: Record<string, string>;
  seoSettings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteTheme {
  id: string;
  name: string;
  description?: string;
  previewImageUrl?: string;
  cssTemplate: string;
  layoutConfig: Record<string, any>;
  colorScheme?: Record<string, string>;
  fontSettings?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebsitePage {
  id: string;
  websiteId: string;
  slug: string;
  title: string;
  metaDescription?: string;
  content: Record<string, any>;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteComponent {
  id: string;
  pageId: string;
  componentType: string;
  componentData: Record<string, any>;
  sortOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteMedia {
  id: string;
  websiteId: string;
  filename: string;
  originalFilename: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  altText?: string;
  createdAt: string;
}

// Website Builder Request Types
export interface CreateWebsiteRequest {
  title: string;
  description?: string;
  subdomain: string;
  themeId?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface UpdateWebsiteRequest {
  title?: string;
  description?: string;
  domainName?: string;
  logoUrl?: string;
  faviconUrl?: string;
  themeId?: string;
  customCss?: string;
  analyticsCode?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: Record<string, string>;
  seoSettings?: Record<string, any>;
}

export interface CreatePageRequest {
  slug: string;
  title: string;
  metaDescription?: string;
  content: Record<string, any>;
  sortOrder?: number;
}

export interface UpdatePageRequest {
  title?: string;
  metaDescription?: string;
  content?: Record<string, any>;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface CreateComponentRequest {
  componentType: string;
  componentData: Record<string, any>;
  sortOrder?: number;
}

export interface UpdateComponentRequest {
  componentData?: Record<string, any>;
  sortOrder?: number;
  isVisible?: boolean;
}

export interface ApiError {
  code: string;
  message: string;
}

export type SyncOperation =
  | { type: "create"; entity: string; payload: unknown }
  | { type: "update"; entity: string; id: UUID | string; payload: unknown }
  | { type: "delete"; entity: string; id: UUID | string };

export interface SyncQueueItem {
  id: string; // uuid v4
  op: SyncOperation;
  createdAt: number; // epoch ms
  retryCount: number;
  lastError?: string;
}

export interface Paged<T> {
  items: T[];
  nextCursor?: string | null;
}

export interface SearchResidentRequest {
  nrc?: NRC;
  passportNumber?: PassportNumber;
  cardIdOrQr?: string; // QR payload (opaque)
}

export interface SearchResidentResponse {
  resident?: Resident;
}

export interface UpsertResidentRequest {
  resident: Partial<Resident> & { nrc: NRC };
}

export interface UpsertResidentResponse {
  resident: Resident;
}

export interface CreateCaseRequest {
  reporterId?: UUID;
  stationId: UUID;
  title: string;
  description: string;
  category: "theft" | "assault" | "fraud" | "domestic" | "traffic" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  incidentDate?: string;
  location?: string;
}

export interface CreateCaseResponse {
  case: Case;
}

export interface ListCasesResponse extends Paged<Case> { }

export interface CreatePermitRequest {
  residentId: UUID;
  type: "work" | "study" | "business" | "residence" | "transit";
  immigrationOfficeId: UUID;
  validFrom?: string;
  validUntil?: string;
  conditions?: string;
}

export interface CreatePermitResponse {
  permit: Permit;
}

export interface ListPermitsResponse extends Paged<Permit> { }

export interface RegisterOfficerRequest {
  stationName?: string; // for police officers
  immigrationOfficeName?: string; // for immigration officers
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  badgeNumber: string;
  rank?: string;
  role?: Exclude<UserRole, "resident">; // default admin
}

export interface RegisterOfficerResponse {
  userId: UUID;
  stationId?: UUID;
  immigrationOfficeId?: UUID;
}

export interface DemoResponse {
  message: string;
}

export interface DashboardStats {
  totalCases: number;
  openCases: number;
  inProgressCases: number;
  closedCases: number;
  highPriorityCases: number;
  mediumPriorityCases: number;
  lowPriorityCases: number;
}

export interface FingerprintApplication {
  id: UUID;
  applicantId?: UUID; // if logged in
  firstName: string;
  lastName: string;
  nrc: string;
  phone: string;
  reason: "police_clearance" | "visa" | "employment" | "other";
  preferredDate: string;
  status: "pending" | "scheduled" | "completed" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface CreateFingerprintApplicationRequest {
  firstName: string;
  lastName: string;
  nrc: string;
  phone: string;
  reason: "police_clearance" | "visa" | "employment" | "other";
  preferredDate: string;
}

export interface LostDocumentReport {
  id: UUID;
  reporterId?: UUID; // if logged in
  firstName: string;
  lastName: string;
  contactPhone: string;
  documentType: "nrc" | "passport";
  documentNumber?: string;
  dateLost: string;
  locationLost: string;
  description: string;
  status: "reported" | "investigating" | "found" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface CreateLostDocumentReportRequest {
  firstName: string;
  lastName: string;
  contactPhone: string;
  documentType: "nrc" | "passport";
  documentNumber?: string;
  dateLost: string;
  locationLost: string;
  description: string;
}

