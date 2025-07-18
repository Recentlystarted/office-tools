"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Coffee } from 'lucide-react'
import DonationModal from '@/components/donation-modal'

export default function GlobalDonationButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DonationModal 
        trigger={
          <Button 
            className="rounded-full p-3 shadow-lg bg-violet-600 hover:bg-violet-700 text-white"
            size="lg"
          >
            <Heart className="h-5 w-5 mr-2" />
            Support Us
          </Button>
        }
        className="fixed bottom-16 right-4"
      />
    </div>
  )
}
