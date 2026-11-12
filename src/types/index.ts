export type Role = 'ADMIN' | 'STAFF';

export interface UserProfile {
  id: string;
  staffId?: string;
  name: string;
  email?: string;
  role: Role;
  title: string;
  department: string;
  status?: 'ACTIVE' | 'INACTIVE';
  registeredDate?: string;
  password?: string;
  facePhoto?: string;
  hasFaceBiometric?: boolean;
  faceEnrollmentDate?: string;
}

export type BottleStatus = 'IN_STORE' | 'IN_LAB' | 'PENDING_DISPOSAL' | 'DISPOSED';

export type GHSHazard =
  | 'Flammable' // Mudah Terbakar
  | 'Corrosive' // Mengakis
  | 'Toxic' // Toksik / Beracun
  | 'Health Hazard' // Bahaya Kesihatan Kronik
  | 'Oxidizer' // Pengoksida
  | 'Environmental Hazard' // Bahaya Alam Sekitar
  | 'Explosive' // Mudah Meletup
  | 'Compressed Gas' // Gas Bermatpat
  | 'Irritant / Harmful'; // Merengsa / Berbahaya

export interface AuditLogEntry {
  logId: string;
  timestamp: string;
  action: 'STOCK_IN' | 'MOVED' | 'MARKED_DISPOSAL' | 'CONFIRMED_DISPOSAL';
  performedBy: string; // contoh: Dr. Farhan (Admin) atau Ahmad Zaki (Pembantu Makmal)
  fromLocation?: string;
  toLocation?: string;
  notes?: string;
}

export interface ChemicalBottle {
  id: string; // cth: CIS-2026-0001
  chemicalName: string;
  casNumber?: string;
  brand: string;
  containerSize: string; // cth: 2.5 L, 500 g, 1 L
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  receivedDate: string; // YYYY-MM-DD
  supplierName: string;
  locationId: string;
  hazardClasses: GHSHazard[];
  sdsLink: string;
  status: BottleStatus;
  disposalReason?: 'Habis Digunakan' | 'Tamat Tempoh' | 'Rosak' | string;
  disposalDate?: string;
  disposalRefNo?: string;
  auditLogs: AuditLogEntry[];
}

export interface ChemicalThreshold {
  chemicalName: string;
  minStockCount: number; // Nilai lalai: 2
}

export interface Location {
  id: string;
  name: string;
  type: 'STORE' | 'LAB';
  description?: string;
}

export interface AppStateData {
  bottles: ChemicalBottle[];
  locations: Location[];
  thresholds: ChemicalThreshold[];
  nextSequenceNumber: number;
  users?: UserProfile[];
}
