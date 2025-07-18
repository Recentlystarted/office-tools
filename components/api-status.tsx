'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle, XCircle, RefreshCw, Wifi, WifiOff, Settings, Globe, Zap, Server } from 'lucide-react';
import { toast } from 'sonner';

interface ApiConnectivity {
  primary: boolean;
  stirling: boolean;
  primaryTime?: number;
  stirlingTime?: number;
}

export default function ApiStatus() {
  const [connectivity, setConnectivity] = useState<ApiConnectivity>({
    primary: false,
    stirling: false
  });
  const [status, setStatus] = useState<'checking' | 'online' | 'offline' | 'mixed'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conversionEngine, setConversionEngine] = useState<'primary' | 'stirling'>('primary');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const testApiConnectivity = async (): Promise<ApiConnectivity> => {
    const result: ApiConnectivity = {
      primary: false,
      stirling: false,
      primaryTime: undefined,
      stirlingTime: undefined,
    };

    // Test primary API (our main API)
    try {
      const start = Date.now();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      console.log('Testing API URL:', apiUrl);
      
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });
      
      console.log('API Response status:', response.status);
      result.primaryTime = Date.now() - start;
      result.primary = response.ok;
    } catch (error) {
      console.error('API test failed:', error);
      result.primary = false;
    }

    // Test Stirling-PDF API (via our proxy)
    try {
      const start = Date.now();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/stirling/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });
      result.stirlingTime = Date.now() - start;
      result.stirling = response.ok;
    } catch (error) {
      result.stirling = false;
    }

    return result;
  };

  const checkApiStatus = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setStatus('checking');
    
    try {
      const result = await testApiConnectivity();
      setConnectivity(result);
      
      // Determine overall status - no toast notifications for routine checks
      if (result.primary && result.stirling) {
        setStatus('online');
      } else if (result.primary || result.stirling) {
        setStatus('mixed');
      } else {
        setStatus('offline');
      }
      
      setLastChecked(new Date());
    } catch (error) {
      setConnectivity({ primary: false, stirling: false });
      setStatus('offline');
      setLastChecked(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkApiStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load preferred conversion engine from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('conversionEngine');
    if (stored === 'primary' || stored === 'stirling') {
      setConversionEngine(stored);
    }
  }, []);

  // Save preferred conversion engine to localStorage
  const handleEngineChange = (engine: 'primary' | 'stirling') => {
    setConversionEngine(engine);
    localStorage.setItem('conversionEngine', engine);
    
    // Only show notification if the engine is actually available
    const engineName = engine === 'primary' ? 'Primary Engine' : 'Stirling PDF Engine';
    const isAvailable = connectivity[engine];
    
    if (isAvailable) {
      toast.success(`Switched to ${engineName}`);
    } else {
      toast.warning(`${engineName} is currently offline`);
    }
  };

  const getStatusIcon = (apiStatus: boolean | undefined) => {
    if (isLoading) return <Loader2 className="h-3 w-3 animate-spin text-blue-500" />;
    if (apiStatus === undefined) return <Loader2 className="h-3 w-3 animate-spin text-blue-500" />;
    return apiStatus ? (
      <CheckCircle className="h-3 w-3 text-emerald-500" />
    ) : (
      <XCircle className="h-3 w-3 text-red-500" />
    );
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking APIs...';
      case 'online':
        return 'All APIs Online';
      case 'mixed':
        return 'Partial Connectivity';
      case 'offline':
        return 'APIs Offline';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusVariant = (): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case 'checking':
        return 'outline';
      case 'online':
        return 'default';
      case 'mixed':
        return 'secondary';
      case 'offline':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getTimeDisplay = (time?: number) => {
    if (!time) return 'N/A';
    return time < 1000 ? `${time}ms` : `${(time / 1000).toFixed(1)}s`;
  };

  return (
    <Card className="mb-4 border-0 shadow-sm bg-gradient-to-r from-background to-muted/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant={getStatusVariant()} className="shadow-sm">
              {status === 'checking' ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : status === 'online' ? (
                <Wifi className="h-3 w-3 mr-1" />
              ) : (
                <WifiOff className="h-3 w-3 mr-1" />
              )}
              {getStatusText()}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="h-8 w-8 p-0 hover:bg-muted/50"
            >
              <Settings className="h-3 w-3" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={checkApiStatus}
            disabled={isLoading}
            className="h-8 w-8 p-0 hover:bg-muted/50"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Conversion Engine Selection */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Conversion Engine:</span>
            <Badge 
              variant={conversionEngine === 'primary' ? 'default' : 'secondary'} 
              className="text-xs shadow-sm"
            >
              {conversionEngine === 'primary' ? (
                <><Server className="h-3 w-3 mr-1" /> Primary Engine</>
              ) : (
                <><Zap className="h-3 w-3 mr-1" /> Stirling PDF</>
              )}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={conversionEngine === 'primary' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleEngineChange('primary')}
              className="text-xs h-9 justify-start shadow-sm transition-all hover:scale-[1.02]"
              disabled={!connectivity.primary}
            >
              <Server className="h-3 w-3 mr-2" />
              Primary API
              {connectivity.primary && <CheckCircle className="h-3 w-3 ml-auto text-emerald-500" />}
            </Button>
            <Button
              variant={conversionEngine === 'stirling' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleEngineChange('stirling')}
              className="text-xs h-9 justify-start shadow-sm transition-all hover:scale-[1.02]"
              disabled={!connectivity.stirling}
            >
              <Zap className="h-3 w-3 mr-2" />
              Stirling-PDF
              {connectivity.stirling && <CheckCircle className="h-3 w-3 ml-auto text-emerald-500" />}
            </Button>
          </div>
        </div>

        {/* API Status Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm">
            <div className="flex items-center space-x-2">
              {getStatusIcon(connectivity.primary)}
              <div>
                <div className="font-medium text-emerald-900 dark:text-emerald-100">Primary API</div>
                <div className="text-emerald-700 dark:text-emerald-300 text-[10px]">Fast & Reliable</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                {getTimeDisplay(connectivity.primaryTime)}
              </div>
              <div className="text-emerald-500 dark:text-emerald-400 text-[10px]">
                {conversionEngine === 'primary' && <Globe className="h-3 w-3 inline" />}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50 shadow-sm">
            <div className="flex items-center space-x-2">
              {getStatusIcon(connectivity.stirling)}
              <div>
                <div className="font-medium text-blue-900 dark:text-blue-100">Stirling PDF</div>
                <div className="text-blue-700 dark:text-blue-300 text-[10px]">Advanced Features</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-blue-600 dark:text-blue-400 text-[10px] font-semibold">
                {getTimeDisplay(connectivity.stirlingTime)}
              </div>
              <div className="text-blue-500 dark:text-blue-400 text-[10px]">
                {conversionEngine === 'stirling' && <Globe className="h-3 w-3 inline" />}
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Details */}
        {showAdvanced && (
          <div className="mt-4 p-3 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
            <div className="font-medium mb-2 text-slate-800 dark:text-slate-200">Engine Details:</div>
            <div className="space-y-1 text-slate-600 dark:text-slate-400 text-xs">
              <div>• Primary Engine: Optimized for speed and reliability</div>
              <div>• Stirling PDF: Advanced PDF processing capabilities</div>
              <div>• Auto-switch: Use Primary if Stirling fails</div>
              <div>• Response times measured in real-time</div>
            </div>
          </div>
        )}

        {lastChecked && (
          <div className="text-[10px] text-muted-foreground mt-3 text-center opacity-70">
            Last checked: {lastChecked.toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
