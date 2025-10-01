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
} from "@shared/api";

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
  async registerResident(payload: ResidentRegistrationRequest): Promise<UpsertResidentResponse> {
    if (USE_MOCK) return mock.registerResident(payload);
    return http<UpsertResidentResponse>("/residents/register", {
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
  async listCases(residentId?: string): Promise<ListCasesResponse> {
    if (USE_MOCK) return mock.listCases(residentId);
    const url = residentId ? `/cases?residentId=${residentId}` : '/cases';
    return http<ListCasesResponse>(url);
  },
  async listPermits(residentId: string): Promise<ListPermitsResponse> {
     if (USE_MOCK) return mock.listPermits(residentId);
     return http<ListPermitsResponse>(`/residents/${residentId}/permits`);
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
    
    if (payload.departmentType === 'police') {
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
    } else {
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
      role: payload.role || "officer",
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
  async residentLogin({ nationalId }: ResidentLoginRequest): Promise<AuthSession> {
    const r = await db.residents.where({ nationalId }).first();
    if (!r) {
      throw new Error("Invalid national ID");
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
    // Note: In a real implementation, verify password hash
    return {
      userId: resident.id,
      role: "resident",
      residentId: resident.id,
      tokens: { accessToken: uuidv4(), expiresInSec: 3600 },
     };
  },
  async registerResident(residentData: ResidentRegistrationRequest): Promise<UpsertResidentResponse> {
    const existingResident = await db.residents.where({ nationalId: residentData.nationalId }).first();
    if (existingResident) {
      throw new Error("Resident with this National ID already exists");
    }
    
    const residentId = uuidv4();
    const nationalCardId = generateNationalCardId();
    const cardId = uuidv4().replace(/-/g, "").slice(0, 16);
    
    const resident: Resident = {
      id: residentId,
      nationalId: residentData.nationalId,
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
      residencyStatus: residentData.residencyStatus,
      cardId,
      cardQrData: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    resident.cardQrData = await createCardQr(resident);
    
    await db.residents.add(resident);
    
    return { resident };
  },
  async searchResident({
    nationalId,
    passportNumber,
    cardIdOrQr,
  }: SearchResidentRequest): Promise<SearchResidentResponse> {
    // Initialize with sample residents if database is empty
    const count = await db.residents.count();
    if (count === 0) {
      const sampleResidents: Resident[] = [
        {
          id: 'resident_001',
          nationalId: 'NRC123456789',
          passportNumber: 'ZM1234567',
          firstName: 'Mary',
          lastName: 'Banda',
          gender: 'female',
          dob: '1985-03-15',
          phone: '+260977123456',
          address: '123 Independence Avenue, Lusaka',
          emergencyContactName: 'John Banda',
          emergencyContactPhone: '+260966789012',
          occupation: 'Teacher',
          maritalStatus: 'married',
          nationality: 'Zambian',
          residencyStatus: 'citizen',
          cardId: 'CARD12345678',
          cardQrData: JSON.stringify({ nationalId: 'NRC123456789', cardId: 'CARD12345678' }),
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'resident_002',
          nationalId: 'NRC987654321',
          passportNumber: 'ZM7654321',
          firstName: 'Peter',
          lastName: 'Mwanza',
          gender: 'male',
          dob: '1990-08-20',
          phone: '+260955123456',
          address: '456 Cairo Road, Lusaka',
          emergencyContactName: 'Grace Mwanza',
          emergencyContactPhone: '+260977654321',
          occupation: 'Engineer',
          maritalStatus: 'single',
          nationality: 'Zambian',
          residencyStatus: 'citizen',
          cardId: 'CARD87654321',
          cardQrData: JSON.stringify({ nationalId: 'NRC987654321', cardId: 'CARD87654321' }),
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'resident_003',
          nationalId: 'NRC555666777',
          passportNumber: 'UK9876543',
          firstName: 'Sarah',
          lastName: 'Johnson',
          gender: 'female',
          dob: '1988-12-10',
          phone: '+260966555777',
          address: '789 Great East Road, Lusaka',
          emergencyContactName: 'David Johnson',
          emergencyContactPhone: '+260955666888',
          occupation: 'Doctor',
          maritalStatus: 'married',
          nationality: 'British',
          residencyStatus: 'permanent_resident',
          cardId: 'CARD55566677',
          cardQrData: JSON.stringify({ nationalId: 'NRC555666777', cardId: 'CARD55566677' }),
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];
      
      for (const sampleResident of sampleResidents) {
        await db.residents.put(sampleResident);
      }
    }

    if (nationalId) {
      const resident = await db.residents.where({ nationalId }).first();
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
          // Not a decoded string, ignore for mock
          return { resident: undefined };
        }
        const parsed = JSON.parse(payload);
        if (parsed.cardId) {
          const resident = await db.residents
            .where({ cardId: parsed.cardId })
            .first();
          return { resident: resident || undefined };
        }
      } catch {}
    }
    return { resident: undefined };
  },
  async upsertResident({
    resident,
  }: UpsertResidentRequest): Promise<UpsertResidentResponse> {
    // Initialize with sample residents if database is empty
    const count = await db.residents.count();
    if (count === 0) {
      const sampleResidents: Resident[] = [
        {
          id: 'resident_001',
          nationalId: 'NRC123456789',
          passportNumber: 'ZM1234567',
          firstName: 'Mary',
          lastName: 'Banda',
          gender: 'female',
          dob: '1985-03-15',
          phone: '+260977123456',
          address: '123 Independence Avenue, Lusaka',
          emergencyContactName: 'John Banda',
          emergencyContactPhone: '+260966789012',
          occupation: 'Teacher',
          maritalStatus: 'married',
          nationality: 'Zambian',
          residencyStatus: 'citizen',
          cardId: 'CARD12345678',
          cardQrData: JSON.stringify({ nationalId: 'NRC123456789', cardId: 'CARD12345678' }),
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'resident_002',
          nationalId: 'NRC987654321',
          passportNumber: 'ZM7654321',
          firstName: 'Peter',
          lastName: 'Mwanza',
          gender: 'male',
          dob: '1990-08-20',
          phone: '+260955123456',
          address: '456 Cairo Road, Lusaka',
          emergencyContactName: 'Grace Mwanza',
          emergencyContactPhone: '+260977654321',
          occupation: 'Engineer',
          maritalStatus: 'single',
          nationality: 'Zambian',
          residencyStatus: 'citizen',
          cardId: 'CARD87654321',
          cardQrData: JSON.stringify({ nationalId: 'NRC987654321', cardId: 'CARD87654321' }),
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'resident_003',
          nationalId: 'NRC555666777',
          passportNumber: 'UK9876543',
          firstName: 'Sarah',
          lastName: 'Johnson',
          gender: 'female',
          dob: '1988-12-10',
          phone: '+260966555777',
          address: '789 Great East Road, Lusaka',
          emergencyContactName: 'David Johnson',
          emergencyContactPhone: '+260955666888',
          occupation: 'Doctor',
          maritalStatus: 'married',
          nationality: 'British',
          residencyStatus: 'permanent_resident',
          cardId: 'CARD55566677',
          cardQrData: JSON.stringify({ nationalId: 'NRC555666777', cardId: 'CARD55566677' }),
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];
      
      for (const sampleResident of sampleResidents) {
        await db.residents.put(sampleResident);
      }
    }

    const existing = resident.id ? await db.residents.get(resident.id) : undefined;
    const id = existing?.id || uuidv4();
    const now = new Date().toISOString();
    const full: Resident = {
      id,
      nationalId: resident.nationalId,
      passportNumber: resident.passportNumber || existing?.passportNumber,
      firstName: resident.firstName || existing?.firstName || "",
      lastName: resident.lastName || existing?.lastName || "",
      gender: resident.gender || existing?.gender,
      dob: resident.dob || existing?.dob,
      phone: resident.phone || existing?.phone,
      address: resident.address || existing?.address,
      emergencyContactName:
        resident.emergencyContactName || existing?.emergencyContactName,
      emergencyContactPhone:
        resident.emergencyContactPhone || existing?.emergencyContactPhone,
      occupation: resident.occupation || existing?.occupation,
      maritalStatus: resident.maritalStatus || existing?.maritalStatus,
      nationality: resident.nationality || existing?.nationality,
      residencyStatus: resident.residencyStatus || existing?.residencyStatus,
      cardId: existing?.cardId || uuidv4().replace(/-/g, "").slice(0, 16),
      cardQrData: existing?.cardQrData || "",
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };
    if (!full.cardQrData) full.cardQrData = await createCardQr(full);
    await db.residents.put(full);
    return { resident: full };
  },
  async createCase(req: CreateCaseRequest): Promise<CreateCaseResponse> {
    const now = new Date().toISOString();
    const caseRecord = {
      id: uuidv4(),
      residentId: req.residentId,
      stationId: req.stationId,
      officerId: req.officerId,
      caseNumber: `CASE-${Date.now()}`,
      title: req.title,
      description: req.description,
      category: req.category,
      priority: req.priority,
      status: "open" as const,
      createdAt: now,
      updatedAt: now,
    };
    await db.cases.put(caseRecord);
    return { case: caseRecord };
  },
  async createPermit(req: CreatePermitRequest): Promise<CreatePermitResponse> {
    const now = new Date().toISOString();
    const permit = {
      id: uuidv4(),
      residentId: req.residentId,
      immigrationOfficeId: req.immigrationOfficeId,
      officerId: req.officerId,
      permitNumber: `PERMIT-${Date.now()}`,
      type: req.type,
      description: req.description,
      validFrom: req.validFrom,
      validUntil: req.validUntil,
      status: "active" as const,
      createdAt: now,
      updatedAt: now,
    };
    await db.permits.put(permit);
    return { permit };
  },
  async listCases(residentId?: string): Promise<ListCasesResponse> {
    let query = db.cases.orderBy('updatedAt').reverse();
    if (residentId) {
      query = db.cases.where({ residentId }).reverse().sortBy('updatedAt');
    }
    const items = await query.toArray();
    return { items };
  },
  async listPermits(residentId: string): Promise<ListPermitsResponse> {
    const items = await db.permits
      .where({ residentId })
      .reverse()
      .sortBy("updatedAt");
    return { items };
  },

  // Website Management Mock API
  async createWebsite(payload: CreateWebsiteRequest): Promise<DepartmentWebsite> {
    const now = new Date().toISOString();
    const website: DepartmentWebsite = {
      id: uuidv4(),
      department_id: payload.departmentId,
      name: payload.name,
      domain: payload.domain,
      subdomain: payload.subdomain,
      title: payload.title,
      description: payload.description,
      theme_id: payload.themeId,
      is_published: false,
      created_at: now,
      updated_at: now,
    };
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
      updated_at: new Date().toISOString(),
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
    const deploymentUrl = website.domain ? 
      `https://${website.domain}` : 
      `https://${website.subdomain}.healthcaresite.com`;
    
    // Update website status
    await db.websites.update(website.id, { 
      is_published: true,
      published_at: new Date().toISOString(),
      deployment_url: deploymentUrl
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
        preview_image: "/themes/modern-hospital-preview.jpg",
        css_variables: JSON.stringify({
          primaryColor: "#3b82f6",
          secondaryColor: "#64748b",
          accentColor: "#10b981",
          backgroundColor: "#ffffff",
          textColor: "#1f2937",
          fontFamily: "Inter, sans-serif",
          headerHeight: "80px",
          borderRadius: "8px"
        }),
        layout_config: JSON.stringify({
          headerStyle: "modern",
          footerStyle: "minimal",
          sections: ["hero", "services", "doctors", "testimonials", "contact"],
          heroLayout: "centered",
          servicesLayout: "grid-3"
        }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "pediatric-care",
        name: "Pediatric Care",
        description: "Friendly and colorful design for children's hospitals",
        preview_image: "/themes/pediatric-preview.jpg",
        css_variables: JSON.stringify({
          primaryColor: "#f59e0b",
          secondaryColor: "#06b6d4",
          accentColor: "#ec4899",
          backgroundColor: "#fef3c7",
          textColor: "#374151",
          fontFamily: "Nunito, sans-serif",
          headerHeight: "90px",
          borderRadius: "16px"
        }),
        layout_config: JSON.stringify({
          headerStyle: "playful",
          footerStyle: "colorful",
          sections: ["hero", "services", "fun-facts", "doctors", "parents-info", "contact"],
          heroLayout: "illustration",
          servicesLayout: "cards-colorful"
        }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "dental-clinic",
        name: "Dental Clinic",
        description: "Professional and trustworthy design for dental practices",
        preview_image: "/themes/dental-preview.jpg",
        css_variables: JSON.stringify({
          primaryColor: "#0ea5e9",
          secondaryColor: "#475569",
          accentColor: "#22c55e",
          backgroundColor: "#f8fafc",
          textColor: "#1e293b",
          fontFamily: "Poppins, sans-serif",
          headerHeight: "75px",
          borderRadius: "6px"
        }),
        layout_config: JSON.stringify({
          headerStyle: "professional",
          footerStyle: "detailed",
          sections: ["hero", "services", "technology", "team", "before-after", "contact"],
          heroLayout: "split",
          servicesLayout: "list-detailed"
        }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "specialty-care",
        name: "Specialty Care",
        description: "Elegant design for specialized medical centers",
        preview_image: "/themes/specialty-preview.jpg",
        css_variables: JSON.stringify({
          primaryColor: "#7c3aed",
          secondaryColor: "#6b7280",
          accentColor: "#f59e0b",
          backgroundColor: "#ffffff",
          textColor: "#111827",
          fontFamily: "Merriweather, serif",
          headerHeight: "85px",
          borderRadius: "4px"
        }),
        layout_config: JSON.stringify({
          headerStyle: "elegant",
          footerStyle: "comprehensive",
          sections: ["hero", "specialties", "expertise", "research", "team", "contact"],
          heroLayout: "minimal",
          servicesLayout: "grid-2"
        }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "wellness-center",
        name: "Wellness Center",
        description: "Calming and natural design for wellness and preventive care",
        preview_image: "/themes/wellness-preview.jpg",
        css_variables: JSON.stringify({
          primaryColor: "#059669",
          secondaryColor: "#6b7280",
          accentColor: "#84cc16",
          backgroundColor: "#f0fdf4",
          textColor: "#065f46",
          fontFamily: "Source Sans Pro, sans-serif",
          headerHeight: "70px",
          borderRadius: "12px"
        }),
        layout_config: JSON.stringify({
          headerStyle: "natural",
          footerStyle: "organic",
          sections: ["hero", "wellness-programs", "holistic-care", "practitioners", "testimonials", "contact"],
          heroLayout: "nature-focused",
          servicesLayout: "organic-grid"
        }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "emergency-care",
        name: "Emergency Care",
        description: "Urgent and accessible design for emergency medical services",
        preview_image: "/themes/emergency-preview.jpg",
        css_variables: JSON.stringify({
          primaryColor: "#dc2626",
          secondaryColor: "#374151",
          accentColor: "#fbbf24",
          backgroundColor: "#ffffff",
          textColor: "#1f2937",
          fontFamily: "Roboto, sans-serif",
          headerHeight: "60px",
          borderRadius: "4px"
        }),
        layout_config: JSON.stringify({
          headerStyle: "urgent",
          footerStyle: "essential",
          sections: ["hero", "emergency-services", "quick-access", "location", "contact"],
          heroLayout: "emergency-focused",
          servicesLayout: "priority-list"
        }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  },
  async getPages(): Promise<WebsitePage[]> {
    const pages = await db.websitePages.toArray();
    return pages;
  },
  async getPage(pageId: string): Promise<WebsitePage | null> {
    const page = await db.websitePages.get(pageId);
    return page || null;
  },
  async updatePage(pageId: string, payload: UpdatePageRequest): Promise<WebsitePage> {
    const page = await db.websitePages.get(pageId);
    if (!page) throw new Error("Page not found");
    const updated = {
      ...page,
      ...payload,
      updated_at: new Date().toISOString(),
    };
    await db.websitePages.put(updated);
    return updated;
  },
  

};

export async function enqueueSync(op: Parameters<typeof db.syncQueue.add>[0]) {
  await db.syncQueue.add(op as any);
}
