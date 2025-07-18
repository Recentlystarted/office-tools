'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Heart, CreditCard, Coffee, Star, Shield, Zap, X, CheckCircle, XCircle, Gift, Sparkles, IndianRupee, Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { makeDonation, RazorpayResponse } from '@/lib/razorpay'

interface DonationSupportProps {
  compact?: boolean
  onClose?: () => void
}

export default function DonationSupport({ compact = false, onClose }: DonationSupportProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [processingAmount, setProcessingAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

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
              description: `Payment ID: ${response.razorpay_payment_id}`,
              duration: 5000,
              icon: <CheckCircle className="h-4 w-4 text-green-500" />,
            }
          )
          setIsLoading(false)
          setProcessingAmount(null)
        },
        (error: any) => {
          console.error('Donation failed:', error)
          toast.error(
            'Donation failed',
            {
              description: error.message || 'Please try again later',
              duration: 4000,
              icon: <XCircle className="h-4 w-4 text-red-500" />,
            }
          )
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

  if (compact) {
    return (
      <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Heart className="h-4 w-4 text-red-500 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100 block">
                  Support Our Free Service
                </span>
                <span className="text-xs text-blue-700 dark:text-blue-300 block sm:hidden">
                  Help us keep tools free for everyone
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button 
                size="sm" 
                onClick={() => handleRazorpayDonation(250)}
                disabled={isLoading}
                className={`h-8 flex-1 sm:flex-none ${
                  processingAmount === 250
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <IndianRupee className="mr-1 h-3 w-3" />
                {processingAmount === 250 ? 'Processing...' : 'Donate ₹250'}
              </Button>
              {onClose && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="h-8 w-8 p-0 flex-shrink-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleCustomDonation = () => {
    const amount = parseInt(customAmount)
    if (amount && amount >= 10 && amount <= 100000) {
      handleRazorpayDonation(amount)
    } else {
      toast.error('Please enter a valid amount between ₹10 and ₹100,000')
    }
  }

  const donationAmounts = [
    { amount: 100, icon: Coffee, label: 'Buy us coffee' },
    { amount: 250, icon: Heart, label: 'Show love' },
    { amount: 500, icon: Gift, label: 'Generous support' },
    { amount: 1000, icon: Sparkles, label: 'Amazing supporter' },
  ]

  return (
    <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 shadow-lg">
      <CardHeader className="text-center px-4 sm:px-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-blue-900 dark:text-blue-100 text-lg sm:text-xl">
            Support Our Free Service
          </CardTitle>
        </div>
        <CardDescription className="text-blue-700 dark:text-blue-300 text-sm sm:text-base">
          Help us keep Office Tools free and secure for everyone! Your support helps us maintain and improve our services.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
        {/* Donation Amounts */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {donationAmounts.map(({ amount, icon: Icon, label }) => (
              <div key={amount} className="text-center">
                <Button
                  variant="outline"
                  onClick={() => handleRazorpayDonation(amount)}
                  disabled={isLoading}
                  className={`w-full h-14 sm:h-16 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 text-xs sm:text-sm border-2 ${
                    processingAmount === amount
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                      : 'border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-400 dark:hover:border-blue-600'
                  }`}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="font-semibold">
                    {processingAmount === amount ? 'Processing...' : `₹${amount}`}
                  </span>
                </Button>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 hidden sm:block">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Custom Amount Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {showCustomInput ? 'Hide Custom Amount' : 'Enter Custom Amount'}
              </Button>
            </div>
            
            {showCustomInput && (
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <Label htmlFor="custom-amount" className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2 block">
                  Enter Amount (₹10 - ₹100,000)
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
                    <Input
                      id="custom-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      min="10"
                      max="100000"
                      className="pl-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button
                    onClick={handleCustomDonation}
                    disabled={isLoading || !customAmount}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? 'Processing...' : 'Donate'}
                  </Button>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Any amount between ₹10 and ₹100,000 is welcome
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Shield className="h-4 w-4 flex-shrink-0" />
            <span>Privacy Protected</span>
          </div>
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Zap className="h-4 w-4 flex-shrink-0" />
            <span>No Ads, No Tracking</span>
          </div>
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Star className="h-4 w-4 flex-shrink-0" />
            <span>Always Free</span>
          </div>
        </div>

        {/* Alternative Support */}
        <div className="text-center">
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
            Other ways to support us:
          </p>
          <div className="flex justify-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/30"
            >
              <Coffee className="mr-1 h-3 w-3" />
              Share with friends
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/30"
            >
              <Star className="mr-1 h-3 w-3" />
              Rate us
            </Button>
          </div>
        </div>

        {/* Security Badge */}
        <div className="text-center space-y-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            100% Secure Payment
          </Badge>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            🔒 Powered by Razorpay • No data stored • 100% secure transactions
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
