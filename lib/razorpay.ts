// Razorpay Integration for Office Tools
// This file handles Razorpay payment processing for donations

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, any>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export class RazorpayService {
  private static instance: RazorpayService;
  private isScriptLoaded = false;
  private scriptPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): RazorpayService {
    if (!RazorpayService.instance) {
      RazorpayService.instance = new RazorpayService();
    }
    return RazorpayService.instance;
  }

  // Load Razorpay script dynamically
  private loadScript(): Promise<void> {
    if (this.isScriptLoaded) {
      return Promise.resolve();
    }

    if (this.scriptPromise) {
      return this.scriptPromise;
    }

    this.scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        this.isScriptLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Razorpay script'));
      };
      document.head.appendChild(script);
    });

    return this.scriptPromise;
  }

  // Initialize payment with Razorpay
  public async initializePayment(options: RazorpayOptions): Promise<void> {
    try {
      await this.loadScript();
      
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not available');
      }

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error('Razorpay initialization failed:', error);
      throw error;
    }
  }

  // Create donation payment options
  public createDonationOptions(
    amount: number,
    onSuccess: (response: RazorpayResponse) => void,
    onError?: (error: any) => void
  ): RazorpayOptions {
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    
    if (!razorpayKey) {
      throw new Error('Razorpay key not configured');
    }

    return {
      key: razorpayKey,
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      name: 'Office Tools',
      description: 'Support our free service with a donation',
      image: '/favicon.svg',
      handler: onSuccess,
      prefill: {
        name: 'Supporter',
        email: 'support@office-tools.in',
      },
      notes: {
        purpose: 'donation',
        tool: 'office-tools',
      },
      theme: {
        color: '#8B5CF6',
      },
      modal: {
        ondismiss: () => {
          console.log('Payment cancelled by user');
          if (onError) {
            setTimeout(() => {
              onError(new Error('Payment cancelled'));
            }, 100);
          }
        },
      },
    };
  }

  // Process donation payment
  public async processDonation(
    amount: number,
    onSuccess?: (response: RazorpayResponse) => void,
    onError?: (error: any) => void
  ): Promise<void> {
    try {
      const options = this.createDonationOptions(
        amount,
        (response) => {
          console.log('Donation successful:', response);
          onSuccess?.(response);
        },
        onError
      );

      await this.initializePayment(options);
    } catch (error) {
      console.error('Donation processing failed:', error);
      onError?.(error);
    }
  }
}

// Export singleton instance
export const razorpayService = RazorpayService.getInstance();

// Utility function for quick donation
export const makeDonation = (
  amount: number,
  onSuccess?: (response: RazorpayResponse) => void,
  onError?: (error: any) => void
) => {
  return razorpayService.processDonation(amount, onSuccess, onError);
};
