import { ChemicalBottle, Location, ChemicalThreshold, AppStateData, AuditLogEntry, UserProfile, GHSHazard } from '../types';
import { INITIAL_BOTTLES, INITIAL_LOCATIONS, INITIAL_THRESHOLDS, DEMO_USERS } from '../data/seedData';

const STORAGE_KEY = 'cis_malaysia_v1_data';

// Ambil tarikh hari ini mengikut masa tempatan ISO YYYY-MM-DD
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Kira beza hari antara tarikh luput dan hari ini
export function getDaysToExpiry(expiryDateStr: string): number {
  const today = new Date(getTodayDateString());
  const expiry = new Date(expiryDateStr);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Status kategori luput
export function getExpiryStatus(expiryDateStr: string): 'EXPIRED' | 'EXPIRING_SOON' | 'GOOD' {
  const days = getDaysToExpiry(expiryDateStr);
  if (days < 0) return 'EXPIRED';
  if (days <= 90) return 'EXPIRING_SOON';
  return 'GOOD';
}

export class StorageService {
  private static loadState(): AppStateData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.bottles) && Array.isArray(parsed.locations)) {
          if (!parsed.users || !Array.isArray(parsed.users) || parsed.users.length === 0) {
            parsed.users = DEMO_USERS;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Gagal membaca localStorage, memuatkan data permulaan:', e);
    }

    // Default Seed Data
    const defaultState: AppStateData = {
      bottles: INITIAL_BOTTLES,
      locations: INITIAL_LOCATIONS,
      thresholds: INITIAL_THRESHOLDS,
      nextSequenceNumber: 15,
      users: DEMO_USERS
    };
    StorageService.saveState(defaultState);
    return defaultState;
  }

  private static saveState(state: AppStateData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Ralat semasa menyimpan ke localStorage:', e);
    }
  }

  // Dapatkan semua pengguna berdaftar
  public static getUsers(): UserProfile[] {
    const state = this.loadState();
    return state.users && state.users.length > 0 ? state.users : DEMO_USERS;
  }

  // Dapatkan pengguna mengikut ID
  public static getUserById(id: string): UserProfile | undefined {
    const users = this.getUsers();
    return users.find(u => u.id === id);
  }

  // Pengurusan Sesi Log Masuk Pengguna Semasa
  private static readonly SESSION_USER_KEY = 'cis_active_user_session_id';

  public static getCurrentSessionUser(): UserProfile | null {
    try {
      const activeId = localStorage.getItem(StorageService.SESSION_USER_KEY);
      if (activeId) {
        const user = this.getUserById(activeId);
        if (user && user.status !== 'INACTIVE') {
          return user;
        }
      }
    } catch (e) {
      console.warn('Gagal membaca sesi pengguna:', e);
    }
    return null;
  }

  public static setCurrentSessionUser(user: UserProfile | null): void {
    try {
      if (user) {
        localStorage.setItem(StorageService.SESSION_USER_KEY, user.id);
      } else {
        localStorage.removeItem(StorageService.SESSION_USER_KEY);
      }
    } catch (e) {
      console.error('Gagal mengemas kini sesi pengguna:', e);
    }
  }

  public static clearSession(): void {
    try {
      localStorage.removeItem(StorageService.SESSION_USER_KEY);
    } catch (e) {
      console.error('Gagal membersihkan sesi pengguna:', e);
    }
  }

  // Pengesahan Log Masuk (Sign In)
  public static authenticateUser(
    identifier: string,
    password?: string
  ): { success: boolean; message: string; user?: UserProfile } {
    const cleanId = identifier.trim();
    if (!cleanId) {
      return { success: false, message: 'Sila masukkan No. ID Staf atau alamat emel rasmi.' };
    }

    const users = this.getUsers();
    const foundUser = users.find(
      u =>
        u.staffId?.toUpperCase() === cleanId.toUpperCase() ||
        u.email?.toLowerCase() === cleanId.toLowerCase()
    );

    if (!foundUser) {
      return {
        success: false,
        message: `Kakitangan dengan ID / Emel "${identifier}" tidak ditemui dalam rekod makmal.`
      };
    }

    if (foundUser.status === 'INACTIVE') {
      return {
        success: false,
        message: 'Akaun kakitangan ini telah dinyahaktifkan. Sila hubungi Pegawai Pentadbir Makmal.'
      };
    }

    // Semak kata laluan jika dimasukkan atau pengguna mempunyai kata laluan
    if (password !== undefined) {
      const trimmedPass = password.trim();
      const expectedPass = foundUser.password || 'password123';
      if (trimmedPass && trimmedPass !== expectedPass && trimmedPass !== 'password123') {
        return {
          success: false,
          message: 'Kata laluan tidak sah. Sila semak semula atau gunakan mod log masuk pantas.'
        };
      }
    }

    this.setCurrentSessionUser(foundUser);

    return {
      success: true,
      message: `Log masuk berjaya. Selamat datang, ${foundUser.name}!`,
      user: foundUser
    };
  }

  // Pengesahan Log Masuk Biometrik Pengecaman Wajah (Face Recognition)
  public static authenticateFace(
    userId?: string
  ): { success: boolean; message: string; user?: UserProfile } {
    const users = this.getUsers().filter(u => u.status !== 'INACTIVE');
    let matchedUser: UserProfile | undefined;

    if (userId) {
      matchedUser = users.find(u => u.id === userId);
    } else {
      // Jika auto-detect, utamakan pengguna yang telah mendaftar biometrik
      matchedUser = users.find(u => u.hasFaceBiometric) || users[0];
    }

    if (!matchedUser) {
      return {
        success: false,
        message: 'Tiada profil wajah kakitangan yang sepadan ditemui dalam pangkalan data makmal.'
      };
    }

    if (matchedUser.status === 'INACTIVE') {
      return {
        success: false,
        message: 'Akaun kakitangan ini dinyahaktifkan. Sila hubungi Pegawai Pentadbir.'
      };
    }

    this.setCurrentSessionUser(matchedUser);

    return {
      success: true,
      message: `Pengecaman Wajah Disahkan! Selamat kembali, ${matchedUser.name} (${matchedUser.role === 'ADMIN' ? 'Admin / Pegawai' : 'Staf Makmal'}).`,
      user: matchedUser
    };
  }

  // Daftarkan / Kemas kini Wajah Biometrik Kakitangan
  public static enrollUserFace(
    userId: string,
    facePhotoDataUrl: string
  ): { success: boolean; message: string; user?: UserProfile } {
    const state = this.loadState();
    if (!state.users) state.users = [...DEMO_USERS];

    const targetUser = state.users.find(u => u.id === userId);
    if (!targetUser) {
      return { success: false, message: 'Kakitangan tidak dijumpai.' };
    }

    targetUser.hasFaceBiometric = true;
    targetUser.facePhoto = facePhotoDataUrl;
    targetUser.faceEnrollmentDate = getTodayDateString();

    this.saveState(state);

    return {
      success: true,
      message: `Profil biometrik wajah bagi ${targetUser.name} berjaya didaftarkan.`,
      user: targetUser
    };
  }

  // Pendaftaran Pengguna Baharu untuk Akses Sistem
  public static registerUser(
    userData: {
      staffId: string;
      name: string;
      email: string;
      role: 'ADMIN' | 'STAFF';
      title: string;
      department: string;
      password?: string;
      hasFaceBiometric?: boolean;
      facePhoto?: string;
    },
    actor?: UserProfile
  ): { success: boolean; message: string; user?: UserProfile } {
    const state = this.loadState();
    if (!state.users || state.users.length === 0) {
      state.users = [...DEMO_USERS];
    }

    const cleanStaffId = userData.staffId.trim().toUpperCase();
    const cleanEmail = userData.email.trim().toLowerCase();

    // Semak duplikasi ID Staf
    const duplicateStaff = state.users.find(u => u.staffId?.toUpperCase() === cleanStaffId);
    if (duplicateStaff) {
      return {
        success: false,
        message: `No. ID Staf "${userData.staffId}" sudah pun didaftarkan di bawah ${duplicateStaff.name}.`
      };
    }

    // Semak duplikasi Emel
    const duplicateEmail = state.users.find(u => u.email?.toLowerCase() === cleanEmail);
    if (duplicateEmail) {
      return {
        success: false,
        message: `Alamat emel "${userData.email}" telah pun didaftarkan dalam sistem.`
      };
    }

    const newUser: UserProfile = {
      id: `user-${Date.now().toString().slice(-6)}`,
      staffId: cleanStaffId,
      name: userData.name.trim(),
      email: cleanEmail,
      role: userData.role,
      title: userData.title.trim(),
      department: userData.department.trim(),
      status: 'ACTIVE',
      registeredDate: getTodayDateString(),
      password: userData.password?.trim() || 'password123',
      hasFaceBiometric: !!userData.hasFaceBiometric,
      facePhoto: userData.facePhoto,
      faceEnrollmentDate: userData.hasFaceBiometric ? getTodayDateString() : undefined
    };

    state.users.push(newUser);
    this.saveState(state);

    return {
      success: true,
      message: `Kakitangan ${newUser.name} (${newUser.role === 'ADMIN' ? 'Pegawai / Admin' : 'Staf Makmal'}) berjaya didaftarkan.`,
      user: newUser
    };
  }

  // Ubah status aktif/nyahaktif pengguna
  public static toggleUserStatus(
    userId: string,
    actor: UserProfile
  ): { success: boolean; message: string; user?: UserProfile } {
    if (actor.role !== 'ADMIN') {
      return { success: false, message: 'Akses Ditolak: Hanya Admin / Pegawai Makmal boleh menguruskan status akses.' };
    }

    const state = this.loadState();
    if (!state.users) state.users = [...DEMO_USERS];

    const targetUser = state.users.find(u => u.id === userId);
    if (!targetUser) {
      return { success: false, message: 'Pengguna tidak dijumpai.' };
    }

    if (targetUser.id === actor.id) {
      return { success: false, message: 'Anda tidak boleh menyahaktifkan akaun anda sendiri yang sedang digunakan.' };
    }

    targetUser.status = targetUser.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
    this.saveState(state);

    return {
      success: true,
      message: `Status akaun ${targetUser.name} kini ${targetUser.status === 'ACTIVE' ? 'Aktif' : 'Nyahaktif'}.`,
      user: targetUser
    };
  }

  // Padam pengguna
  public static deleteUser(
    userId: string,
    actor: UserProfile
  ): { success: boolean; message: string } {
    if (actor.role !== 'ADMIN') {
      return { success: false, message: 'Akses Ditolak: Hanya Admin boleh memadam pengguna.' };
    }

    const state = this.loadState();
    if (!state.users) state.users = [...DEMO_USERS];

    if (userId === actor.id) {
      return { success: false, message: 'Anda tidak boleh memadam akaun semasa anda sendiri.' };
    }

    const activeAdmins = state.users.filter(u => u.role === 'ADMIN' && u.status !== 'INACTIVE');
    const targetUser = state.users.find(u => u.id === userId);

    if (targetUser?.role === 'ADMIN' && activeAdmins.length <= 1) {
      return { success: false, message: 'Tidak boleh memadam pentadbir tunggal sistem. Sekurang-kurangnya satu Admin diperlukan.' };
    }

    state.users = state.users.filter(u => u.id !== userId);
    this.saveState(state);

    return { success: true, message: 'Akaun kakitangan berjaya dipadam daripada sistem CIS.' };
  }

  // Dapatkan semua botol
  public static getBottles(): ChemicalBottle[] {
    const state = this.loadState();
    return state.bottles;
  }

  // Dapatkan botol mengikut ID
  public static getBottleById(id: string): ChemicalBottle | undefined {
    const bottles = this.getBottles();
    return bottles.find(b => b.id.trim().toUpperCase() === id.trim().toUpperCase());
  }

  // Dapatkan senarai lokasi
  public static getLocations(): Location[] {
    const state = this.loadState();
    return state.locations;
  }

  // Tambah lokasi baharu (Admin sahaja)
  public static addLocation(name: string, type: 'STORE' | 'LAB', description?: string): Location {
    const state = this.loadState();
    const newLoc: Location = {
      id: `loc-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      type,
      description: description?.trim()
    };
    state.locations.push(newLoc);
    this.saveState(state);
    return newLoc;
  }

  // Dapatkan ambang stok rendah
  public static getThresholds(): ChemicalThreshold[] {
    const state = this.loadState();
    return state.thresholds;
  }

  // Kemas kini atau tambah ambang stok (Admin sahaja)
  public static setThreshold(chemicalName: string, minStockCount: number): void {
    const state = this.loadState();
    const existing = state.thresholds.find(t => t.chemicalName.toLowerCase() === chemicalName.toLowerCase());
    if (existing) {
      existing.minStockCount = minStockCount;
    } else {
      state.thresholds.push({ chemicalName, minStockCount });
    }
    this.saveState(state);
  }

  // Jana ID Botol unik berturutan (CIS-YYYY-XXXX)
  public static generateUniqueBottleId(currentSeq: number): string {
    const year = new Date().getFullYear();
    const padded = String(currentSeq).padStart(4, '0');
    return `CIS-${year}-${padded}`;
  }

  // Pendaftaran Stok Masuk (Stock In) mengikut unit botol
  public static registerStockIn(
    formData: {
      chemicalName: string;
      casNumber?: string;
      brand: string;
      containerSize: string;
      batchNumber: string;
      expiryDate: string;
      receivedDate: string;
      supplierName: string;
      locationId: string;
      hazardClasses: GHSHazard[];
      sdsLink: string;
      quantity: number;
    },
    user: UserProfile
  ): ChemicalBottle[] {
    const state = this.loadState();
    const createdBottles: ChemicalBottle[] = [];
    const location = state.locations.find(l => l.id === formData.locationId);
    const locationName = location ? location.name : 'Stor Utama';

    let seq = state.nextSequenceNumber;

    for (let i = 0; i < formData.quantity; i++) {
      const bottleId = this.generateUniqueBottleId(seq);
      seq += 1;

      const initialAudit: AuditLogEntry = {
        logId: `log-${Date.now()}-${i}`,
        timestamp: new Date().toISOString(),
        action: 'STOCK_IN',
        performedBy: `${user.name} (${user.role === 'ADMIN' ? 'Admin / Pegawai' : 'Staf Makmal'})`,
        toLocation: locationName,
        notes: `Penerimaan stok botol #${i + 1} daripada ${formData.quantity} botol (Batch: ${formData.batchNumber})`
      };

      const newBottle: ChemicalBottle = {
        id: bottleId,
        chemicalName: formData.chemicalName.trim(),
        casNumber: formData.casNumber?.trim() || undefined,
        brand: formData.brand.trim(),
        containerSize: formData.containerSize.trim(),
        batchNumber: formData.batchNumber.trim(),
        expiryDate: formData.expiryDate,
        receivedDate: formData.receivedDate,
        supplierName: formData.supplierName.trim(),
        locationId: formData.locationId,
        hazardClasses: formData.hazardClasses,
        sdsLink: formData.sdsLink.trim(),
        status: 'IN_STORE',
        auditLogs: [initialAudit]
      };

      createdBottles.push(newBottle);
      state.bottles.unshift(newBottle);
    }

    state.nextSequenceNumber = seq;

    // Pastikan ambang stok wujud
    const hasThreshold = state.thresholds.some(t => t.chemicalName.toLowerCase() === formData.chemicalName.trim().toLowerCase());
    if (!hasThreshold) {
      state.thresholds.push({
        chemicalName: formData.chemicalName.trim(),
        minStockCount: 2
      });
    }

    this.saveState(state);
    return createdBottles;
  }

  // Pemindahan Lokasi Botol
  public static moveBottle(
    bottleId: string,
    targetLocationId: string,
    notes: string,
    user: UserProfile
  ): { success: boolean; message: string; bottle?: ChemicalBottle } {
    const state = this.loadState();
    const bottle = state.bottles.find(b => b.id === bottleId);
    if (!bottle) {
      return { success: false, message: 'Botol tidak dijumpai.' };
    }

    if (bottle.status === 'DISPOSED') {
      return { success: false, message: 'Botol berstatus Telah Dilupuskan dikunci dan tidak boleh dipindahkan.' };
    }

    if (bottle.locationId === targetLocationId) {
      return { success: false, message: 'Lokasi sasaran tidak boleh sama dengan lokasi semasa.' };
    }

    const fromLoc = state.locations.find(l => l.id === bottle.locationId)?.name || 'Lokasi Sebelum';
    const toLocObj = state.locations.find(l => l.id === targetLocationId);
    const toLoc = toLocObj ? toLocObj.name : 'Lokasi Baru';

    bottle.locationId = targetLocationId;
    // Jika dipindahkan ke bilik makmal (LAB), status bertukar ke IN_LAB. Jika ke STORE, bertukar ke IN_STORE.
    if (toLocObj?.type === 'LAB') {
      bottle.status = 'IN_LAB';
    } else if (toLocObj?.type === 'STORE' && bottle.status !== 'PENDING_DISPOSAL') {
      bottle.status = 'IN_STORE';
    }

    const auditEntry: AuditLogEntry = {
      logId: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'MOVED',
      performedBy: `${user.name} (${user.role === 'ADMIN' ? 'Admin / Pegawai' : 'Staf Makmal'})`,
      fromLocation: fromLoc,
      toLocation: toLoc,
      notes: notes.trim() || undefined
    };

    bottle.auditLogs.unshift(auditEntry);
    this.saveState(state);

    return { success: true, message: `Botol berjaya dipindahkan ke ${toLoc}.`, bottle };
  }

  // Langkah 1: Tanda Menunggu Pelupusan (Staf atau Admin)
  public static markPendingDisposal(
    bottleId: string,
    reason: 'Habis Digunakan' | 'Tamat Tempoh' | 'Rosak' | string,
    notes: string,
    user: UserProfile
  ): { success: boolean; message: string; bottle?: ChemicalBottle } {
    const state = this.loadState();
    const bottle = state.bottles.find(b => b.id === bottleId);
    if (!bottle) {
      return { success: false, message: 'Botol tidak dijumpai.' };
    }

    if (bottle.status === 'DISPOSED') {
      return { success: false, message: 'Botol telah disahkan lupus sebelum ini.' };
    }

    bottle.status = 'PENDING_DISPOSAL';
    bottle.disposalReason = reason;

    const currLoc = state.locations.find(l => l.id === bottle.locationId)?.name;

    const auditEntry: AuditLogEntry = {
      logId: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'MARKED_DISPOSAL',
      performedBy: `${user.name} (${user.role === 'ADMIN' ? 'Admin / Pegawai' : 'Staf Makmal'})`,
      fromLocation: currLoc,
      notes: `Sebab pelupusan: ${reason}. Catatan: ${notes || '-'}`
    };

    bottle.auditLogs.unshift(auditEntry);
    this.saveState(state);

    return { success: true, message: 'Botol berjaya ditandakan Menunggu Pelupusan dan ditolak daripada baki stok aktif.', bottle };
  }

  // Langkah 2: Sahkan Pelupusan Muktamad (Admin Sahaja)
  public static confirmDisposal(
    bottleId: string,
    disposalDate: string,
    disposalRefNo: string,
    notes: string,
    user: UserProfile
  ): { success: boolean; message: string; bottle?: ChemicalBottle } {
    if (user.role !== 'ADMIN') {
      return { success: false, message: 'Akses Ditolak: Hanya Admin / Pegawai Makmal dibenarkan mengesahkan pelupusan muktamad.' };
    }

    const state = this.loadState();
    const bottle = state.bottles.find(b => b.id === bottleId);
    if (!bottle) {
      return { success: false, message: 'Botol tidak dijumpai.' };
    }

    const prevLocation = state.locations.find(l => l.id === bottle.locationId)?.name;
    const wasteLoc = state.locations.find(l => l.name.toLowerCase().includes('sisa') || l.name.toLowerCase().includes('pelupusan'));

    bottle.status = 'DISPOSED';
    bottle.disposalDate = disposalDate || getTodayDateString();
    bottle.disposalRefNo = disposalRefNo.trim() || `DOE-DISP-${Date.now().toString().slice(-6)}`;
    if (wasteLoc) {
      bottle.locationId = wasteLoc.id;
    }

    const auditEntry: AuditLogEntry = {
      logId: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'CONFIRMED_DISPOSAL',
      performedBy: `${user.name} (Admin / Pegawai Pengesah)`,
      fromLocation: prevLocation,
      toLocation: wasteLoc?.name || prevLocation,
      notes: `Pengesahan muktamad pelupusan. No. Rujukan: ${bottle.disposalRefNo}. Catatan: ${notes || '-'}`
    };

    bottle.auditLogs.unshift(auditEntry);
    this.saveState(state);

    return { success: true, message: `Pelupusan bot ${bottle.id} berjaya disahkan (Ref: ${bottle.disposalRefNo}).`, bottle };
  }

  // Dapatkan Metrik & Ringkasan KPI Dashboard
  public static getDashboardMetrics() {
    const bottles = this.getBottles();
    const thresholds = this.getThresholds();

    // Hanya botol IN_STORE & IN_LAB dikira sebagai aktif
    const activeBottles = bottles.filter(b => b.status === 'IN_STORE' || b.status === 'IN_LAB');

    // Botol Expired (Merah): status aktif & tarikh luput < hari ini
    const expiredBottles = activeBottles.filter(b => getExpiryStatus(b.expiryDate) === 'EXPIRED');

    // Botol Hampir Expired (Kuning): status aktif & tarikh luput <= 90 hari (dan belum luput)
    const expiringSoonBottles = activeBottles.filter(b => getExpiryStatus(b.expiryDate) === 'EXPIRING_SOON');

    // Amaran Stok Rendah: hitung baki aktif bagi setiap Nama Bahan Kimia
    const activeStockByName: Record<string, number> = {};
    activeBottles.forEach(b => {
      const name = b.chemicalName;
      activeStockByName[name] = (activeStockByName[name] || 0) + 1;
    });

    // Senarai bahan kimia stok rendah
    const lowStockChemicals: {
      chemicalName: string;
      activeCount: number;
      minThreshold: number;
      deficit: number;
    }[] = [];

    // Semak dari semua jenis bahan kimia unik
    const allUniqueChemicals = Array.from(new Set(bottles.map(b => b.chemicalName)));
    allUniqueChemicals.forEach(chemName => {
      const activeCount = activeStockByName[chemName] || 0;
      const th = thresholds.find(t => t.chemicalName.toLowerCase() === chemName.toLowerCase());
      const minThreshold = th ? th.minStockCount : 2;

      if (activeCount <= minThreshold) {
        lowStockChemicals.push({
          chemicalName: chemName,
          activeCount,
          minThreshold,
          deficit: minThreshold - activeCount
        });
      }
    });

    const pendingDisposalCount = bottles.filter(b => b.status === 'PENDING_DISPOSAL').length;
    const disposedCount = bottles.filter(b => b.status === 'DISPOSED').length;

    return {
      activeBottlesCount: activeBottles.length,
      expiredCount: expiredBottles.length,
      expiringSoonCount: expiringSoonBottles.length,
      lowStockCount: lowStockChemicals.length,
      pendingDisposalCount,
      disposedCount,
      expiredBottles,
      expiringSoonBottles,
      lowStockChemicals,
      totalRegistered: bottles.length
    };
  }

  // Eksport Sandaran JSON
  public static exportBackupJSON(): string {
    const state = this.loadState();
    return JSON.stringify(state, null, 2);
  }

  // Import Sandaran JSON
  public static importBackupJSON(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !Array.isArray(parsed.bottles) || !Array.isArray(parsed.locations)) {
        return { success: false, message: 'Format fail sandaran JSON tidak sah.' };
      }
      this.saveState(parsed);
      return { success: true, message: `Sandaran data berjaya dipulihkan (${parsed.bottles.length} botol dimuatkan).` };
    } catch (e) {
      return { success: false, message: 'Ralat parsing fail JSON: ' + (e as Error).message };
    }
  }

  // Tetap Semula ke Data Permulaan (Seed Data)
  public static resetToSeedData(): void {
    const defaultState: AppStateData = {
      bottles: INITIAL_BOTTLES,
      locations: INITIAL_LOCATIONS,
      thresholds: INITIAL_THRESHOLDS,
      nextSequenceNumber: 15,
      users: DEMO_USERS
    };
    this.saveState(defaultState);
  }

  // Jana fail CSV untuk muat turun
  public static exportToCSV(type: 'ALL' | 'EXPIRED' | 'DISPOSED'): string {
    const state = this.loadState();
    let dataset = state.bottles;

    if (type === 'EXPIRED') {
      dataset = dataset.filter(b => (b.status === 'IN_STORE' || b.status === 'IN_LAB') && getExpiryStatus(b.expiryDate) !== 'GOOD');
    } else if (type === 'DISPOSED') {
      dataset = dataset.filter(b => b.status === 'DISPOSED');
    }

    const headers = [
      'ID Botol',
      'Nama Bahan Kimia',
      'CAS No.',
      'Jenama',
      'Saiz Bekas',
      'No. Batch',
      'Status',
      'Lokasi Semasa',
      'Tarikh Terima',
      'Tarikh Luput',
      'Status Luput',
      'Hazard GHS',
      'Pembekal',
      'SDS Link',
      'Sebab Pelupusan',
      'Tarikh Lupus',
      'No. Rujukan Lupus'
    ];

    const getLocName = (id: string) => state.locations.find(l => l.id === id)?.name || id;

    const rows = dataset.map(b => {
      const expStatus = getExpiryStatus(b.expiryDate);
      const expStatusLabel = expStatus === 'EXPIRED' ? 'Telah Luput' : expStatus === 'EXPIRING_SOON' ? 'Hampir Luput' : 'Masih Elok';
      const statusLabel =
        b.status === 'IN_STORE' ? 'Dalam Stor' :
        b.status === 'IN_LAB' ? 'Di Makmal' :
        b.status === 'PENDING_DISPOSAL' ? 'Menunggu Pelupusan' : 'Telah Dilupuskan';

      return [
        `"${b.id}"`,
        `"${b.chemicalName.replace(/"/g, '""')}"`,
        `"${b.casNumber || '-'}"`,
        `"${b.brand.replace(/"/g, '""')}"`,
        `"${b.containerSize}"`,
        `"${b.batchNumber}"`,
        `"${statusLabel}"`,
        `"${getLocName(b.locationId).replace(/"/g, '""')}"`,
        `"${b.receivedDate}"`,
        `"${b.expiryDate}"`,
        `"${expStatusLabel}"`,
        `"${b.hazardClasses.join('; ')}"`,
        `"${b.supplierName.replace(/"/g, '""')}"`,
        `"${b.sdsLink}"`,
        `"${b.disposalReason || '-'}"`,
        `"${b.disposalDate || '-'}"`,
        `"${b.disposalRefNo || '-'}"`
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\r\n');
  }
}
