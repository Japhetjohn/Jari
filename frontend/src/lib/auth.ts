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
};

const USERS_KEY = "jari-simulated-users";
const SESSION_KEY = "jari-simulated-session";

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

const saveUsers = (users: MockUser[]) => {
    if (typeof window !== "undefined") {
        window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
};

export function getSavedSession(): ActiveSession | null {
    if (typeof window === "undefined") {
        return null;
    }

    const stored = window.localStorage.getItem(SESSION_KEY);
    if (!stored) {
        return null;
    }

    try {
        return JSON.parse(stored) as ActiveSession;
    } catch {
        window.localStorage.removeItem(SESSION_KEY);
        return null;
    }
}

export function isAuthenticated() {
    return Boolean(getSavedSession());
}

export function logoutSimulation() {
    if (typeof window !== "undefined") {
        window.localStorage.removeItem(SESSION_KEY);
    }
}

export function loginWithSimulation(phone: string, password: string): ActiveSession {
    const normalizedPhone = normalizePhone(phone);
    const user = readUsers().find(
        (candidate) => normalizePhone(candidate.phone) === normalizedPhone && candidate.password === password,
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

    if (typeof window !== "undefined") {
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    return session;
}

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
    saveUsers(updatedUsers);

    const session: ActiveSession = {
        id: newUser.id,
        fullName: trimmedName,
        phone: normalizedPhone,
        role: "farmer",
    };

    if (typeof window !== "undefined") {
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    return session;
}
