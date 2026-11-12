import { ChemicalBottle, Location, ChemicalThreshold } from '../types';

export const INITIAL_LOCATIONS: Location[] = [
  { id: 'loc-01', name: 'Stor Utama - Rak Pelarut Mudah Terbakar', type: 'STORE', description: 'Bilik berventilasi khas pelarut organik' },
  { id: 'loc-02', name: 'Stor Utama - Almari Asid & Mengakis', type: 'STORE', description: 'Kabinet polipropilena tahan asid' },
  { id: 'loc-03', name: 'Stor Utama - Rak Bahan Kimia Am', type: 'STORE', description: 'Rak simpanan garam & bahan kimia am' },
  { id: 'loc-04', name: 'Makmal Kimia Analisis 1', type: 'LAB', description: 'Makmal instrumen HPLC, GC-MS & UV-Vis' },
  { id: 'loc-05', name: 'Makmal Sintesis Organik 2', type: 'LAB', description: 'Makmal penyelidikan sintesis & kebuk wasap' },
  { id: 'loc-06', name: 'Makmal Mikrobiologi & Biokimia', type: 'LAB', description: 'Makmal kultur tisu & biokimia' },
  { id: 'loc-07', name: 'Kawasan Pengasingan Sisa Berjadual', type: 'STORE', description: 'Kawasan sisa menunggu kontraktor pelupusan DOE' },
];

export const INITIAL_THRESHOLDS: ChemicalThreshold[] = [
  { chemicalName: 'Acetone (AR Grade)', minStockCount: 2 },
  { chemicalName: 'Hydrochloric Acid 37% (Fuming)', minStockCount: 2 },
  { chemicalName: 'Methanol (HPLC Grade)', minStockCount: 3 },
  { chemicalName: 'Sodium Hydroxide Pellets', minStockCount: 2 },
  { chemicalName: 'Sulfuric Acid 95-98%', minStockCount: 2 },
  { chemicalName: 'Ethanol Absolute (99.8%)', minStockCount: 2 },
  { chemicalName: 'Dichloromethane (DCM)', minStockCount: 2 },
  { chemicalName: 'Formaldehyde Solution 37%', minStockCount: 1 },
  { chemicalName: 'Potassium Hydroxide Flakes', minStockCount: 2 },
  { chemicalName: 'Chloroform (Stabilized)', minStockCount: 2 },
];

