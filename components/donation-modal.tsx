"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Heart, Coffee, Star, Shield, Zap, CheckCircle, XCircle, Gift, Sparkles, Share2, ThumbsUp, Copy, MessageCircle, Send } from 'lucide-react'
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
  const [userRating, setUserRating] = useState<number>(0)
  const [hasRated, setHasRated] = useState(false)

  // Check if user has already rated
  useState(() => {
    const savedRating = localStorage.getItem('office-tools-rating')
    if (savedRating) {
      setUserRating(parseInt(savedRating))
      setHasRated(true)
    }
  })

  const handleRating = async (rating: number) => {
    try {
      setUserRating(rating)
      setHasRated(true)
      
      // Save rating locally
      localStorage.setItem('office-tools-rating', rating.toString())
      localStorage.setItem('office-tools-rated-at', new Date().toISOString())
      
      // Save rating to API (using VPS)
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/ratings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rating,
            timestamp: new Date().toISOString(),
            source: 'donation-modal'
          })
        })
      } catch (apiError) {
        console.log('API not available, rating saved locally only')
      }
      
      toast.success(
        `Thank you for rating us ${rating} stars! ⭐`,
        {
          description: 'Your feedback helps us improve our service.',
          duration: 3000,
          icon: <Star className="h-4 w-4 text-yellow-500" />,
        }
      )
    } catch (error) {
      console.error('Rating failed:', error)
      toast.error('Failed to save rating', {
        description: 'Please try again later.',
        duration: 3000,
      })
    }
  }

  const handleShare = async (platform: string) => {
    const shareData = {
      title: 'Office Tools - Free PDF & Document Tools',
      text: 'Check out these amazing free online tools for PDF processing, document conversion, and more! 🚀',
      url: 'https://office-tools.in'
    }

    const shareLinks = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareData.text}\n${shareData.url}`)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.text)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
      copy: shareData.url
    }

    try {
      if (platform === 'copy') {
        await navigator.clipboard.writeText(shareData.url)
        toast.success('Link copied to clipboard! 📋', {
          description: 'Share it with your friends and colleagues.',
          duration: 3000,
        })
      } else if (platform === 'native' && navigator.share) {
        await navigator.share(shareData)
        toast.success('Thanks for sharing! 🎉', {
          description: 'Your friends will love these tools too.',
          duration: 3000,
        })
      } else {
        window.open(shareLinks[platform as keyof typeof shareLinks], '_blank')
        toast.success('Thanks for sharing! 🎉', {
          description: 'Your friends will love these tools too.',
          duration: 3000,
        })
      }
      
      // Track sharing both locally and via API
      const shareHistory = JSON.parse(localStorage.getItem('office-tools-shares') || '[]')
      shareHistory.push({
        platform,
        timestamp: new Date().toISOString(),
        source: 'donation-modal'
      })
      localStorage.setItem('office-tools-shares', JSON.stringify(shareHistory))
      
      // Save to API (using VPS)
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/shares`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform,
            timestamp: new Date().toISOString(),
            source: 'donation-modal'
          })
        })
      } catch (apiError) {
        console.log('API not available, share tracked locally only')
      }
      
    } catch (error) {
      console.error('Share failed:', error)
      toast.error('Sharing failed', {
        description: 'Please try again or copy the link manually.',
        duration: 3000,
      })
    }
  }

  const handleRazorpayDonation = async (amount: number) => {
    try {
      setIsLoading(true)
      setProcessingAmount(amount)

      await makeDonation(
        amount,
        (response: RazorpayResponse) => {
          console.log('Donation successful:', response)
          
          // Save donation to VPS API
          try {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/donations`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                amount,
                currency: 'INR',
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                status: 'success',
                timestamp: new Date().toISOString(),
                source: 'donation-modal'
              })
            }).catch(err => console.log('Donation tracking failed:', err))
          } catch (err) {
            console.log('Donation API not available')
          }

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

          {/* Rating Section */}
          <div className="border-t border-violet-200 dark:border-violet-800 pt-4">
            <div className="text-center mb-3">
              <h3 className="font-semibold text-violet-700 dark:text-violet-300 mb-2">
                Rate Our Service
              </h3>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    disabled={hasRated}
                    className={`transition-all duration-200 ${
                      hasRated 
                        ? 'cursor-default' 
                        : 'hover:scale-110 cursor-pointer'
                    }`}
                  >
                    <Star 
                      className={`h-6 w-6 ${
                        star <= userRating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {hasRated && (
                <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">
                  Thank you for rating us {userRating} stars! ⭐
                </p>
              )}
            </div>
          </div>

          {/* Share Section */}
          <div className="border-t border-violet-200 dark:border-violet-800 pt-4">
            <div className="text-center mb-3">
              <h3 className="font-semibold text-violet-700 dark:text-violet-300 mb-2">
                Share with Friends
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('whatsapp')}
                  className="h-10 text-green-600 border-green-300 hover:bg-green-50 dark:hover:bg-green-950/20"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('telegram')}
                  className="h-10 text-blue-600 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Telegram
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('copy')}
                  className="h-10 text-violet-600 border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/20"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Link
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('twitter')}
                  className="h-10 text-blue-500 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('facebook')}
                  className="h-10 text-blue-700 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Facebook
                </Button>
              </div>
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
