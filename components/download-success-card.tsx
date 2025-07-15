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
  icon = <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
  showDonation = true
}: DownloadSuccessCardProps) {
  return (
    <div className="space-y-6">
      {/* Success Card */}
      <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Success Info */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                  {title}
                </h3>
                <p className="text-emerald-700 dark:text-emerald-300 text-sm mb-3">
                  {description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    {fileName}
                  </Badge>
                  <Badge variant="outline" className="border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs">
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
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Download className="mr-2 h-5 w-5" />
                {downloadButtonText}
              </Button>
              <Button 
                onClick={onReset}
                variant="outline"
                size="lg"
                className="border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
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
                <Heart className="h-5 w-5 text-destructive" />
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                  Support Our Free Service
                </h3>
                <Heart className="h-5 w-5 text-destructive" />
              </div>
              <p className="text-amber-700 dark:text-amber-300 text-sm max-w-md mx-auto">
                Help us keep this tool free and secure for everyone! No signup required, your privacy protected.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
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
