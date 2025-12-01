import { db } from "./db";
import Dexie from "dexie";
import {
  NetworkError,
  AuthError,
  validatePatientData,
  validateStaffData,
} from "./errors";
import type {
  AuthSession,
  Case,
  CreateCaseRequest,
  CreateCaseResponse,
  CreatePermitRequest,
  CreatePermitResponse,
  ListCasesResponse,
  ListPermitsResponse,
  LoginRequest,
  Resident,
  ResidentLoginRequest,
  ResidentAlternativeLoginRequest,
  ResidentRegistrationRequest,
  SearchResidentRequest,
  SearchResidentResponse,
  UpsertResidentRequest,
  UpsertResidentResponse,
  RegisterOfficerRequest,
  RegisterOfficerResponse,
  PoliceStation,
  ImmigrationOffice,
  Officer,
  DepartmentWebsite,
  WebsiteTheme,
  WebsitePage,
  CreateWebsiteRequest,
  UpdateWebsiteRequest,
  UpdatePageRequest,
  DashboardStats,
  CreateFingerprintApplicationRequest,
  FingerprintApplication,
  CreateLostDocumentReportRequest,
  LostDocumentReport,
  Visa
} from "@shared/api";

export interface ImmigrationDashboardStats {
  totalPermits?: number;
  activePermits?: number;
  expiredPermits?: number;
  pendingApplications?: number;
  totalVisas?: number;
  activeVisas?: number;
  expiredVisas?: number;
  totalResidents?: number;
}

export interface ListVisasResponse {
  items: Visa[];
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const USE_MOCK =
  (import.meta.env.VITE_USE_MOCK as string | undefined) === "true";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      ...init,
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 401) {
        throw new AuthError(text || "Authentication failed");
      }
      throw new Error(text || `HTTP ${res.status}`);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError("Unable to connect to server");
    }
    throw error;
  }
}

