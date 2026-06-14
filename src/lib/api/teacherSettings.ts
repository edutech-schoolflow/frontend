import { mockResponse } from "./mockClient";

export interface QualificationEntry {
  id: string;
  type: "degree" | "diploma" | "certificate" | "other";
  title: string;
  institution: string;
  year: string;
}

export interface StaffSettings {
  trcnNumber: string;
  bank: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  qualifications: QualificationEntry[];
}

const MOCK_SETTINGS: Record<string, StaffSettings> = {
  "demo-user": {
    trcnNumber: "",
    bank: { bankName: "", accountNumber: "", accountName: "" },
    qualifications: [],
  },
};

export const getStaffSettings = async (
  userId: string | undefined
): Promise<StaffSettings> => {
  const id = userId ?? "demo-user";
  if (!MOCK_SETTINGS[id]) {
    MOCK_SETTINGS[id] = {
      trcnNumber: "",
      bank: { bankName: "", accountNumber: "", accountName: "" },
      qualifications: [],
    };
  }
  return mockResponse({ ...MOCK_SETTINGS[id] });
};

export const saveStaffSettings = async (
  userId: string | undefined,
  patch: Partial<StaffSettings>
): Promise<StaffSettings> => {
  const id = userId ?? "demo-user";
  if (!MOCK_SETTINGS[id]) {
    MOCK_SETTINGS[id] = {
      trcnNumber: "",
      bank: { bankName: "", accountNumber: "", accountName: "" },
      qualifications: [],
    };
  }
  MOCK_SETTINGS[id] = { ...MOCK_SETTINGS[id], ...patch };
  return mockResponse({ ...MOCK_SETTINGS[id] });
};

export const NIGERIAN_BANKS = [
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank (FCMB)",
  "Guaranty Trust Bank (GTB)",
  "Heritage Bank",
  "Keystone Bank",
  "Opay",
  "Palmpay",
  "Polaris Bank",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "SunTrust Bank",
  "Union Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
];
