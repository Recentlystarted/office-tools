import { Button } from '@/components/ui/button'
import { Download, FileText } from 'lucide-react'

interface DownloadSuccessCardProps {
  title: string
  description: string
  fileName: string
  downloadButtonText: string
  resetButtonText: string
  onDownload: () => void
  onReset: () => void
  icon?: React.ReactNode
}

export function DownloadSuccessCard({
  title,
  description,
  fileName,
  downloadButtonText,
  resetButtonText,
  onDownload,
  onReset,
  icon = <FileText className="h-5 w-5 text-green-600" />
}: DownloadSuccessCardProps) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-green-900 mb-1">{title}</h3>
            <p className="text-green-700 text-sm">{description}</p>
            <p className="text-green-600 text-xs mt-1">File: {fileName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={onDownload}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <Download className="mr-2 h-4 w-4" />
            {downloadButtonText}
          </Button>
          <Button 
            onClick={onReset}
            variant="outline"
            size="lg"
          >
            {resetButtonText}
          </Button>
        </div>
      </div>
    </div>
  )
}
