"use client"

import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, Image } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Trade {
  id: string
  asset: string
  side: 'BUY' | 'SELL'
  entryDate: string
  duration: string
  entryPrice: number
  exitPrice: number
  strategy: string
  netProfit: number
  accountId: string
  // Expanded data
  mae: number
  mfe: number
  commission: number
  lotSize: number
  screenshotUrl?: string
  // Human input
  signalQuality?: 'Good' | 'Bad'
  badSignalReason?: string
  tradeExecuted?: 'Yes' | 'No'
  skipReason?: string
  sentiment?: string
}

const trades: Trade[] = [
  {
    id: '1',
    asset: 'EUR/USD',
    side: 'BUY',
    entryDate: '2024-01-15 09:30',
    duration: '2h 15m',
    entryPrice: 1.08542,
    exitPrice: 1.08892,
    strategy: 'Pendulo 2',
    netProfit: 350.00,
    accountId: 'acc-001',
    mae: -12.5,
    mfe: 42.0,
    commission: 2.50,
    lotSize: 1.0,
    screenshotUrl: '#',
    signalQuality: 'Good',
    tradeExecuted: 'Yes',
    sentiment: 'Disciplined'
  },
  {
    id: '2',
    asset: 'GBP/USD',
    side: 'SELL',
    entryDate: '2024-01-15 14:45',
    duration: '45m',
    entryPrice: 1.27234,
    exitPrice: 1.27534,
    strategy: 'SixJetSet',
    netProfit: -150.00,
    accountId: 'acc-001',
    mae: -35.0,
    mfe: 8.0,
    commission: 3.00,
    lotSize: 0.5,
    screenshotUrl: '#'
  },
  {
    id: '3',
    asset: 'USD/JPY',
    side: 'BUY',
    entryDate: '2024-01-16 03:15',
    duration: '4h 30m',
    entryPrice: 148.234,
    exitPrice: 148.734,
    strategy: 'Puertas del Cielo',
    netProfit: 500.00,
    accountId: 'acc-002',
    mae: -8.0,
    mfe: 55.0,
    commission: 2.00,
    lotSize: 1.5,
    signalQuality: 'Good',
    tradeExecuted: 'Yes',
    sentiment: 'Disciplined'
  },
  {
    id: '4',
    asset: 'AUD/USD',
    side: 'SELL',
    entryDate: '2024-01-16 10:00',
    duration: '1h 20m',
    entryPrice: 0.65892,
    exitPrice: 0.65692,
    strategy: 'SimpleFlow',
    netProfit: 200.00,
    accountId: 'acc-002',
    mae: -5.0,
    mfe: 25.0,
    commission: 1.50,
    lotSize: 1.0,
    signalQuality: 'Good',
    tradeExecuted: 'Yes',
    sentiment: 'Anxious'
  },
  {
    id: '5',
    asset: 'USD/CAD',
    side: 'BUY',
    entryDate: '2024-01-17 08:30',
    duration: '3h 00m',
    entryPrice: 1.34562,
    exitPrice: 1.34262,
    strategy: 'Pendulo 1',
    netProfit: -120.00,
    accountId: 'acc-001',
    mae: -45.0,
    mfe: 12.0,
    commission: 2.00,
    lotSize: 0.8
  }
]

const strategies = ['Pendulo 1', 'Pendulo 2', 'Pendulo 3', 'SixJetSet', 'Puertas del Cielo', 'SimpleFlow']
const sentiments = ['Disciplined', 'FOMO', 'Anxious', 'Early Close']

interface TradeTableProps {
  accountFilter: string
}

export function TradeTable({ accountFilter }: TradeTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [tradeData, setTradeData] = useState<Record<string, Partial<Trade>>>({})

  const filteredTrades = accountFilter === 'all' 
    ? trades 
    : trades.filter(t => t.accountId === accountFilter)

  const updateTradeData = (tradeId: string, field: string, value: string) => {
    setTradeData(prev => ({
      ...prev,
      [tradeId]: {
        ...prev[tradeId],
        [field]: value
      }
    }))
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-8 gap-4 px-6 py-4 bg-secondary/50 dark:bg-white/[0.02] border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
        <div>Asset</div>
        <div>Side</div>
        <div>Entry Date</div>
        <div>Duration</div>
        <div>Entry / Exit</div>
        <div>Strategy</div>
        <div>Net Profit</div>
        <div></div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-border">
        {filteredTrades.map((trade) => (
          <TradeRow
            key={trade.id}
            trade={trade}
            expanded={expandedId === trade.id}
            onToggle={() => setExpandedId(expandedId === trade.id ? null : trade.id)}
            localData={tradeData[trade.id] || {}}
            onUpdate={(field, value) => updateTradeData(trade.id, field, value)}
          />
        ))}
      </div>
    </div>
  )
}

interface TradeRowProps {
  trade: Trade
  expanded: boolean
  onToggle: () => void
  localData: Partial<Trade>
  onUpdate: (field: string, value: string) => void
}

