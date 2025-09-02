// // src/contexts/ProfileContext.tsx
// import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
// import api from "@/lib/api";

// // —— Types (mirroring your controllers) ——
// export interface HealthData {
//   server: "online" | string;
//   database: "healthy" | "disconnected" | string;
//   time: string; // ISO
// }

// export interface ProfileData {
//   id: string;
//   name: string;
//   email: string;
//   preferences?: {
//     darkMode?: boolean;
//     [k: string]: unknown;
//   };
// }

// interface ProfileContextType {
//   // Health
//   health: HealthData | null;
//   loadingHealth: boolean;
//   errorHealth: string | null;
//   ping: () => Promise<boolean>;

//   // Profile
//   profile: ProfileData | null;
//   loadingProfile: boolean;
//   errorProfile: string | null;
//   fetchProfile: () => Promise<boolean>;
//   updateProfile: (input: { name: string; preferences?: ProfileData["preferences"] }) => Promise<boolean>;
//   changePassword: (input: { currentPassword: string; newPassword: string }) => Promise<boolean>;

//   // Expose setters for advanced UIs
//   setProfile: React.Dispatch<React.SetStateAction<ProfileData | null>>;
// }

// const ProfileContext = createContext<ProfileContextType | null>(null);

// export function ProfileProvider({ children }: { children: React.ReactNode }) {
//   // Health state
//   const [health, setHealth] = useState<HealthData | null>(null);
//   const [loadingHealth, setLoadingHealth] = useState(false);
//   const [errorHealth, setErrorHealth] = useState<string | null>(null);

//   // Profile state
//   const [profile, setProfile] = useState<ProfileData | null>(null);
//   const [loadingProfile, setLoadingProfile] = useState(false);
//   const [errorProfile, setErrorProfile] = useState<string | null>(null);

//   // —— Actions ——
//   const ping = useCallback(async () => {
//     setLoadingHealth(true);
//     setErrorHealth(null);
//     try {
//       const { data } = await api.get("/health");
//       setHealth(data?.data ?? null);
//       return true;
//     } catch (e: any) {
//       setErrorHealth(e?.response?.data?.error || "Health check failed");
//       return false;
//     } finally {
//       setLoadingHealth(false);
//     }
//   }, []);

//   const fetchProfile = useCallback(async () => {
//     setLoadingProfile(true);
//     setErrorProfile(null);
//     try {
//       const { data } = await api.get("/profile/me");
//       setProfile(data?.data ?? null);
//       return true;
//     } catch (e: any) {
//       setErrorProfile(e?.response?.data?.error || "Failed to load profile");
//       return false;
//     } finally {
//       setLoadingProfile(false);
//     }
//   }, []);

//   const updateProfile = useCallback(
//     async (input: { name: string; preferences?: ProfileData["preferences"] }) => {
//       // optimistic update
//       const prev = profile;
//       if (profile) setProfile({ ...profile, name: input.name, preferences: input.preferences ?? profile.preferences });
//       try {
//         const { data } = await api.put("/profile/update", input);
//         setProfile(data?.data ?? null);
//         return true;
//       } catch (e: any) {
//         setProfile(prev);
//         setErrorProfile(e?.response?.data?.error || "Failed to update profile");
//         return false;
//       }
//     },
//     [profile]
//   );

//   const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
//     try {
//       await api.put("/profile/password", { currentPassword, newPassword });
//       return true;
//     } catch (e: any) {
//       setErrorProfile(e?.response?.data?.error || "Failed to change password");
//       return false;
//     }
//   }, []);

//   const value = useMemo(
//     () => ({
//       // health
//       health,
//       loadingHealth,
//       errorHealth,
//       ping,
//       // profile
//       profile,
//       loadingProfile,
//       errorProfile,
//       fetchProfile,
//       updateProfile,
//       changePassword,
//       setProfile,
//     }),
//     [health, loadingHealth, errorHealth, profile, loadingProfile, errorProfile, ping, fetchProfile, updateProfile, changePassword]
//   );

//   return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
// }

// export const useProfile = () => {
//   const ctx = useContext(ProfileContext);
//   if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
//   return ctx;
// };



// src/contexts/HealthContext.tsx
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import api from "@/lib/api";

// —— Types ——
export interface HealthData {
  server: "online" | string;
  database: "healthy" | "disconnected" | string;
  time: string; // ISO
}

interface HealthContextType {
  health: HealthData | null;
  loadingHealth: boolean;
  errorHealth: string | null;
  ping: () => Promise<boolean>;
}

const HealthContext = createContext<HealthContextType | null>(null);

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [errorHealth, setErrorHealth] = useState<string | null>(null);

  const ping = useCallback(async () => {
    setLoadingHealth(true);
    setErrorHealth(null);
    try {
      const { data } = await api.get("/health");
      setHealth(data?.data ?? null);
      return true;
    } catch (e: any) {
      setErrorHealth(e?.response?.data?.error || "Health check failed");
      return false;
    } finally {
      setLoadingHealth(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      health,
      loadingHealth,
      errorHealth,
      ping,
    }),
    [health, loadingHealth, errorHealth, ping]
  );

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
}

export const useHealth = () => {
  const ctx = useContext(HealthContext);
  if (!ctx) throw new Error("useHealth must be used within a HealthProvider");
  return ctx;
};
