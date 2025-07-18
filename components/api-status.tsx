'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

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

  const testApiConnectivity = async (): Promise<ApiConnectivity> => {
    const result: ApiConnectivity = {
      primary: false,
      stirling: false,
      primaryTime: undefined,
      stirlingTime: undefined,
    };

    // Test primary API
    try {
      const start = Date.now();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });
      result.primaryTime = Date.now() - start;
      result.primary = response.ok;
    } catch (error) {
      console.error('Primary API test failed:', error);
      result.primary = false;
    }

    // Test Stirling-PDF API
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
      console.error('Stirling-PDF test failed:', error);
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
      
      // Determine overall status
      if (result.primary && result.stirling) {
        setStatus('online');
      } else if (result.primary || result.stirling) {
        setStatus('mixed');
      } else {
        setStatus('offline');
      }
      
      setLastChecked(new Date());
    } catch (error) {
      console.error('API status check failed:', error);
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

  const getStatusIcon = (apiStatus: boolean | undefined) => {
    if (isLoading) return <Loader2 className="h-3 w-3 animate-spin" />;
    if (apiStatus === undefined) return <Loader2 className="h-3 w-3 animate-spin" />;
    return apiStatus ? (
      <CheckCircle className="h-3 w-3 text-green-500" />
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
    <div className="bg-muted/50 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Badge variant={getStatusVariant()}>
            {status === 'checking' ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : status === 'online' ? (
              <Wifi className="h-3 w-3 mr-1" />
            ) : (
              <WifiOff className="h-3 w-3 mr-1" />
            )}
            {getStatusText()}
          </Badge>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={checkApiStatus}
          disabled={isLoading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="flex items-center justify-between p-2 bg-background rounded">
          <div className="flex items-center space-x-2">
            {getStatusIcon(connectivity.primary)}
            <span className="font-medium">Primary API</span>
          </div>
          <div className="text-right">
            <div className="font-mono text-green-600">
              {getTimeDisplay(connectivity.primaryTime)}
            </div>
            <div className="text-muted-foreground text-xs">
              {(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/^https?:\/\//, '')}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-background rounded">
          <div className="flex items-center space-x-2">
            {getStatusIcon(connectivity.stirling)}
            <span className="font-medium">Stirling PDF</span>
          </div>
          <div className="text-right">
            <div className="font-mono text-blue-600">
              {getTimeDisplay(connectivity.stirlingTime)}
            </div>
            <div className="text-muted-foreground text-xs">
              {(process.env.NEXT_PUBLIC_STIRLING_URL || 'http://localhost:8080').replace(/^https?:\/\//, '')}
            </div>
          </div>
        </div>
      </div>

      {lastChecked && (
        <div className="text-xs text-muted-foreground mt-2 text-center">
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