function TradeRow({ trade, expanded, onToggle, localData, onUpdate }: TradeRowProps) {
  const isProfit = trade.netProfit >= 0

  return (
    <div className="transition-all duration-300">
      {/* Main Row */}
      <div 
        className="grid grid-cols-8 gap-4 px-6 py-4 items-center hover:bg-secondary/50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <div className="font-heading font-semibold text-foreground">{trade.asset}</div>
        <div>
          <span className={cn(
            "px-2.5 py-1 rounded-md text-xs font-bold uppercase",
            trade.side === 'BUY' 
              ? "bg-success/20 text-success" 
              : "bg-destructive/20 text-destructive"
          )}>
            {trade.side}
          </span>
        </div>
        <div className="text-sm text-foreground/80 font-mono">{trade.entryDate}</div>
        <div className="text-sm text-muted-foreground">{trade.duration}</div>
        <div className="text-sm font-mono">
          <span className="text-foreground/80">{trade.entryPrice}</span>
          <span className="text-muted-foreground mx-1">-</span>
          <span className="text-foreground/80">{trade.exitPrice}</span>
        </div>
        <div className="text-sm text-primary">{trade.strategy}</div>
        <div className={cn(
          "text-lg font-heading font-bold",
          isProfit ? "text-success" : "text-destructive"
        )}>
          {isProfit ? '+' : ''}{trade.netProfit.toFixed(2)}
        </div>
        <div className="flex justify-end">
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-6 py-6 bg-secondary/30 dark:bg-white/[0.01] border-t border-border animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-8">
            {/* Quantitative Data */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full" />
                Webhook Data
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 dark:bg-white/[0.02] rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">MAE</p>
                  <p className="text-lg font-mono text-destructive">{trade.mae} pips</p>
                </div>
                <div className="bg-secondary/50 dark:bg-white/[0.02] rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">MFE</p>
                  <p className="text-lg font-mono text-success">{trade.mfe} pips</p>
                </div>
                <div className="bg-secondary/50 dark:bg-white/[0.02] rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Commission</p>
                  <p className="text-lg font-mono text-foreground/80">${trade.commission}</p>
                </div>
                <div className="bg-secondary/50 dark:bg-white/[0.02] rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Lot Size</p>
                  <p className="text-lg font-mono text-foreground/80">{trade.lotSize}</p>
                </div>
              </div>
              {trade.screenshotUrl && (
                <a 
                  href={trade.screenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <Image className="w-4 h-4" />
                  View TradingView Screenshot
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Human Input Form */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-success rounded-full" />
                Trade Analysis
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 block">Strategy</label>
                    <select
                      value={localData.strategy || trade.strategy}
                      onChange={(e) => onUpdate('strategy', e.target.value)}
                      className="w-full glass px-3 py-2 rounded-lg text-sm text-foreground/80 bg-card border-border focus:border-primary outline-none"
                    >
                      {strategies.map(s => (
                        <option key={s} value={s} className="bg-card text-foreground">{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 block">cBot Signal Quality</label>
                    <select
                      value={localData.signalQuality || trade.signalQuality || ''}
                      onChange={(e) => onUpdate('signalQuality', e.target.value)}
                      className="w-full glass px-3 py-2 rounded-lg text-sm text-foreground/80 bg-card border-border focus:border-primary outline-none"
                    >
                      <option value="" className="bg-card text-foreground">Select...</option>
                      <option value="Good" className="bg-card text-foreground">Good</option>
                      <option value="Bad" className="bg-card text-foreground">Bad</option>
                    </select>
                  </div>
                </div>

                {(localData.signalQuality || trade.signalQuality) === 'Bad' && (
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 block">Bad Signal Reason</label>
                    <textarea
                      value={localData.badSignalReason || trade.badSignalReason || ''}
                      onChange={(e) => onUpdate('badSignalReason', e.target.value)}
                      placeholder="Describe why the signal was bad..."
                      className="w-full glass px-3 py-2 rounded-lg text-sm text-foreground/80 bg-card border-border focus:border-primary outline-none resize-none h-20"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 block">Trade Executed?</label>
                    <select
                      value={localData.tradeExecuted || trade.tradeExecuted || ''}
                      onChange={(e) => onUpdate('tradeExecuted', e.target.value)}
                      className="w-full glass px-3 py-2 rounded-lg text-sm text-foreground/80 bg-card border-border focus:border-primary outline-none"
                    >
                      <option value="" className="bg-card text-foreground">Select...</option>
                      <option value="Yes" className="bg-card text-foreground">Yes</option>
                      <option value="No" className="bg-card text-foreground">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 block">Sentiment/Mindset</label>
                    <select
                      value={localData.sentiment || trade.sentiment || ''}
                      onChange={(e) => onUpdate('sentiment', e.target.value)}
                      className="w-full glass px-3 py-2 rounded-lg text-sm text-foreground/80 bg-card border-border focus:border-primary outline-none"
                    >
                      <option value="" className="bg-card text-foreground">Select...</option>
                      {sentiments.map(s => (
                        <option key={s} value={s} className="bg-card text-foreground">{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {(localData.tradeExecuted || trade.tradeExecuted) === 'No' && (
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 block">Reason for Skipping</label>
                    <textarea
                      value={localData.skipReason || trade.skipReason || ''}
                      onChange={(e) => onUpdate('skipReason', e.target.value)}
                      placeholder="Why did you skip this trade?"
                      className="w-full glass px-3 py-2 rounded-lg text-sm text-foreground/80 bg-card border-border focus:border-primary outline-none resize-none h-20"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