export const INITIAL_BOTTLES: ChemicalBottle[] = [
  {
    id: 'CIS-2026-0001',
    chemicalName: 'Acetone (AR Grade)',
    casNumber: '67-64-1',
    brand: 'Merck Millipore',
    containerSize: '2.5 L',
    batchNumber: 'M24089A',
    expiryDate: '2026-10-15', // EXPIRED (< Nov 2026)
    receivedDate: '2024-10-20',
    supplierName: 'Labchem Malaysia Sdn Bhd',
    locationId: 'loc-04', // Makmal Kimia Analisis 1
    hazardClasses: ['Flammable', 'Irritant / Harmful'],
    sdsLink: 'https://www.sigmaaldrich.com/MY/en/sds/sial/179124',
    status: 'IN_LAB',
    auditLogs: [
      {
        logId: 'log-101',
        timestamp: '2024-10-20T09:30:00Z',
        action: 'STOCK_IN',
        performedBy: 'Dr. Farhan (Admin / Pegawai Sains)',
        toLocation: 'Stor Utama - Rak Pelarut Mudah Terbakar',
        notes: 'Penerimaan stok PO/2024/0912'
      },
      {
        logId: 'log-102',
        timestamp: '2025-04-12T11:15:00Z',
        action: 'MOVED',
        performedBy: 'Ahmad Zaki (Pembantu Makmal)',
        fromLocation: 'Stor Utama - Rak Pelarut Mudah Terbakar',
        toLocation: 'Makmal Kimia Analisis 1',
        notes: 'Diambil untuk pembersihan peralatan kaca spektrometri'
      }
    ]
  },
  {
    id: 'CIS-2026-0002',
    chemicalName: 'Acetone (AR Grade)',
    casNumber: '67-64-1',
    brand: 'Merck Millipore',
    containerSize: '2.5 L',
    batchNumber: 'M25012B',
    expiryDate: '2026-12-08', // HAMPIR EXPIRED (≤ 90 hari)
    receivedDate: '2025-01-10',
    supplierName: 'Labchem Malaysia Sdn Bhd',
    locationId: 'loc-01', // Stor Utama
    hazardClasses: ['Flammable', 'Irritant / Harmful'],
    sdsLink: 'https://www.sigmaaldrich.com/MY/en/sds/sial/179124',
    status: 'IN_STORE',
    auditLogs: [
      {
        logId: 'log-103',
        timestamp: '2025-01-10T14:00:00Z',
        action: 'STOCK_IN',
        performedBy: 'Dr. Farhan (Admin / Pegawai Sains)',
        toLocation: 'Stor Utama - Rak Pelarut Mudah Terbakar',
        notes: 'Stok simpanan bekalan tahunan'
      }
    ]
  },
  {
    id: 'CIS-2026-0003',
    chemicalName: 'Hydrochloric Acid 37% (Fuming)',
    casNumber: '7647-01-0',
    brand: 'Sigma-Aldrich',
    containerSize: '2.5 L',
    batchNumber: 'SHBN3980',
    expiryDate: '2027-08-30', // MASIH ELOK
    receivedDate: '2025-09-01',
    supplierName: 'Mega Scientific Supplies',
    locationId: 'loc-02', // Stor Utama - Almari Asid
    hazardClasses: ['Corrosive', 'Toxic'],
    sdsLink: 'https://www.sigmaaldrich.com/MY/en/sds/sigald/320331',
    status: 'IN_STORE',
    auditLogs: [
      {
        logId: 'log-104',
        timestamp: '2025-09-01T10:00:00Z',
        action: 'STOCK_IN',
        performedBy: 'Dr. Farhan (Admin / Pegawai Sains)',
        toLocation: 'Stor Utama - Almari Asid & Mengakis',
        notes: 'Penerimaan botol berjaket keselamatan kaca PVC'
      }
    ]
  },
  {
    id: 'CIS-2026-0004',
    chemicalName: 'Hydrochloric Acid 37% (Fuming)',
    casNumber: '7647-01-0',
    brand: 'Sigma-Aldrich',
    containerSize: '2.5 L',
    batchNumber: 'SHBN3980',
    expiryDate: '2027-08-30', // MASIH ELOK
    receivedDate: '2025-09-01',
    supplierName: 'Mega Scientific Supplies',
    locationId: 'loc-05', // Makmal Sintesis Organik 2
    hazardClasses: ['Corrosive', 'Toxic'],
    sdsLink: 'https://www.sigmaaldrich.com/MY/en/sds/sigald/320331',
    status: 'IN_LAB',
    auditLogs: [
      {
        logId: 'log-105',
        timestamp: '2025-09-01T10:00:00Z',
        action: 'STOCK_IN',
        performedBy: 'Dr. Farhan (Admin / Pegawai Sains)',
        toLocation: 'Stor Utama - Almari Asid & Mengakis',
        notes: 'Daftar stok masuk batch 2 botol'
      },
      {
        logId: 'log-106',
        timestamp: '2026-02-14T08:45:00Z',
        action: 'MOVED',
        performedBy: 'Nurul Huda (Penolong Pegawai Sains)',
        fromLocation: 'Stor Utama - Almari Asid & Mengakis',
        toLocation: 'Makmal Sintesis Organik 2',
        notes: 'Digunakan dalam kebuk wasap untuk reaksi pengasidan ester'
      }
    ]
  },
  {
    id: 'CIS-2026-0005',
    chemicalName: 'Methanol (HPLC Grade)',
    casNumber: '67-56-1',
    brand: 'Fisher Chemical',
    containerSize: '4.0 L',
    batchNumber: 'FC-99124',
    expiryDate: '2026-11-28', // HAMPIR EXPIRED (dalam tempoh 16 hari lagi!)
    receivedDate: '2024-12-05',
    supplierName: 'Prima Saintifik Sdn Bhd',
    locationId: 'loc-04', // Makmal Kimia Analisis 1
    hazardClasses: ['Flammable', 'Toxic', 'Health Hazard'],
    sdsLink: 'https://www.fishersci.com/store/msds?partNumber=A4524',
    status: 'IN_LAB',
    auditLogs: [
      {
        logId: 'log-107',
        timestamp: '2024-12-05T14:30:00Z',
        action: 'STOCK_IN',
        performedBy: 'Dr. Farhan (Admin / Pegawai Sains)',
        toLocation: 'Stor Utama - Rak Pelarut Mudah Terbakar'
      },
      {
        logId: 'log-108',
        timestamp: '2025-10-18T16:00:00Z',
        action: 'MOVED',
        performedBy: 'Ahmad Zaki (Pembantu Makmal)',
        fromLocation: 'Stor Utama - Rak Pelarut Mudah Terbakar',
        toLocation: 'Makmal Kimia Analisis 1',
        notes: 'Fasa gerak (mobile phase) instrumen HPLC'
      }
    ]
  },
  {
    id: 'CIS-2026-0006',
    chemicalName: 'Sodium Hydroxide Pellets',
    casNumber: '1310-73-2',
    brand: 'R&M Chemicals',
    containerSize: '1.0 kg',
    batchNumber: 'RM-23091',
    expiryDate: '2026-09-30', // EXPIRED
    receivedDate: '2023-10-01',
    supplierName: 'Bumi Sains Maju',
    locationId: 'loc-03', // Stor Utama - Rak Bahan Kimia Am
    hazardClasses: ['Corrosive'],
    sdsLink: 'https://www.sigmaaldrich.com/MY/en/sds/sial/s8045',
    status: 'PENDING_DISPOSAL', // Menunggu kelulusan pelupusan Admin
    disposalReason: 'Tamat Tempoh',
    auditLogs: [
      {
        logId: 'log-109',
        timestamp: '2023-10-01T10:15:00Z',
        action: 'STOCK_IN',
        performedBy: 'Dr. Farhan (Admin / Pegawai Sains)',
        toLocation: 'Stor Utama - Rak Bahan Kimia Am'
      },
      {
        logId: 'log-110',
        timestamp: '2026-10-02T11:00:00Z',
        action: 'MARKED_DISPOSAL',
        performedBy: 'Ahmad Zaki (Pembantu Makmal)',
        fromLocation: 'Stor Utama - Rak Bahan Kimia Am',
        notes: 'Bahan telah melepasi tarikh luput & pelet mula melekit (deliquescent)'
      }
    ]
  },
  {
    id: 'CIS-2026-0007',
    chemicalName: 'Sulfuric Acid 95-98%',
    casNumber: '7664-93-9',
    brand: 'Merck Millipore',
    containerSize: '2.5 L',
    batchNumber: 'MK-88741',
    expiryDate: '2027-12-15', // MASIH ELOK
    receivedDate: '2025-11-01',
    supplierName: 'Labchem Malaysia Sdn Bhd',
    locationId: 'loc-02', // Stor Utama - Almari Asid
    hazardClasses: ['Corrosive', 'Health Hazard'],
    sdsLink: 'https://www.sigmaaldrich.com/MY/en/sds/sial/339741',
    status: 'IN_STORE',
    auditLogs: [
      {
        logId: 'log-111',
        timestamp: '2025-11-01T09:00:00Z',
        action: 'STOCK_IN',
        performedBy: 'Dr. Farhan (Admin / Pegawai Sains)',
        toLocation: 'Stor Utama - Almari Asid & Mengakis',
        notes: 'Penerimaan stok bekalan berpusat'
      }
    ]
  },
  {
    id: 'CIS-2026-0008',
    chemicalName: 'Ethanol Absolute (99.8%)',
    casNumber: '64-17-5',
    brand: 'Fisher Chemical',
    containerSize: '2.5 L',
    batchNumber: 'ET-40112',
    expiryDate: '2027-01-20', // HAMPIR EXPIRED (≤ 90 hari)
    receivedDate: '2025-02-15',
    supplierName: 'Prima Saintifik Sdn Bhd',
    locationId: 'loc-06', // Makmal Mikrobiologi & Biokimia
    hazardClasses: ['Flammable'],
    sdsLink: 'https://www.fishersci.com/store/msds?partNumber=BP2818',
    status: 'IN_LAB',
    auditLogs: [
      {
        logId: 'log-112',
        timestamp: '2025-02-15T11:20:00Z',
        action: 'STOCK_IN',
        performedBy: 'Dr. Farhan (Admin / Pegawai Sains)',
        toLocation: 'Stor Utama - Rak Pelarut Mudah Terbakar'
      },
      {
        logId: 'log-113',
        timestamp: '2025-08-01T14:10:00Z',
        action: 'MOVED',
        performedBy: 'Nurul Huda (Penolong Pegawai Sains)',
        fromLocation: 'Stor Utama - Rak Pelarut Mudah Terbakar',
        toLocation: 'Makmal Mikrobiologi & Biokimia',
        notes: 'Untuk penyediaan larutan pensanitasi biosafety laminar flow'
      }
    ]
  },
  {
    id: 'CIS-2026-0009',
    chemicalName: 'Dichloromethane (DCM)',
    casNumber: '75-09-2',
    brand: 'Sigma-Aldrich',
    containerSize: '1.0 L',
    batchNumber: 'DCM-5561',
    expiryDate: '2028-06-30', // MASIH ELOK
    receivedDate: '2026-03-10',
    supplierName: 'Mega Scientific Supplies',
    locationId: 'loc-01', // Stor Utama
    hazardClasses: ['Toxic', 'Health Hazard'],
    sdsLink: 'https://www.sigmaaldrich.com/MY/en/sds/sial/270563',
    status: 'IN_STORE',
    auditLogs: [
      {
        logId: 'log-114',
        timestamp: '2026-03-10T10:00:00Z',
        action: 'STOCK_IN',
        performedBy: 'Dr. Farhan (Admin / Pegawai Sains)',
        toLocation: 'Stor Utama - Rak Pelarut Mudah Terbakar'
      }
    ]
  },
  {
    id: 'CIS-2026-0010',
    chemicalName: 'Formaldehyde Solution 37%',
    casNumber: '50-00-0',
    brand: 'Merck Millipore',
    containerSize: '1.0 L',
    batchNumber: 'FRM-1029',
    expiryDate: '2026-05-10', // EXPIRED
    receivedDate: '2024-05-12',
    supplierName: 'Labchem Malaysia Sdn Bhd',
    locationId: 'loc-07', // Kawasan Pengasingan Sisa
    hazardClasses: ['Toxic', 'Corrosive', 'Health Hazard'],
    sdsLink: 'https://www.sigmaaldrich.com/MY/en/sds/sial/f8775',
    status: 'DISPOSED', // Telah disahkan lupus oleh Admin
    disposalReason: 'Tamat Tempoh',
    disposalDate: '2026-06-01',
    disposalRefNo: 'DOE/SW/2026/0411',
    auditLogs: [
      {
        logId: 'log-115',
        timestamp: '2024-05-12T10:00:00Z',
        action: 'STOCK_IN',
        performedBy: 'Dr. Farhan (Admin / Pegawai Sains)',
        toLocation: 'Stor Utama - Rak Bahan Kimia Am'
      },
      {
        logId: 'log-116',
        timestamp: '2026-05-15T14:00:00Z',
        action: 'MARKED_DISPOSAL',
        performedBy: 'Ahmad Zaki (Pembantu Makmal)',
        notes: 'Bahan telah luput dan membentuk mendakan paraformaldehid'
      },
      {
        logId: 'log-117',
        timestamp: '2026-06-01T09:30:00Z',
        action: 'CONFIRMED_DISPOSAL',
        performedBy: 'Dr. Farhan (Admin / Pegawai Sains)',
        fromLocation: 'Stor Utama - Rak Bahan Kimia Am',
        toLocation: 'Kawasan Pengasingan Sisa Berjadual',
        notes: 'Diserahkan kepada syarikat pelupusan sisa berjadual Kualiti Alam Sdn Bhd (Ref: DOE/SW/2026/0411)'
      }
    ]
  },
  {
    id: 'CIS-2026-0011',
    chemicalName: 'Potassium Hydroxide Flakes',
    casNumber: '1310-58-3',
    brand: 'R&M Chemicals',
    containerSize: '500 g',
    batchNumber: 'KOH-8821',
    expiryDate: '2027-10-15', // MASIH ELOK
    receivedDate: '2025-10-15',
    supplierName: 'Bumi Sains Maju',
    locationId: 'loc-03', // Stor Utama
    hazardClasses: ['Corrosive', 'Toxic'],
    sdsLink: 'https://www.sigmaaldrich.com/MY/en/sds/sial/p5958',
    status: 'IN_STORE',
    auditLogs: [
      {
        logId: 'log-118',
        timestamp: '2025-10-15T15:20:00Z',
        action: 'STOCK_IN',
        performedBy: 'Dr. Farhan (Admin / Pegawai Sains)',
        toLocation: 'Stor Utama - Rak Bahan Kimia Am'
      }
    ]
  },
  {
    id: 'CIS-2026-0012',
    chemicalName: 'Chloroform (Stabilized)',
    casNumber: '67-66-3',
    brand: 'Merck Millipore',
    containerSize: '2.5 L',
    batchNumber: 'CHL-9901',
    expiryDate: '2027-04-12', // MASIH ELOK
    receivedDate: '2025-04-15',
    supplierName: 'Labchem Malaysia Sdn Bhd',
    locationId: 'loc-05', // Makmal Sintesis Organik 2
    hazardClasses: ['Toxic', 'Health Hazard', 'Irritant / Harmful'],
    sdsLink: 'https://www.sigmaaldrich.com/MY/en/sds/sial/c2432',
    status: 'IN_LAB',
    auditLogs: [
      {
        logId: 'log-119',
        timestamp: '2025-04-15T09:30:00Z',
        action: 'STOCK_IN',
        performedBy: 'Dr. Farhan (Admin / Pegawai Sains)',
        toLocation: 'Stor Utama - Rak Pelarut Mudah Terbakar'
      },
      {
        logId: 'log-120',
        timestamp: '2025-11-20T10:15:00Z',
        action: 'MOVED',
        performedBy: 'Ahmad Zaki (Pembantu Makmal)',
        fromLocation: 'Stor Utama - Rak Pelarut Mudah Terbakar',
        toLocation: 'Makmal Sintesis Organik 2',
        notes: 'Digunakan untuk pengekstrakan cecair-cecair bahan bioaktif'
      }
    ]
  },
  {
    id: 'CIS-2026-0013',
    chemicalName: 'Hydrogen Peroxide 30%',
    casNumber: '7722-84-1',
    brand: 'Sigma-Aldrich',
    containerSize: '1.0 L',
    batchNumber: 'HP-3320',
    expiryDate: '2026-12-25', // HAMPIR EXPIRED (≤ 90 hari)
    receivedDate: '2025-01-05',
    supplierName: 'Mega Scientific Supplies',
    locationId: 'loc-01',
    hazardClasses: ['Oxidizer', 'Corrosive', 'Irritant / Harmful'],
    sdsLink: 'https://www.sigmaaldrich.com/MY/en/sds/sial/216763',
    status: 'IN_STORE',
    auditLogs: [
      {
        logId: 'log-121',
        timestamp: '2025-01-05T11:00:00Z',
        action: 'STOCK_IN',
        performedBy: 'Dr. Farhan (Admin / Pegawai Sains)',
        toLocation: 'Stor Utama - Rak Pelarut Mudah Terbakar',
        notes: 'Disimpan dalam kabinet dingin gelap berventilasi'
      }
    ]
  },
  {
    id: 'CIS-2026-0014',
    chemicalName: 'Silver Nitrate Powder AR',
    casNumber: '7761-88-8',
    brand: 'Fisher Chemical',
    containerSize: '100 g',
    batchNumber: 'SN-0098',
    expiryDate: '2027-11-05', // MASIH ELOK
    receivedDate: '2025-11-08',
    supplierName: 'Prima Saintifik Sdn Bhd',
    locationId: 'loc-03',
    hazardClasses: ['Oxidizer', 'Corrosive', 'Environmental Hazard'],
    sdsLink: 'https://www.fishersci.com/store/msds?partNumber=S181100',
    status: 'IN_STORE',
    auditLogs: [
      {
        logId: 'log-122',
        timestamp: '2025-11-08T14:45:00Z',
        action: 'STOCK_IN',
        performedBy: 'Dr. Farhan (Admin / Pegawai Sains)',
        toLocation: 'Stor Utama - Rak Bahan Kimia Am',
        notes: 'Bekas botol ambar gelap berkunci'
      }
    ]
  }
];

