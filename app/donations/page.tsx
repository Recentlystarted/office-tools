import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Users, Coffee, Star, TrendingUp, Gift, CheckCircle, IndianRupee } from 'lucide-react'
import DonationSupport from '@/components/donation-support'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Support Our Free Service | Office Tools',
  description: 'Help us keep Office Tools free for everyone. Support our mission to provide the best online tools for productivity and document processing.',
  keywords: 'donation, support, free tools, office tools, contribute, help',
}

export default function DonationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Support Our Free Service
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Help us keep Office Tools completely free and ad-free for everyone. Your support makes a real difference!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-blue-200 dark:border-blue-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full w-fit mx-auto mb-2">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                100K+
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 dark:text-gray-400">
                Happy users worldwide using our free tools every month
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full w-fit mx-auto mb-2">
                <Coffee className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                25+
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 dark:text-gray-400">
                Professional tools available completely free with no ads
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full w-fit mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-900 dark:text-green-100">
                24/7
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 dark:text-gray-400">
                Always available service with 99.9% uptime guarantee
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Donation Component */}
        <div className="max-w-2xl mx-auto mb-12">
          <DonationSupport />
        </div>

        {/* Why Support Us Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
            Why Your Support Matters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-blue-200 dark:border-blue-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">No Ads, Ever</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  We keep our platform completely ad-free to provide you with the best user experience without distractions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg">Premium Features</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  All our premium features are available for free - no subscriptions, no limits, no hidden costs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Gift className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-lg">Continuous Development</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Your support helps us add new tools, improve existing ones, and maintain high-quality service.
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle className="text-lg">Community Impact</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Help us serve students, professionals, and businesses worldwide with free, reliable tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Donation Tiers */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
            Donation Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-blue-200 dark:border-blue-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-center">
              <CardHeader>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit mx-auto mb-2">
                  <Coffee className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">₹100</CardTitle>
                <Badge variant="outline" className="border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300">
                  Coffee Supporter
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Helps cover server costs for 1 day
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-center">
              <CardHeader>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-fit mx-auto mb-2">
                  <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">₹250</CardTitle>
                <Badge variant="outline" className="border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                  Love Supporter
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Supports development for 3 days
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-center">
              <CardHeader>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit mx-auto mb-2">
                  <Gift className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">₹500</CardTitle>
                <Badge variant="outline" className="border-green-300 text-green-700 dark:border-green-700 dark:text-green-300">
                  Generous Supporter
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Funds a new tool feature
                </p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 dark:border-yellow-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-center">
              <CardHeader>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full w-fit mx-auto mb-2">
                  <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardTitle className="text-xl">₹1000+</CardTitle>
                <Badge variant="outline" className="border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-300">
                  Amazing Supporter
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enables major improvements
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Other Ways to Support */}
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Other Ways to Support Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="outline" size="lg" className="h-auto p-4 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30">
              <div className="flex flex-col items-center gap-2">
                <Star className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium">Share with Friends</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Help us reach more users</span>
              </div>
            </Button>
            <Button variant="outline" size="lg" className="h-auto p-4 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30">
              <div className="flex flex-col items-center gap-2">
                <Coffee className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium">Spread the Word</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Rate us on social media</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
