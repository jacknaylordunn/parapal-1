
import Dexie, { type Table } from 'dexie';

// Define interfaces for our database tables
export interface PatientEncounter {
  id?: number;
  incidentNumber: string;
  callType: string; // Medical, Trauma, Obstetric, Paediatric, Mental Health, Other
  status: string; // active, completed, cancelled
  startTime: Date;
  endTime?: Date;
  patientDetails?: PatientDetails;
  // References to other record types
  vitalSigns?: number[]; // IDs of vital sign readings
  isMajorIncident?: boolean;
  isUnknownPatient?: boolean;
  lastUpdated: Date;
}

export interface PatientDetails {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  age?: number;
  sex?: string; // Male, Female, Other
  nhsNumber?: string;
  address?: string;
  contactNumber?: string;
  nextOfKin?: string;
  nextOfKinContact?: string;
}

export interface VitalSignReading {
  id?: number;
  encounterId: number;
  timestamp: Date;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  systolicBP?: number;
  diastolicBP?: number;
  temperature?: number;
  bloodGlucose?: number;
  isOnOxygen: boolean;
  oxygenDeliveryMethod?: string;
  oxygenFlowRate?: number;
  gcsEye?: number;
  gcsVerbal?: number;
  gcsMotor?: number;
  gcsTotalScore?: number;
  news2Score?: number;
  news2RiskLevel?: string; // Low, Medium, High
}

export interface PatientHistory {
  id?: number;
  encounterId: number;
  presentingComplaint?: string;
  historyPresentingComplaint?: string;
  pastMedicalHistory?: string;
  socialHistory?: string;
  familyHistory?: string;
  allergies: PatientAllergy[];
  medications: PatientMedication[];
  safeguardingConcerns?: boolean;
  safeguardingNotes?: string;
  bodyMapMarkers?: BodyMapMarker[];
}

export interface PatientAllergy {
  id?: number;
  allergen: string;
  reaction?: string;
  severity?: string; // Mild, Moderate, Severe
}

export interface PatientMedication {
  id?: number;
  name: string;
  dose?: string;
  frequency?: string;
  route?: string;
  lastTaken?: Date;
}

export interface BodyMapMarker {
  id?: number;
  x: number;
  y: number;
  type: string; // Pain, Injury, Rash, etc.
  description?: string;
  painScore?: number;
}

export interface IncidentLog {
  id?: number;
  encounterId: number;
  timestamp: Date;
  event: string;
  details?: string;
  userId?: string;
}

// Define the database
export class ParaPalDatabase extends Dexie {
  encounters!: Table<PatientEncounter>;
  vitalSigns!: Table<VitalSignReading>;
  patientHistories!: Table<PatientHistory>;
  allergies!: Table<PatientAllergy>;
  medications!: Table<PatientMedication>;
  bodyMapMarkers!: Table<BodyMapMarker>;
  incidentLogs!: Table<IncidentLog>;

  constructor() {
    super('parapalDB');
    
    this.version(1).stores({
      encounters: '++id, incidentNumber, callType, status, startTime',
      vitalSigns: '++id, encounterId, timestamp',
      patientHistories: '++id, encounterId',
      allergies: '++id',
      medications: '++id',
      bodyMapMarkers: '++id',
      incidentLogs: '++id, encounterId, timestamp'
    });
  }

  // Helper method to get active encounter
  async getActiveEncounter(): Promise<PatientEncounter | undefined> {
    return this.encounters.where('status').equals('active').first();
  }

  // Method to log an incident event
  async logIncident(encounterId: number, event: string, details?: string): Promise<number> {
    return this.incidentLogs.add({
      encounterId,
      timestamp: new Date(),
      event,
      details,
      userId: 'current-user' // PLACEHOLDER: Replace with actual user ID from authentication
    });
  }
}

// Create and export a single instance of the database
export const db = new ParaPalDatabase();

// Function to initialize sample data for development/testing
export async function initializeDevData() {
  const activeEncounter = await db.getActiveEncounter();
  
  // Only add sample data if no active encounter exists
  if (!activeEncounter) {
    console.log('Initializing development data...');
    
    // Add a sample encounter
    const encounterId = await db.encounters.add({
      incidentNumber: 'DEV12345',
      callType: 'Medical',
      status: 'active',
      startTime: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      lastUpdated: new Date(),
      isMajorIncident: false,
      isUnknownPatient: false,
      patientDetails: {
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: new Date('1975-05-15'),
        age: 48,
        sex: 'Male',
        nhsNumber: '123 456 7890',
        address: '123 High Street, London, UK',
        contactNumber: '07123456789'
      }
    });
    
    // Add some vital signs
    await db.vitalSigns.add({
      encounterId,
      timestamp: new Date(Date.now() - 20 * 60000), // 20 minutes ago
      heartRate: 72,
      respiratoryRate: 16,
      oxygenSaturation: 98,
      systolicBP: 132,
      diastolicBP: 82,
      temperature: 36.8,
      isOnOxygen: false,
      gcsEye: 4,
      gcsVerbal: 5, 
      gcsMotor: 6,
      gcsTotalScore: 15,
      news2Score: 0,
      news2RiskLevel: 'Low'
    });
    
    // Add a more recent set of vitals
    await db.vitalSigns.add({
      encounterId,
      timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      heartRate: 88,
      respiratoryRate: 18,
      oxygenSaturation: 96,
      systolicBP: 138,
      diastolicBP: 84,
      temperature: 37.2,
      bloodGlucose: 5.4,
      isOnOxygen: true,
      oxygenDeliveryMethod: 'Nasal Cannula',
      oxygenFlowRate: 2,
      gcsEye: 4,
      gcsVerbal: 5,
      gcsMotor: 6,
      gcsTotalScore: 15,
      news2Score: 1,
      news2RiskLevel: 'Low'
    });
    
    // Add sample patient history
    const historyId = await db.patientHistories.add({
      encounterId,
      presentingComplaint: 'Chest pain and shortness of breath',
      historyPresentingComplaint: 'Patient reports central chest pain radiating to left arm, started 1 hour ago while resting. Pain is described as "heavy" and rated 7/10.',
      pastMedicalHistory: 'Hypertension, Type 2 Diabetes',
      allergies: [],
      medications: []
    });
    
    // Add medications
    await db.medications.bulkAdd([
      {
        name: 'Ramipril',
        dose: '5mg',
        frequency: 'Once daily',
        route: 'Oral'
      },
      {
        name: 'Metformin',
        dose: '500mg',
        frequency: 'Twice daily',
        route: 'Oral'
      }
    ]);
    
    // Add an incident log
    await db.logIncident(encounterId, 'Encounter Started', 'Development test encounter');
  }
}
