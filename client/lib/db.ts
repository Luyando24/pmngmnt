import Dexie, { Table } from "dexie";
import type {
  Case,
  PoliceStation,
  ImmigrationOffice,
  Permit,
  Visa,
  Resident,
  Officer,
  Suspect,
  CaseSuspect,
  SyncQueueItem,
  DepartmentWebsite,
  WebsitePage,
  WebsiteComponent,
  WebsiteMedia,
} from "@shared/api";

export class IPIMSDb extends Dexie {
  policeStations!: Table<PoliceStation, string>;
  immigrationOffices!: Table<ImmigrationOffice, string>;
  officers!: Table<Officer, string>;
  residents!: Table<Resident, string>;
  cases!: Table<Case, string>;
  suspects!: Table<Suspect, string>;
  caseSuspects!: Table<CaseSuspect, string>;
  permits!: Table<Permit, string>;
  visas!: Table<Visa, string>;
  websites!: Table<DepartmentWebsite, string>;
  websitePages!: Table<WebsitePage, string>;
  websiteComponents!: Table<WebsiteComponent, string>;
  websiteMedia!: Table<WebsiteMedia, string>;
  syncQueue!: Table<SyncQueueItem, string>;

  constructor() {
    super("ipims_db_v1");
    this.version(1).stores({
      residents: "id,nrc,cardId,identityCardId,updatedAt",
      cases: "id,caseNumber,stationId,assignedOfficerId,status,updatedAt",
      permits: "id,permitNumber,residentId,immigrationOfficeId,status,updatedAt",
      visas: "id,visaNumber,residentId,immigrationOfficeId,status,updatedAt",
      syncQueue: "id,createdAt",
    });
    this.version(2).stores({
      policeStations: "id,code,name,district,province",
      immigrationOffices: "id,code,name,district,province,borderPost",
      officers: "id,email,stationId,immigrationOfficeId,role,isActive,badgeNumber",
    });
    this.version(3).stores({
      suspects: "id,nrc,firstName,lastName,status,updatedAt",
      caseSuspects: "id,caseId,suspectId,role",
      websites: "id,stationId,immigrationOfficeId,subdomain,is_published,published_at,deployment_url,ssl_enabled",
      websitePages: "id,website_id,title,slug,page_type",
      websiteComponents: "id,page_id,component_type,order_index",
      websiteMedia: "id,website_id,filename,file_type",
    });
  }
}

export const db = new IPIMSDb();
