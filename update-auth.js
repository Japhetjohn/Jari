const fs = require('fs');

const path = 'frontend/src/lib/auth.ts';
let code = fs.readFileSync(path, 'utf8');

// Add syncAllFromBackend import
if (!code.includes('syncAllFromBackend')) {
  code = code.replace(
    'import { saveInstitutionRegistration, type InstitutionRegistrationRecord } from "@/lib/simulated-data";',
    'import { saveInstitutionRegistration, type InstitutionRegistrationRecord } from "@/lib/simulated-data";\nimport { syncAllFromBackend } from "@/lib/backend-sync";'
  );
}

// Update logoutSimulation
code = code.replace(
  /export function logoutSimulation\(\): void \{[\s\S]*?^\}/m,
  `export function logoutSimulation(): void {
  if (typeof window !== "undefined") {
    removeStoredToken();
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith("jari-demo:v1:"))
      .forEach((k) => window.localStorage.removeItem(k));
    window.dispatchEvent(new CustomEvent("jari:mock-data-changed", { detail: { key: "*" } }));
  }
}`
);

// Update loginWithBackend
code = code.replace(
  /export async function loginWithBackend\([\s\S]*?^}/m,
  `export async function loginWithBackend(phone: string, password: string): Promise<ActiveSession> {
  const normalizedPhone = normalizePhone(phone);

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
  try {
    await syncAllFromBackend();
  } catch {
    // Non-fatal if initial sync encounters empty collections
  }
  return session;
}`
);

// Update registerWithBackend
code = code.replace(
  /export async function registerWithBackend\([\s\S]*?^}/m,
  `export async function registerWithBackend(
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

  await authApi.register({
    full_name: trimmedName,
    phone: normalizedPhone,
    password,
    role: "farmer",
  });

  return await loginWithBackend(normalizedPhone, password);
}`
);

fs.writeFileSync(path, code, 'utf8');
console.log('Successfully updated auth.ts with live backend enforcement');

