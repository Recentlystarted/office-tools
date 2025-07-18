'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { testApiConnectivity } from '@/lib/api';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function ApiStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkApiStatus = async () => {
    setStatus('checking');
    try {
      const isOnline = await testApiConnectivity();
      setStatus(isOnline ? 'online' : 'offline');
      setLastChecked(new Date());
    } catch (error) {
      console.error('API status check failed:', error);
      setStatus('offline');
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkApiStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-3 w-3 animate-spin" />;
      case 'online':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'offline':
        return <XCircle className="h-3 w-3 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking...';
      case 'online':
        return 'API Online';
      case 'offline':
        return 'API Offline';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'secondary';
      case 'online':
        return 'default';
      case 'offline':
        return 'destructive';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getStatusColor()} className="flex items-center gap-1">
        {getStatusIcon()}
        {getStatusText()}
      </Badge>
      {status !== 'checking' && (
        <Button
          size="sm"
          variant="ghost"
          onClick={checkApiStatus}
          className="h-6 w-6 p-0"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      )}
      {lastChecked && (
        <span className="text-xs text-muted-foreground">
          Last checked: {lastChecked.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