export const DEMO_USERS: import('../types').UserProfile[] = [
  {
    id: 'user-admin-1',
    staffId: 'LGM/RO/0352',
    name: 'Dyana Adziera',
    email: 'dyana.adziera@lgm.gov.my',
    role: 'ADMIN' as const,
    title: 'Pegawai Penyelidik / Pentadbir Sistem',
    department: 'Bahagian Penyelidikan & Teknologi Makmal LGM',
    status: 'ACTIVE',
    registeredDate: '2024-01-15',
    password: 'password123'
  },
  {
    id: 'user-admin-2',
    staffId: 'LGM/PS/0104',
    name: 'Dr. Farhan Zulkifli',
    email: 'farhan.zulkifli@lgm.gov.my',
    role: 'ADMIN' as const,
    title: 'Pegawai Sains Makmal Kanan',
    department: 'Bahagian Kawalan Kualiti & Kimia Analisis',
    status: 'ACTIVE',
    registeredDate: '2023-08-10',
    password: 'password123'
  },
  {
    id: 'user-staff-1',
    staffId: 'LGM/PM/0289',
    name: 'Ahmad Zaki Ismail',
    email: 'ahmad.zaki@lgm.gov.my',
    role: 'STAFF' as const,
    title: 'Pembantu Makmal Kanan',
    department: 'Unit Operasi & Pengendalian Bahan Kimia',
    status: 'ACTIVE',
    registeredDate: '2024-03-01',
    password: 'password123'
  },
  {
    id: 'user-staff-2',
    staffId: 'LGM/PPS/0411',
    name: 'Nurul Huda Ramli',
    email: 'nurul.huda@lgm.gov.my',
    role: 'STAFF' as const,
    title: 'Penolong Pegawai Sains',
    department: 'Makmal Sintesis Organik & Mikrobiologi',
    status: 'ACTIVE',
    registeredDate: '2024-06-12',
    password: 'password123'
  }
];
