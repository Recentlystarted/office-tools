"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Heart, Coffee, Star, Shield, Zap, CheckCircle, XCircle, Gift, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { makeDonation, RazorpayResponse } from '@/lib/razorpay'

interface DonationModalProps {
  trigger?: React.ReactNode
  className?: string
}

export default function DonationModal({ trigger, className = '' }: DonationModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [processingAmount, setProcessingAmount] = useState<number | null>(null)

  const handleRazorpayDonation = async (amount: number) => {
    try {
      setIsLoading(true)
      setProcessingAmount(amount)

      await makeDonation(
        amount,
        (response: RazorpayResponse) => {
          console.log('Donation successful:', response)
          toast.success(
            `Thank you for your ₹${amount} donation! 🎉`,
            {
              description: `Your support helps us keep Office Tools free for everyone.`,
              duration: 5000,
              icon: <CheckCircle className="h-4 w-4 text-green-500" />,
            }
          )
          setIsLoading(false)
          setProcessingAmount(null)
          setIsOpen(false)
        },
        (error: any) => {
          console.log('Payment cancelled or failed:', error.message)
          
          // Don't show error toast for user cancellation
          if (error.message === 'Payment cancelled') {
            toast.info(
              'Payment cancelled',
              {
                description: 'No worries! You can donate anytime.',
                duration: 3000,
                icon: <XCircle className="h-4 w-4 text-blue-500" />,
              }
            )
          } else {
            toast.error(
              'Payment failed',
              {
                description: 'Please try again later.',
                duration: 4000,
                icon: <XCircle className="h-4 w-4 text-red-500" />,
              }
            )
          }
          setIsLoading(false)
          setProcessingAmount(null)
        }
      )
    } catch (error) {
      console.error('Donation error:', error)
      toast.error('Unable to process donation', {
        description: 'Please try again later',
        duration: 4000,
      })
      setIsLoading(false)
      setProcessingAmount(null)
    }
  }

  const donationAmounts = [
    { amount: 100, icon: Coffee, label: 'Coffee', color: 'bg-violet-500' },
    { amount: 250, icon: Heart, label: 'Support', color: 'bg-pink-500' },
    { amount: 500, icon: Gift, label: 'Generous', color: 'bg-purple-500' },
    { amount: 1000, icon: Sparkles, label: 'Amazing', color: 'bg-indigo-500' },
  ]

  const defaultTrigger = (
    <Button 
      className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      size="lg"
    >
      <Heart className="mr-2 h-5 w-5" />
      Support Us
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-pink-950/20 border-violet-200 dark:border-violet-800">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full shadow-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Support Our Free Service
          </DialogTitle>
          <DialogDescription className="text-violet-700 dark:text-violet-300 text-base">
            Help us keep Office Tools free and ad-free for everyone worldwide
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Donation Amounts */}
          <div className="grid grid-cols-2 gap-3">
            {donationAmounts.map(({ amount, icon: Icon, label, color }) => (
              <Button
                key={amount}
                variant="outline"
                onClick={() => handleRazorpayDonation(amount)}
                disabled={isLoading}
                className={`h-16 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 border-2 ${
                  processingAmount === amount
                    ? 'bg-violet-500 text-white border-violet-500 shadow-lg'
                    : 'border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/30 hover:border-violet-400 dark:hover:border-violet-600'
                }`}
              >
                <div className={`p-1 rounded-full ${color}`}>
                  <Icon className="h-3 w-3 text-white" />
                </div>
                <span className="font-semibold text-sm">
                  {processingAmount === amount ? 'Processing...' : `₹${amount}`}
                </span>
                <span className="text-xs opacity-75">{label}</span>
              </Button>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="flex flex-col items-center gap-1 text-violet-700 dark:text-violet-300">
              <Shield className="h-4 w-4" />
              <span>Secure</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-violet-700 dark:text-violet-300">
              <Zap className="h-4 w-4" />
              <span>No Ads</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-violet-700 dark:text-violet-300">
              <Star className="h-4 w-4" />
              <span>Always Free</span>
            </div>
          </div>

          {/* Security Badge */}
          <div className="text-center">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              100% Secure Payment
            </Badge>
            <p className="text-xs text-violet-600 dark:text-violet-400 mt-2">
              🔒 Powered by Razorpay • Safe & Secure
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