export const Api = {
  async login(payload: LoginRequest): Promise<AuthSession> {
    if (USE_MOCK) return mock.login(payload);
    return http<AuthSession>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async registerResident(payload: ResidentRegistrationRequest): Promise<AuthSession & { resident: Resident }> {
    if (USE_MOCK) return mock.registerResident(payload);
    return http<AuthSession & { resident: Resident }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Website Management API
  async createWebsite(payload: CreateWebsiteRequest): Promise<DepartmentWebsite> {
    if (USE_MOCK) return mock.createWebsite(payload);
    return http<DepartmentWebsite>("/websites", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async getWebsite(): Promise<DepartmentWebsite | null> {
    if (USE_MOCK) return mock.getWebsite();
    return http<DepartmentWebsite | null>("/websites");
  },
  async updateWebsite(payload: UpdateWebsiteRequest): Promise<DepartmentWebsite> {
    if (USE_MOCK) return mock.updateWebsite(payload);
    return http<DepartmentWebsite>("/websites", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  async publishWebsite(): Promise<{ success: boolean; message: string }> {
    if (USE_MOCK) return mock.publishWebsite();
    return http<{ success: boolean; message: string }>("/websites/publish", {
      method: "POST",
    });
  },
  async getThemes(): Promise<WebsiteTheme[]> {
    if (USE_MOCK) return mock.getThemes();
    return http<WebsiteTheme[]>("/themes");
  },
  async getPages(): Promise<WebsitePage[]> {
    if (USE_MOCK) return mock.getPages();
    return http<WebsitePage[]>("/pages");
  },
  async getPage(pageId: string): Promise<WebsitePage | null> {
    if (USE_MOCK) return mock.getPage(pageId);
    return http<WebsitePage | null>(`/pages/${pageId}`);
  },
  async updatePage(pageId: string, payload: UpdatePageRequest): Promise<WebsitePage> {
    if (USE_MOCK) return mock.updatePage(pageId, payload);
    return http<WebsitePage>(`/pages/${pageId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  async residentLogin(payload: ResidentLoginRequest): Promise<AuthSession> {
    if (USE_MOCK) return mock.residentLogin(payload);
    return http<AuthSession>("/auth/resident-login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async residentAlternativeLogin(payload: ResidentAlternativeLoginRequest): Promise<AuthSession> {
    if (USE_MOCK) return mock.residentAlternativeLogin(payload);
    return http<AuthSession>("/auth/resident-alternative-login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async searchResident(
    payload: SearchResidentRequest,
  ): Promise<SearchResidentResponse> {
    if (USE_MOCK) return mock.searchResident(payload);
    return http<SearchResidentResponse>("/residents/search", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async upsertResident(
    payload: UpsertResidentRequest,
  ): Promise<UpsertResidentResponse> {
    validatePatientData(payload.resident);
    if (USE_MOCK) return mock.upsertResident(payload);
    return http<UpsertResidentResponse>("/residents", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async createCase(payload: CreateCaseRequest): Promise<CreateCaseResponse> {
    if (USE_MOCK) return mock.createCase(payload);
    return http<CreateCaseResponse>("/cases", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async createPermit(payload: CreatePermitRequest): Promise<CreatePermitResponse> {
    if (USE_MOCK) return mock.createPermit(payload);
    return http<CreatePermitResponse>("/permits", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async getCaseStats(params: { stationId?: string; officerId?: string }): Promise<DashboardStats> {
    if (USE_MOCK) return mock.getCaseStats(params);
    const queryParams = new URLSearchParams();
    if (params.stationId) queryParams.append("stationId", params.stationId);
    if (params.officerId) queryParams.append("officerId", params.officerId);
    return http<DashboardStats>(`/cases/stats?${queryParams.toString()}`);
  },
  async listCases(params?: string | { residentId?: string; stationId?: string; limit?: number }): Promise<ListCasesResponse> {
    if (USE_MOCK) return mock.listCases(params);

    let url = '/cases';
    if (typeof params === 'string') {
      url = `/cases?residentId=${params}`;
    } else if (params) {
      const queryParams = new URLSearchParams();
      if (params.residentId) queryParams.append("residentId", params.residentId);
      if (params.stationId) queryParams.append("stationId", params.stationId);
      if (params.limit) queryParams.append("limit", params.limit.toString());
      url = `/cases?${queryParams.toString()}`;
    }
    return http<ListCasesResponse>(url);
  },
  async listPermits(params?: string | { residentId?: string; officeId?: string; limit?: number }): Promise<ListPermitsResponse> {
    if (USE_MOCK) return mock.listPermits(params);
    let url = '/permits';
    if (typeof params === 'string') {
      url = `/residents/${params}/permits`;
    } else if (params) {
      const queryParams = new URLSearchParams();
      if (params.residentId) queryParams.append("residentId", params.residentId);
      if (params.officeId) queryParams.append("officeId", params.officeId);
      if (params.limit) queryParams.append("limit", params.limit.toString());
      url = `/permits?${queryParams.toString()}`;
    }
    return http<ListPermitsResponse>(url);
  },
  async getPermitStats(params: { officeId?: string; officerId?: string }): Promise<ImmigrationDashboardStats> {
    if (USE_MOCK) return mock.getPermitStats(params);
    const queryParams = new URLSearchParams();
    if (params.officeId) queryParams.append("officeId", params.officeId);
    if (params.officerId) queryParams.append("officerId", params.officerId);
    return http<ImmigrationDashboardStats>(`/permits/stats?${queryParams.toString()}`);
  },
  async getVisaStats(params: { officeId?: string; officerId?: string }): Promise<ImmigrationDashboardStats> {
    if (USE_MOCK) return mock.getVisaStats(params);
    const queryParams = new URLSearchParams();
    if (params.officeId) queryParams.append("officeId", params.officeId);
    if (params.officerId) queryParams.append("officerId", params.officerId);
    return http<ImmigrationDashboardStats>(`/visas/stats?${queryParams.toString()}`);
  },
  async listVisas(params?: { officeId?: string; limit?: number }): Promise<ListVisasResponse> {
    if (USE_MOCK) return mock.listVisas(params);
    const queryParams = new URLSearchParams();
    if (params?.officeId) queryParams.append("officeId", params.officeId);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    return http<ListVisasResponse>(`/visas?${queryParams.toString()}`);
  },
  async registerOfficer(
    payload: RegisterOfficerRequest,
  ): Promise<RegisterOfficerResponse> {
    validateStaffData({
      email: payload.email,
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName,
    });
    if (USE_MOCK) return mock.registerOfficer(payload);
    return http<RegisterOfficerResponse>("/auth/register-officer", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async createFingerprintApplication(data: CreateFingerprintApplicationRequest): Promise<FingerprintApplication> {
    if (USE_MOCK) return mock.createFingerprintApplication(data);
    return http<FingerprintApplication>('/services/fingerprint', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async createLostDocumentReport(data: CreateLostDocumentReportRequest): Promise<LostDocumentReport> {
    if (USE_MOCK) return mock.createLostDocumentReport(data);
    return http<LostDocumentReport>('/services/lost-documents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Lightweight in-browser mock for development and offline demo
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

async function createCardQr(resident: Resident): Promise<string> {
  // In production, backend signs payload; here we encode opaque data for demo only
  return QRCode.toDataURL(JSON.stringify({ cardId: resident.cardId }));
}

import { sha256Hex } from "@/lib/crypto";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 20);
}

function generateNationalCardId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const mock = {
  async login({ email, password }: LoginRequest): Promise<AuthSession> {
    const user = await db.officers.where({ email }).first();
    if (!user) throw new Error("Account not found. Please register.");
    const hash = await sha256Hex(password);
    if (user.passwordHash !== hash) throw new Error("Invalid credentials");
    return {
      userId: user.id,
      role: user.role,
      stationId: user.stationId,
      immigrationOfficeId: user.immigrationOfficeId,
      tokens: { accessToken: uuidv4(), expiresInSec: 3600 },
    };
  },
  async registerOfficer(
    payload: RegisterOfficerRequest,
  ): Promise<RegisterOfficerResponse> {
    const existing = await db.officers
      .where({ email: payload.email })
      .first();
    if (existing) throw new Error("Email already registered");

    const now = new Date().toISOString();
    let stationId: string | undefined;
    let immigrationOfficeId: string | undefined;

    if (payload.stationName) {
      let station = await db.policeStations
        .where({ name: payload.stationName })
        .first();
      if (!station) {
        station = {
          id: uuidv4(),
          name: payload.stationName!,
          code: slugify(payload.stationName!),
          address: "",
          createdAt: now,
          updatedAt: now,
        } as PoliceStation;
        await db.policeStations.put(station);
      }
      stationId = station.id;
    } else if (payload.immigrationOfficeName) {
      let office = await db.immigrationOffices
        .where({ name: payload.immigrationOfficeName })
        .first();
      if (!office) {
        office = {
          id: uuidv4(),
          name: payload.immigrationOfficeName!,
          code: slugify(payload.immigrationOfficeName!),
          address: "",
          createdAt: now,
          updatedAt: now,
        } as ImmigrationOffice;
        await db.immigrationOffices.put(office);
      }
      immigrationOfficeId = office.id;
    }

    const user: Officer = {
      id: uuidv4(),
      stationId,
      immigrationOfficeId,
      email: payload.email,
      passwordHash: await sha256Hex(payload.password),
      role: payload.role || (stationId ? "police_officer" : "immigration_officer"),
      firstName: payload.firstName,
      lastName: payload.lastName,
      badgeNumber: payload.badgeNumber,
      rank: payload.rank,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    await db.officers.put(user);
    return { userId: user.id, stationId, immigrationOfficeId };
  },
  async residentLogin({ identityCardId }: ResidentLoginRequest): Promise<AuthSession> {
    const r = await db.residents.where({ identityCardId }).first();
    if (!r) {
      throw new Error("Invalid identity card ID");
    }
    const resident = r;
    if (!resident.cardQrData) {
      const cardQrData = await createCardQr(resident);
      await db.residents.update(resident.id, { cardQrData });
    }
    return {
      userId: resident.id,
      role: "resident",
      residentId: resident.id,
      tokens: { accessToken: uuidv4(), expiresInSec: 3600 },
    };
  },
  async residentAlternativeLogin({ email, phone, password }: ResidentAlternativeLoginRequest): Promise<AuthSession> {
    let resident;
    if (email) {
      resident = await db.residents.where({ email }).first();
    } else if (phone) {
      resident = await db.residents.where({ phoneAuth: phone }).first();
    }
    if (!resident || !resident.hasPassword) {
      throw new Error("Invalid credentials");
    }
    return {
      userId: resident.id,
      role: "resident",
      residentId: resident.id,
      tokens: { accessToken: uuidv4(), expiresInSec: 3600 },
    };
  },
  async registerResident(residentData: ResidentRegistrationRequest): Promise<AuthSession & { resident: Resident }> {
    if (residentData.nrc) {
      const existingResident = await db.residents.where({ nrc: residentData.nrc }).first();
      if (existingResident) {
        throw new Error("Resident with this NRC already exists");
      }
    }

    const residentId = uuidv4();
    const cardId = uuidv4().replace(/-/g, "").slice(0, 16);

    const resident: Resident = {
      id: residentId,
      nrc: residentData.nrc || "",
      passportNumber: residentData.passportNumber,
      firstName: residentData.firstName,
      lastName: residentData.lastName,
      gender: residentData.gender,
      dob: residentData.dob,
      phone: residentData.phone,
      address: residentData.address,
      emergencyContactName: residentData.emergencyContactName,
      emergencyContactPhone: residentData.emergencyContactPhone,
      occupation: residentData.occupation,
      maritalStatus: residentData.maritalStatus,
      nationality: residentData.nationality,
      residencyStatus: residentData.residencyStatus || "citizen",
      cardId,
      cardQrData: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      identityCardId: residentData.nrc || residentData.passportNumber || "",
      email: residentData.email,
      hasPassword: !!residentData.password,
    } as any;

    resident.cardQrData = await createCardQr(resident);

    await db.residents.add(resident);

    return {
      userId: resident.id,
      role: "resident",
      residentId: resident.id,
      tokens: { accessToken: uuidv4(), expiresInSec: 3600 },
      resident
    };
  },
  async searchResident({
    nrc,
    passportNumber,
    cardIdOrQr,
  }: SearchResidentRequest): Promise<SearchResidentResponse> {
    if (nrc) {
      const resident = await db.residents.where({ nrc }).first();
      return { resident: resident || undefined };
    }
    if (passportNumber) {
      const resident = await db.residents.where({ passportNumber }).first();
      return { resident: resident || undefined };
    }
    if (cardIdOrQr) {
      try {
        let payload = cardIdOrQr;
        if (cardIdOrQr.startsWith("data:image")) {
          return { resident: undefined };
        }
        const parsed = JSON.parse(payload);
        if (parsed.cardId) {
          const resident = await db.residents
            .where({ cardId: parsed.cardId })
            .first();
          return { resident: resident || undefined };
        }
      } catch { }
    }
    return { resident: undefined };
  },
  async upsertResident({ resident }: UpsertResidentRequest): Promise<UpsertResidentResponse> {
    const now = new Date().toISOString();
    if (!resident.id) resident.id = uuidv4();
    if (!resident.createdAt) resident.createdAt = now;
    resident.updatedAt = now;
    if (!resident.cardQrData) resident.cardQrData = await createCardQr(resident as any);

    await db.residents.put(resident as any);
    return { resident: resident as any };
  },
  async createCase(req: CreateCaseRequest): Promise<CreateCaseResponse> {
    const now = new Date().toISOString();
    const caseRecord = {
      id: uuidv4(),
      residentId: req.reporterId,
      stationId: req.stationId,
      caseNumber: `CASE-${Date.now()}`,
      title: req.title,
      description: req.description,
      category: req.category,
      priority: req.priority,
      status: "reported" as const,
      createdAt: now,
      updatedAt: now,
    } as any;
    await db.cases.put(caseRecord);
    return { case: caseRecord };
  },
  async createPermit(req: CreatePermitRequest): Promise<CreatePermitResponse> {
    const now = new Date().toISOString();
    const permit = {
      id: uuidv4(),
      residentId: req.residentId,
      immigrationOfficeId: req.immigrationOfficeId,
      permitNumber: `PERMIT-${Date.now()}`,
      type: req.type,
      validFrom: req.validFrom,
      validUntil: req.validUntil,
      status: "pending" as const,
      createdAt: now,
      updatedAt: now,
    } as any;
    await db.permits.put(permit);
    return { permit };
  },
  async listCases(params?: string | { residentId?: string; stationId?: string; limit?: number }): Promise<ListCasesResponse> {
    let items: Case[];
    let residentId: string | undefined;

    if (typeof params === 'string') {
      residentId = params;
    } else if (params) {
      residentId = params.residentId;
    }

    if (residentId) {
      items = await db.cases.where({ residentId }).reverse().sortBy('updatedAt');
    } else {
      items = await db.cases.orderBy('updatedAt').reverse().toArray();
    }

    if (params && typeof params !== 'string' && params.limit) {
      items = items.slice(0, params.limit);
    }

    return { items };
  },
  async listPermits(params?: string | { residentId?: string; officeId?: string; limit?: number }): Promise<ListPermitsResponse> {
    let query = db.permits.orderBy('updatedAt').reverse();
    if (typeof params === 'string') {
      query = db.permits.where({ residentId: params }).reverse().sortBy('updatedAt') as any;
    } else if (params) {
      if (params.residentId) {
        query = db.permits.where({ residentId: params.residentId }).reverse().sortBy('updatedAt') as any;
      } else if (params.officeId) {
        // Dexie might not support complex filtering easily without compound index, but for mock:
        const all = await db.permits.toArray();
        const filtered = all.filter(p => p.immigrationOfficeId === params.officeId);
        return { items: filtered.slice(0, params.limit || 50) };
      }
    }
    const items = await query.toArray();
    return { items: params && typeof params !== 'string' && params.limit ? items.slice(0, params.limit) : items };
  },
  async getPermitStats(params: { officeId?: string; officerId?: string }): Promise<ImmigrationDashboardStats> {
    const permits = await db.permits.toArray();
    const filteredPermits = params.officeId ? permits.filter(p => p.immigrationOfficeId === params.officeId) : permits;

    return {
      totalPermits: filteredPermits.length,
      activePermits: filteredPermits.filter(p => p.status === 'approved').length,
      expiredPermits: filteredPermits.filter(p => new Date(p.validUntil) < new Date()).length,
      pendingApplications: 0, // Mock
      totalResidents: await db.residents.count()
    };
  },
  async getVisaStats(params: { officeId?: string; officerId?: string }): Promise<ImmigrationDashboardStats> {
    const visas = await db.visas.toArray();
    const filteredVisas = params.officeId ? visas.filter(v => v.immigrationOfficeId === params.officeId) : visas;

    return {
      totalVisas: filteredVisas.length,
      activeVisas: filteredVisas.filter(v => v.status === 'approved').length,
      expiredVisas: filteredVisas.filter(v => {
        const expiry = (v as any).expiryDate || (v as any).validUntil;
        return expiry ? new Date(expiry) < new Date() : false;
      }).length
    };
  },
  async listVisas(params?: { officeId?: string; limit?: number }): Promise<ListVisasResponse> {
    let visas = await db.visas.toArray();
    if (params?.officeId) {
      visas = visas.filter(v => v.immigrationOfficeId === params.officeId);
    }
    // Sort by updatedAt desc
    visas.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    if (params?.limit) {
      visas = visas.slice(0, params.limit);
    }
    return { items: visas };
  },
  async getCaseStats(params: { stationId?: string; officerId?: string }): Promise<DashboardStats> {
    const cases = await db.cases.toArray();
    const totalCases = cases.length;
    const openCases = cases.filter(c => c.status === 'reported').length;
    const inProgressCases = cases.filter(c => c.status === 'investigating').length;
    const closedCases = cases.filter(c => c.status === 'closed' || c.status === 'resolved').length;
    const highPriorityCases = cases.filter(c => c.priority === 'high' || c.priority === 'urgent').length;
    const mediumPriorityCases = cases.filter(c => c.priority === 'medium').length;
    const lowPriorityCases = cases.filter(c => c.priority === 'low').length;

    return {
      totalCases,
      openCases,
      inProgressCases,
      closedCases,
      highPriorityCases,
      mediumPriorityCases,
      lowPriorityCases
    };
  },

  // Website Management Mock API
  async createWebsite(payload: CreateWebsiteRequest): Promise<DepartmentWebsite> {
    const now = new Date().toISOString();
    const website: DepartmentWebsite = {
      id: uuidv4(),
      stationId: 'mock-station-id',
      subdomain: payload.subdomain,
      title: payload.title,
      description: payload.description,
      themeId: payload.themeId,
      isPublished: false,
      createdAt: now,
      updatedAt: now,
    } as any;
    await db.websites.put(website);
    return website;
  },
  async getWebsite(): Promise<DepartmentWebsite | null> {
    const website = await db.websites.toCollection().first();
    return website || null;
  },
  async updateWebsite(payload: UpdateWebsiteRequest): Promise<DepartmentWebsite> {
    const website = await db.websites.toCollection().first();
    if (!website) throw new Error("Website not found");
    const updated = {
      ...website,
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    await db.websites.put(updated);
    return updated;
  },
  async publishWebsite(websiteId?: string): Promise<{ success: boolean; message: string; deploymentUrl?: string }> {
    const website = websiteId ?
      await db.websites.get(websiteId) :
      await db.websites.toCollection().first();

    if (!website) throw new Error("Website not found");

    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate deployment URL based on domain settings
    const deploymentUrl = website.domainName ?
      `https://${website.domainName}` :
      `https://${website.subdomain}.healthcaresite.com`;

    // Update website status
    await db.websites.update(website.id, {
      isPublished: true,
      publishedAt: new Date().toISOString(),
      deploymentUrl
    });

    return {
      success: true,
      message: "Website published successfully",
      deploymentUrl
    };
  },
  async getThemes(): Promise<WebsiteTheme[]> {
    return [
      {
        id: "modern-hospital",
        name: "Modern Hospital",
        description: "Clean and professional design for general hospitals",
        previewImageUrl: "/themes/modern-hospital-preview.jpg",
        cssTemplate: "",
        layoutConfig: {
          headerStyle: "modern",
          footerStyle: "minimal",
          sections: ["hero", "services", "doctors", "testimonials", "contact"],
          heroLayout: "centered",
          servicesLayout: "grid-3"
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any,
      {
        id: "pediatric-care",
        name: "Pediatric Care",
        description: "Friendly and colorful design for children's hospitals",
        previewImageUrl: "/themes/pediatric-preview.jpg",
        cssTemplate: "",
        layoutConfig: {
          headerStyle: "playful",
          footerStyle: "colorful",
          sections: ["hero", "services", "fun-facts", "doctors", "parents-info", "contact"],
          heroLayout: "illustration",
          servicesLayout: "cards-colorful"
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any,
    ];
  },
  async getPages(): Promise<WebsitePage[]> {
    return [
      {
        id: "home",
        websiteId: "default",
        title: "Home",
        slug: "home",
        content: {
          hero: {
            title: "Welcome to City General Hospital",
            subtitle: "Providing world-class healthcare with compassion",
            ctaText: "Book Appointment",
            ctaLink: "/appointments"
          }
        },
        isPublished: true,
        sortOrder: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any,
      {
        id: "about",
        websiteId: "default",
        title: "About Us",
        slug: "about",
        content: {
          hero: {
            title: "About Our Hospital",
            subtitle: "Serving the community for over 50 years",
          }
        },
        isPublished: true,
        sortOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any
    ];
  },
  async getPage(pageId: string): Promise<WebsitePage | null> {
    const pages = await this.getPages();
    return pages.find(p => p.id === pageId) || null;
  },
  async updatePage(pageId: string, payload: UpdatePageRequest): Promise<WebsitePage> {
    const pages = await this.getPages();
    const page = pages.find(p => p.id === pageId);
    if (!page) throw new Error("Page not found");

    return {
      ...page,
      ...payload,
      updatedAt: new Date().toISOString()
    };
  },

  async createFingerprintApplication(data: CreateFingerprintApplicationRequest): Promise<FingerprintApplication> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      id: uuidv4(),
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  async createLostDocumentReport(data: CreateLostDocumentReportRequest): Promise<LostDocumentReport> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      id: uuidv4(),
      ...data,
      status: 'reported',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
};

export async function enqueueSync(op: Parameters<typeof db.syncQueue.add>[0]) {
  await db.syncQueue.add(op as any);
}
