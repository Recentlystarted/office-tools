import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, RefreshCw, CheckCircle, Heart, Coffee } from 'lucide-react'

interface DownloadSuccessCardProps {
  title: string
  description: string
  fileName: string
  downloadButtonText: string
  resetButtonText: string
  onDownload: () => void
  onReset: () => void
  icon?: React.ReactNode
  showDonation?: boolean
}

export function DownloadSuccessCard({
  title,
  description,
  fileName,
  downloadButtonText,
  resetButtonText,
  onDownload,
  onReset,
  icon = <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />,
  showDonation = true
}: DownloadSuccessCardProps) {
  return (
    <div className="space-y-6">
      {/* Success Card */}
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Success Info */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                  {title}
                </h3>
                <p className="text-green-700 dark:text-green-300 text-sm mb-3">
                  {description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    {fileName}
                  </Badge>
                  <Badge variant="outline" className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 text-xs">
                    Ready to download
                  </Badge>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              <Button 
                onClick={onDownload}
                size="lg"
                className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Download className="mr-2 h-5 w-5" />
                {downloadButtonText}
              </Button>
              <Button 
                onClick={onReset}
                variant="outline"
                size="lg"
                className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {resetButtonText}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donation Support */}
      {showDonation && (
        <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                  Support Our Free Service
                </h3>
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-amber-700 dark:text-amber-300 text-sm max-w-md mx-auto">
                Help us keep this tool free and secure for everyone! No signup required, your privacy protected.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  One-time Donation
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                >
                  <Coffee className="mr-2 h-4 w-4" />
                  Buy Us Coffee
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy Notice */}
      <div className="text-center text-xs text-muted-foreground bg-muted/30 dark:bg-muted/10 rounded-lg p-3">
        🔒 <strong>Privacy Protected:</strong> No account required • Files processed securely • No data stored on servers
      </div>
    </div>
  )
}
