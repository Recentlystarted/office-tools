'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface ApiContextType {
  conversionEngine: 'primary' | 'stirling';
  setConversionEngine: (engine: 'primary' | 'stirling') => void;
  isApiOnline: (api: 'primary' | 'stirling') => boolean;
  connectivity: {
    primary: boolean;
    stirling: boolean;
    primaryTime?: number;
    stirlingTime?: number;
  };
  updateConnectivity: (connectivity: any) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const [conversionEngine, setConversionEngineState] = useState<'primary' | 'stirling'>('primary');
  const [connectivity, setConnectivity] = useState({
    primary: false,
    stirling: false,
    primaryTime: undefined,
    stirlingTime: undefined,
  });

  // Load preferred conversion engine from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('conversionEngine');
    if (stored === 'primary' || stored === 'stirling') {
      setConversionEngineState(stored);
    }
  }, []);

  const setConversionEngine = (engine: 'primary' | 'stirling') => {
    setConversionEngineState(engine);
    localStorage.setItem('conversionEngine', engine);
    
    // Show user-friendly notification
    const engineName = engine === 'primary' ? 'Primary Engine' : 'Stirling PDF Engine';
    const status = isApiOnline(engine) ? 'online' : 'offline';
    
    if (status === 'online') {
      toast.success(`Switched to ${engineName} (${status})`);
    } else {
      toast.warning(`Switched to ${engineName} (currently ${status})`);
    }
  };

  const isApiOnline = (api: 'primary' | 'stirling'): boolean => {
    return connectivity[api] === true;
  };

  const updateConnectivity = (newConnectivity: any) => {
    setConnectivity(newConnectivity);
  };

  return (
    <ApiContext.Provider
      value={{
        conversionEngine,
        setConversionEngine,
        isApiOnline,
        connectivity,
        updateConnectivity,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

/**
 * Smart API URL resolver that respects user's conversion engine preference
 */
export const getSmartApiUrl = (toolName: string, conversionEngine?: 'primary' | 'stirling'): string => {
  const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    endpoints: {
      // PDF Tools
      pdfToWord: '/api/pdf/convert',
      pdfToDocx: '/api/pdf/convert',
      pdfMerger: '/api/pdf-merger/merge',
      pdfCompressor: '/api/pdf-compressor/compress',
      pdfRotate: '/api/pdf-rotate/rotate',
      pdfUnlock: '/api/pdf/unlock',
      imageToPdf: '/api/image/to-pdf',
      imageConverter: '/api/image/convert',
      
      // Stirling PDF endpoints (proxied through our API)
      stirlingPdfToWord: '/api/stirling/convert/pdf/word',
      stirlingPdfMerger: '/api/stirling/merge-pdfs',
      stirlingPdfCompressor: '/api/stirling/compress-pdf',
      
      // Generators
      qrGenerator: '/api/generator/qr-generate',
      passwordGenerator: '/api/text/password',
      uuidGenerator: '/api/generator/uuid-generate',
      
      // Text Tools
      textCaseConverter: '/api/text/text-case',
      wordCounter: '/api/text/word-count',
      textAnalyzer: '/api/text/analyze',
      
      // Other tools
      jsonFormatter: '/api/tools/json-format',
      timestampConverter: '/api/tools/timestamp-convert',
      colorPicker: '/api/tools/color-convert',
      urlShortener: '/api/tools/url-shorten',
      
      // Health endpoints
      health: '/health',
    }
  };

  const endpoint = API_CONFIG.endpoints[toolName as keyof typeof API_CONFIG.endpoints];
  if (!endpoint) {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  // If user prefers Stirling PDF and we have a Stirling endpoint, use it
  if (conversionEngine === 'stirling' && toolName.includes('pdf')) {
    const stirlingKey = `stirling${toolName.charAt(0).toUpperCase() + toolName.slice(1)}`;
    const stirlingEndpoint = API_CONFIG.endpoints[stirlingKey as keyof typeof API_CONFIG.endpoints];
    if (stirlingEndpoint) {
      return `${API_CONFIG.baseUrl}${stirlingEndpoint}`;
    }
  }

  return `${API_CONFIG.baseUrl}${endpoint}`;
};
