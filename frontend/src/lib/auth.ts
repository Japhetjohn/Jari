import {
  authApi,
  institutionApi,
  setStoredToken,
  removeStoredToken,
  getStoredToken,
  TOKEN_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  ApiError,
} from "@/lib/api-client";
import { saveInstitutionRegistration, type InstitutionRegistrationRecord } from "@/lib/simulated-data";

export type MockRole = "farmer" | "admin" | "verification_agent" | "institutional_user";

export type MockUser = {
  id: string;
  fullName: string;
  phone: string;
  password: string;
  role: MockRole;
};

export type ActiveSession = {
  id: string;
  fullName: string;
  phone: string;
  role: MockRole;
  accessToken?: string;
};

const USERS_KEY = "jari-simulated-users";

const seedUsers: MockUser[] = [
  {
    id: "user-farmer-demo",
    fullName: "Amina Daniel",
    phone: "08030000000",
    password: "password123",
    role: "farmer",
  },
  {
    id: "user-admin-demo",
    fullName: "Grace Musa",
    phone: "08040000000",
    password: "admin123",
    role: "admin",
  },
  {
    id: "user-agent-demo",
    fullName: "Musa Solomon",
    phone: "08050000000",
    password: "agent123",
    role: "verification_agent",
  },
  {
    id: "user-institution-demo",
    fullName: "Plateau Agri Trust",
    phone: "08060000000",
    password: "institution123",
    role: "institutional_user",
  },
];

const normalizePhone = (value: string) => value.replace(/\s+/g, "").trim();

const readUsers = (): MockUser[] => {
  if (typeof window === "undefined") {
    return seedUsers;
  }

  const stored = window.localStorage.getItem(USERS_KEY);
  if (!stored) {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }

  try {
    const parsed = JSON.parse(stored) as MockUser[];
    return parsed.length ? parsed : seedUsers;
  } catch {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }
};

export function getSavedSession(): ActiveSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as ActiveSession;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function saveSession(session: ActiveSession): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getSavedSession());
}

