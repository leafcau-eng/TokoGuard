export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type StoreId = 'a' | 'b' | 'c';
export type StoreFilter = StoreId | 'all';
export type Category = 'payment' | 'cash' | 'stock' | 'pattern';

interface AnomalyCommon {
  id: string;
  store: StoreId;
  storeLabel: string;
  date: string;
  title: string;
  category: Category;
  evidenceDetail: string[];
  status: string;
}

export interface ReconciliationAnomaly extends AnomalyCommon {
  type: 'reconciliation';
  severity: Severity;
  expected: string;
  actual: string;
  variance: string;
  sourceData: string;
  calculation: string;
  ruleTriggered: string;
  recountLabel: string | null;
}

export interface BehavioralAnomaly extends AnomalyCommon {
  type: 'behavioral';
  severity: Severity;
  sourceData: string;
  detectionRule: string;
  observedPattern: string;
  reasonFlagged: string;
}

export interface InsufficientAnomaly extends AnomalyCommon {
  type: 'insufficient';
  severity: null;
  // Slot severity ini WOULD BE ditempatkan di tab mana, murni buat navigasi/filter UI.
  // Bukan klaim severity asli -- itu justru yang gak bisa ditentukan.
  tabSeverity: Severity;
  gapNote: string;
  sourceAvail: string;
  calcAttempt: string;
  missingSource: string;
  explainWhy: string;
  ruleTriggered: string;
  recountLabel: string | null;
}

export type Anomaly = ReconciliationAnomaly | BehavioralAnomaly | InsufficientAnomaly;

export interface StoreMeta {
  id: StoreId;
  label: string;
  confidence: number;
  coverage: number;
  freshnessDays: number;
  freshnessLabel: string;
  sources: { sales: boolean; purchase: boolean; waste: boolean; opname: boolean };
}
