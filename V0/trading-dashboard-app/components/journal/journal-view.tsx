"use client"

import { useState } from 'react'
import { PerformanceHero } from './performance-hero'
import { TradeTable } from './trade-table'

export function JournalView() {
  const [selectedAccount, setSelectedAccount] = useState('all')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="font-heading text-2xl font-semibold text-foreground">Journal</h2>
        <p className="text-muted-foreground">Track and analyze your trading activity</p>
      </div>

      {/* Performance Hero */}
      <PerformanceHero 
        selectedAccount={selectedAccount}
        onAccountChange={setSelectedAccount}
      />

      {/* Trade Table */}
      <TradeTable accountFilter={selectedAccount} />
    </div>
  )
}