export function logoutSimulation(): void {
  if (typeof window !== "undefined") {
    removeStoredToken();
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

/**
 * Real Backend Login: Authenticates with FastAPI backend and stores JWT access token.
 * Falls back to local simulated users if backend is unreachable in offline demo mode.
 */
export async function loginWithBackend(phone: string, password: string): Promise<ActiveSession> {
  const normalizedPhone = normalizePhone(phone);

  try {
    const res = await authApi.login({ phone: normalizedPhone, password });
    const user = res.user;
    setStoredToken(res.access_token);

    const session: ActiveSession = {
      id: String(user.id),
      fullName: user.full_name,
      phone: normalizePhone(user.phone),
      role: (user.role as MockRole) || "farmer",
      accessToken: res.access_token,
    };

    saveSession(session);
    return session;
  } catch (error) {
    if (error instanceof ApiError && error.status !== 0) {
      throw error;
    }

    // Network unreachable -> fallback to simulated demo accounts
    return loginWithSimulation(normalizedPhone, password);
  }
}

/**
 * Synchronous simulation login preserved for demo workspace buttons & offline use.
 */
export function loginWithSimulation(phone: string, password: string): ActiveSession {
  const normalizedPhone = normalizePhone(phone);
  const user = readUsers().find(
    (candidate) => normalizePhone(candidate.phone) === normalizedPhone && candidate.password === password
  );

  if (!user) {
    throw new Error("Invalid phone number or password.");
  }

  const session: ActiveSession = {
    id: user.id,
    fullName: user.fullName,
    phone: normalizePhone(user.phone),
    role: user.role,
  };

  saveSession(session);
  return session;
}

/**
 * Real Backend Farmer Registration: Registers via FastAPI and logs in.
 */
export async function registerWithBackend(
  fullName: string,
  phone: string,
  password: string
): Promise<ActiveSession> {
  const trimmedName = fullName.trim();
  const normalizedPhone = normalizePhone(phone);

  if (!trimmedName || trimmedName.length < 2) {
    throw new Error("Please enter your full name.");
  }

  if (!normalizedPhone || normalizedPhone.length < 10) {
    throw new Error("Please enter a valid phone number.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  try {
    await authApi.register({
      full_name: trimmedName,
      phone: normalizedPhone,
      password,
      role: "farmer",
    });

    return await loginWithBackend(normalizedPhone, password);
  } catch (error) {
    if (error instanceof ApiError && error.status !== 0) {
      throw error;
    }

    return registerWithSimulation(trimmedName, normalizedPhone, password);
  }
}

/**
 * Synchronous simulation registration preserved for offline compatibility.
 */
export function registerWithSimulation(fullName: string, phone: string, password: string): ActiveSession {
  const trimmedName = fullName.trim();
  const normalizedPhone = normalizePhone(phone);

  if (!trimmedName || trimmedName.length < 2) {
    throw new Error("Please enter your full name.");
  }

  if (!normalizedPhone || normalizedPhone.length < 10) {
    throw new Error("Please enter a valid phone number.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  const users = readUsers();
  const alreadyExists = users.some((user) => normalizePhone(user.phone) === normalizedPhone);

  if (alreadyExists) {
    throw new Error("An account with this phone number already exists.");
  }

  const newUser: MockUser = {
    id: `user-${Date.now()}`,
    fullName: trimmedName,
    phone: normalizedPhone,
    password,
    role: "farmer",
  };

  const updatedUsers = [...users, newUser];
  const session: ActiveSession = {
    id: newUser.id,
    fullName: trimmedName,
    phone: normalizedPhone,
    role: "farmer",
  };

  if (typeof window !== "undefined") {
    const previousUsers = window.localStorage.getItem(USERS_KEY);
    const previousSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
    try {
      window.localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      try {
        if (previousUsers === null) window.localStorage.removeItem(USERS_KEY);
        else window.localStorage.setItem(USERS_KEY, previousUsers);
      } catch {
        /* Continue attempting to restore */
      }
      try {
        if (previousSession === null) window.localStorage.removeItem(SESSION_STORAGE_KEY);
        else window.localStorage.setItem(SESSION_STORAGE_KEY, previousSession);
      } catch {
        /* Preserve the original storage error */
      }
      throw error;
    }
  }

  return session;
}

/**
 * Real Backend Institution Registration:
 * 1. Creates institutional user account on backend.
 * 2. Authenticates and gets JWT.
 * 3. Submits institution profile to `/api/v1/institution/profile`.
 */
export async function registerInstitutionWithBackend(
  phone: string,
  password: string,
  application: Omit<InstitutionRegistrationRecord, "id" | "userId" | "submittedAt" | "status">
): Promise<ActiveSession> {
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone || normalizedPhone.length < 10) {
    throw new Error("Please enter a valid representative phone number.");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  try {
    await authApi.register({
      full_name: application.organisationName.trim(),
      phone: normalizedPhone,
      password,
      role: "institutional_user",
    });

    const session = await loginWithBackend(normalizedPhone, password);

    // Save institutional profile to backend
    await institutionApi.saveProfile({
      organisation_name: application.organisationName.trim(),
      organisation_type: application.organisationType,
      cac_registration_number: application.cacRegistrationNumber.trim(),
      year_established: application.yearEstablished ? parseInt(String(application.yearEstablished), 10) : undefined,
      official_email: application.officialEmail.trim(),
      official_phone: application.officialPhone.trim(),
      website: application.website?.trim() || undefined,
      office_address: application.officeAddress?.trim() || undefined,
      state: application.state?.trim() || undefined,
      lga: application.lga?.trim() || undefined,
      categories: application.categories || [],
      services: application.services || {},
      representative: application.representative || {},
      documents: application.documents || [],
    });

    saveInstitutionRegistration({ ...application, userId: session.id });
    return session;
  } catch (error) {
    if (error instanceof ApiError && error.status !== 0) {
      throw error;
    }

    return registerInstitutionWithSimulation(normalizedPhone, password, application);
  }
}

/**
 * Synchronous simulated institution registration.
 */
export function registerInstitutionWithSimulation(
  phone: string,
  password: string,
  application: Omit<InstitutionRegistrationRecord, "id" | "userId" | "submittedAt" | "status">
): ActiveSession {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone || normalizedPhone.length < 10) throw new Error("Please enter a valid representative phone number.");
  if (password.length < 6) throw new Error("Password must be at least 6 characters long.");
  const users = readUsers();
  if (users.some((user) => normalizePhone(user.phone) === normalizedPhone)) throw new Error("An account with this phone number already exists.");

  const newUser: MockUser = {
    id: `user-${Date.now()}`,
    fullName: application.organisationName.trim(),
    phone: normalizedPhone,
    password,
    role: "institutional_user",
  };
  const session: ActiveSession = { id: newUser.id, fullName: newUser.fullName, phone: normalizedPhone, role: "institutional_user" };

  if (typeof window !== "undefined") {
    const previousUsers = window.localStorage.getItem(USERS_KEY);
    const previousSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
    try {
      window.localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      saveInstitutionRegistration({ ...application, userId: newUser.id });
    } catch (error) {
      try {
        if (previousUsers === null) window.localStorage.removeItem(USERS_KEY);
        else window.localStorage.setItem(USERS_KEY, previousUsers);
      } catch {
        /* Continue */
      }
      try {
        if (previousSession === null) window.localStorage.removeItem(SESSION_STORAGE_KEY);
        else window.localStorage.setItem(SESSION_STORAGE_KEY, previousSession);
      } catch {
        /* Preserve error */
      }
      throw error;
    }
  }

  return session;
}

/**
 * Restore current session by validating JWT token against GET /api/v1/auth/me
 */
export async function restoreSession(): Promise<ActiveSession | null> {
  const token = getStoredToken();
  if (!token) {
    return getSavedSession();
  }

  try {
    const user = await authApi.getMe();
    const session: ActiveSession = {
      id: String(user.id),
      fullName: user.full_name,
      phone: normalizePhone(user.phone),
      role: (user.role as MockRole) || "farmer",
      accessToken: token,
    };
    saveSession(session);
    return session;
  } catch {
    logoutSimulation();
    return null;
  }
}
