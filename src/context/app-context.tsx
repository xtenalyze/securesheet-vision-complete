
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';

interface BrandingConfig {
  companyName: string;
  logoUrl: string; // URL to the logo, or a placeholder
  primaryColor: string; // HSL string
  accentColor: string; // HSL string
}

interface AppContextType {
  isSetupComplete: boolean;
  setIsSetupComplete: (isComplete: boolean) => void;
  brandingConfig: BrandingConfig;
  setBrandingConfig: (config: BrandingConfig) => void;
  isLoading: boolean;
  spreadsheetId: string | null;
  setSpreadsheetId: (id: string | null) => void;
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_BRANDING: BrandingConfig = {
  companyName: 'SecureSheet Vision',
  logoUrl: '', // Placeholder, to be set during setup
  primaryColor: '218 57% 46%', // Default HSL for #3366BB
  accentColor: '19 100% 60%',  // Default HSL for #FF7733
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [isSetupComplete, setIsSetupCompleteState] = useState<boolean>(false);
  const [brandingConfig, setBrandingConfigState] = useState<BrandingConfig>(DEFAULT_BRANDING);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [spreadsheetId, setSpreadsheetIdState] = useState<string | null>(null);
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedIsSetupComplete = localStorage.getItem('isSetupComplete');
      if (storedIsSetupComplete) {
        setIsSetupCompleteState(JSON.parse(storedIsSetupComplete));
      }

      const storedSpreadsheetId = localStorage.getItem('spreadsheetId');
      if (storedSpreadsheetId) {
        setSpreadsheetIdState(storedSpreadsheetId);
      }
      const storedApiKey = localStorage.getItem('apiKey');
      if (storedApiKey) {
        setApiKeyState(storedApiKey);
      }

      const storedBrandingConfig = localStorage.getItem('brandingConfig');
      let activeBrandingConfig = DEFAULT_BRANDING;

      if (storedBrandingConfig) {
        try {
          const parsedConfig = JSON.parse(storedBrandingConfig) as Partial<BrandingConfig>;
          // Basic validation for critical fields
          if (parsedConfig && typeof parsedConfig.companyName === 'string' && typeof parsedConfig.primaryColor === 'string' && typeof parsedConfig.accentColor === 'string') {
            // If logoUrl from localStorage is a blob URL, it won't be valid after a restart.
            // For simplicity, we'll use it if present, but AppLayout should handle invalid/expired blob URLs.
            // A more robust solution for logos would involve storing them persistently.
            activeBrandingConfig = {
                companyName: parsedConfig.companyName,
                logoUrl: parsedConfig.logoUrl || '', // Ensure logoUrl is always a string
                primaryColor: parsedConfig.primaryColor,
                accentColor: parsedConfig.accentColor,
            };
          } else {
            console.warn("Stored brandingConfig is malformed. Using defaults.");
          }
        } catch (jsonError) {
          console.error("Error parsing brandingConfig from localStorage. Using defaults.", jsonError);
        }
      }
      
      setBrandingConfigState(activeBrandingConfig);
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--primary', activeBrandingConfig.primaryColor);
        document.documentElement.style.setProperty('--accent', activeBrandingConfig.accentColor);
      }

    } catch (error) {
      console.error("Error reading initial state from localStorage in AppProvider", error);
      // Fallback to ensure app remains functional with defaults
      setBrandingConfigState(DEFAULT_BRANDING);
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--primary', DEFAULT_BRANDING.primaryColor);
        document.documentElement.style.setProperty('--accent', DEFAULT_BRANDING.accentColor);
      }
      setIsSetupCompleteState(false);
      setSpreadsheetIdState(null);
      setApiKeyState(null);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array ensures this runs once on initial mount

  const setIsSetupComplete = (isComplete: boolean) => {
    setIsSetupCompleteState(isComplete);
    try {
      localStorage.setItem('isSetupComplete', JSON.stringify(isComplete));
    } catch (error) {
      console.error("Error writing isSetupComplete to localStorage", error);
    }
  };

  const setBrandingConfig = (config: BrandingConfig) => {
    setBrandingConfigState(config);
    try {
      localStorage.setItem('brandingConfig', JSON.stringify(config));
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--primary', config.primaryColor);
        document.documentElement.style.setProperty('--accent', config.accentColor);
      }
    } catch (error) {
      console.error("Error writing brandingConfig to localStorage", error);
    }
  };

  const setSpreadsheetId = (id: string | null) => {
    setSpreadsheetIdState(id);
    try {
      if (id) localStorage.setItem('spreadsheetId', id);
      else localStorage.removeItem('spreadsheetId');
    } catch (error) {
      console.error("Error writing spreadsheetId to localStorage", error);
    }
  }

  const setApiKey = (key: string | null) => {
    setApiKeyState(key);
     try {
      if (key) localStorage.setItem('apiKey', key);
      else localStorage.removeItem('apiKey');
    } catch (error) {
      console.error("Error writing apiKey to localStorage", error);
    }
  }

  const contextValue = useMemo(() => ({
    isSetupComplete,
    setIsSetupComplete,
    brandingConfig,
    setBrandingConfig,
    isLoading,
    spreadsheetId,
    setSpreadsheetId,
    apiKey,
    setApiKey
  }), [isSetupComplete, setIsSetupComplete, brandingConfig, setBrandingConfig, isLoading, spreadsheetId, setSpreadsheetId, apiKey, setApiKey]);


  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
