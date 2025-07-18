'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Share2, TrendingUp, Users, Calendar } from 'lucide-react'

interface RatingSummary {
  totalRatings: number
  averageRating: number
  ratingDistribution: { [key: number]: number }
}

interface ShareSummary {
  totalShares: number
  platformBreakdown: { [key: string]: number }
}

interface RecentRating {
  rating: number
  timestamp: string
  source: string
}

export default function AdminDashboard() {
  const [ratings, setRatings] = useState<RatingSummary | null>(null)
  const [shares, setShares] = useState<ShareSummary | null>(null)
  const [recentRatings, setRecentRatings] = useState<RecentRating[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  // Simple authentication check
  useEffect(() => {
    const stored = localStorage.getItem('admin-authenticated')
    if (stored === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Get admin password from environment variable
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    
    if (!adminPassword) {
      alert('Admin access is not configured. Please contact support.');
      return;
    }
    
    if (password === adminPassword) {
      setIsAuthenticated(true)
      localStorage.setItem('admin-authenticated', 'true')
    } else {
      alert('Invalid password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin-authenticated')
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const fetchData = async () => {
    try {
      const [ratingsResponse, sharesResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/ratings`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/shares`)
      ])

      if (ratingsResponse.ok) {
        const ratingsData = await ratingsResponse.json()
        setRatings({
          totalRatings: ratingsData.total_ratings,
          averageRating: ratingsData.average_rating,
          ratingDistribution: ratingsData.distribution
        })
        setRecentRatings(ratingsData.recent_ratings?.map((rating: any) => ({
          rating: rating.rating,
          timestamp: rating.timestamp,
          source: 'Web'
        })) || [])
      }

      if (sharesResponse.ok) {
        const sharesData = await sharesResponse.json()
        setShares({
          totalShares: sharesData.total_shares,
          platformBreakdown: sharesData.platform_breakdown
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Admin Access
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Please enter password to access analytics
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-violet-600 text-white p-3 rounded-lg hover:bg-violet-700 transition-colors"
              >
                Login
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Office Tools Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor ratings and sharing activity
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Ratings Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ratings?.totalRatings || 0}</div>
            <p className="text-xs text-muted-foreground">
              Average: {ratings?.averageRating || 0} stars
            </p>
          </CardContent>
        </Card>

        {/* Shares Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
            <Share2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shares?.totalShares || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across all platforms
            </p>
          </CardContent>
        </Card>

        {/* Engagement Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((ratings?.totalRatings || 0) + (shares?.totalShares || 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Total interactions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>How users rate our service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ratings?.ratingDistribution && Object.entries(ratings.ratingDistribution)
                .sort(([a], [b]) => parseInt(b) - parseInt(a))
                .map(([stars, count]) => (
                <div key={stars} className="flex items-center">
                  <div className="flex items-center w-16">
                    <span className="text-sm font-medium">{stars}</span>
                    <Star className="h-3 w-3 text-yellow-500 ml-1" />
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-violet-500 h-2 rounded-full"
                        style={{ 
                          width: `${ratings.totalRatings > 0 ? (count / ratings.totalRatings) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Share Platform Breakdown</CardTitle>
            <CardDescription>Where users share our tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {shares?.platformBreakdown && Object.entries(shares.platformBreakdown)
                .sort(([,a], [,b]) => b - a)
                .map(([platform, count]) => (
                <div key={platform} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge variant="outline" className="capitalize">
                      {platform}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ 
                          width: `${shares.totalShares > 0 ? (count / shares.totalShares) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Ratings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Ratings</CardTitle>
            <CardDescription>Latest user feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRatings.length > 0 ? (
                recentRatings.map((rating, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < rating.rating 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <Badge variant="secondary" className="ml-3">
                        {rating.source}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(rating.timestamp)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No ratings yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
