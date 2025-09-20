'use client'

import { DCABuyForm } from '@/components/dca/DCABuyForm'
import { Card } from '@/components/ui'

export default function DCAPage() {
  return (
    <div className="min-h-screen p-4 pt-20 bg-primary-light/5">
      <div className="max-w-md mx-auto">
        <Card className="p-6 bg-white border-border shadow-lg">
          <h1 className="text-2xl font-bold text-foreground mb-6 text-center">
            Bean to Bit
          </h1>
          <DCABuyForm />
        </Card>
      </div>
    </div>
  )
}