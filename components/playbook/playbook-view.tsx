"use client"

import { useState } from 'react'
import { FileText, ChevronRight, Check, X, Zap, Target, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Strategy {
  id: string
  name: string
  description: string
  rules: string[]
  riskLevel: 'Low' | 'Medium' | 'High'
}

const strategies: Strategy[] = [
  {
    id: 'pendulo-1',
    name: 'Pendulo 1',
    description: 'Reversal strategy when price is significantly extended from EMA 8 on Daily timeframe with aligned H1 EMAs.',
    rules: [
      'Price must be > 2 ATR away from EMA 8 on D1',
      'H1 EMA 8 & 21 must show divergence',
      'Wait for reversal candlestick pattern',
      'Entry at market close of reversal candle',
      'Stop loss: Previous swing high/low',
      'Take profit: 1:2 R:R minimum'
    ],
    riskLevel: 'Medium'
  },
  {
    id: 'pendulo-2',
    name: 'Pendulo 2',
    description: 'Enhanced Pendulo with additional momentum confirmation via Magneto indicator.',
    rules: [
      'All Pendulo 1 conditions must be met',
      'Magneto indicator shows overbought/oversold',
      'RSI divergence on H4 timeframe',
      'Volume spike confirmation required',
      'Entry: Limit order at 50% retracement',
      'Take profit: Extended to 1:3 R:R'
    ],
    riskLevel: 'Low'
  },
  {
    id: 'pendulo-3',
    name: 'Pendulo 3',
    description: 'Aggressive version for extreme market conditions with pyramiding allowed.',
    rules: [
      'Price > 3 ATR from EMA 8 on D1',
      'Multi-timeframe alignment (D1, H4, H1)',
      'Extreme RSI readings (< 20 or > 80)',
      'Allow up to 3 pyramid entries',
      'Trailing stop after first target',
      'Maximum risk: 2% per full position'
    ],
    riskLevel: 'High'
  },
  {
    id: 'sixjetset',
    name: 'SixJetSet',
    description: 'Intraday momentum strategy based on 6 EMA alignment across timeframes.',
    rules: [
      'EMA 6 must cross EMA 21 on H1',
      'Trend direction confirmed on H4',
      'Entry within 30 minutes of signal',
      'Avoid entries 1 hour before news',
      'Stop loss: 15 pips or below structure',
      'Take profit: 1:2 R:R'
    ],
    riskLevel: 'Medium'
  },
  {
    id: 'puertas',
    name: 'Puertas del Cielo',
    description: 'Breakout strategy targeting key psychological levels and supply/demand zones.',
    rules: [
      'Identify key psychological level (00, 50)',
      'Wait for price to test level 2+ times',
      'Entry on third touch with momentum',
      'Stop loss: Other side of zone',
      'Take profit: Next key level',
      'Trail stop after 1:1 achieved'
    ],
    riskLevel: 'Medium'
  },
  {
    id: 'simpleflow',
    name: 'SimpleFlow',
    description: 'Basic trend-following strategy for beginners. High win rate, lower R:R.',
    rules: [
      'Price above/below EMA 50 on H1',
      'EMA 8 crosses EMA 21 in trend direction',
      'Enter on pullback to EMA 8',
      'Stop loss: Below EMA 21',
      'Take profit: 1:1.5 R:R',
      'Maximum 2 trades per day per pair'
    ],
    riskLevel: 'Low'
  }
]

interface FlowNode {
  id: string
  question: string
  yesPath?: string
  noPath?: string
  action?: string
  color?: string
}

const flowNodes: FlowNode[] = [
  {
    id: 'start',
    question: 'Is Price Alejado from EMA 8 in 1D?',
    yesPath: 'pendulo-check',
    noPath: 'intraday-check'
  },
  {
    id: 'pendulo-check',
    question: 'Check Magneto Indicator - Extreme Reading?',
    yesPath: 'pendulo-23',
    noPath: 'pendulo-1'
  },
  {
    id: 'pendulo-1',
    action: 'Execute Pendulo 1 Strategy',
    color: 'success'
  },
  {
    id: 'pendulo-23',
    question: 'RSI Divergence on H4?',
    yesPath: 'pendulo-2',
    noPath: 'pendulo-3'
  },
  {
    id: 'pendulo-2',
    action: 'Execute Pendulo 2 Strategy',
    color: 'success'
  },
  {
    id: 'pendulo-3',
    action: 'Execute Pendulo 3 Strategy (Aggressive)',
    color: 'warning'
  },
  {
    id: 'intraday-check',
    question: 'H1 EMA Alignment Confirmed?',
    yesPath: 'sixjetset-check',
    noPath: 'discard'
  },
  {
    id: 'sixjetset-check',
    question: 'EMA 6 Cross EMA 21 on H1?',
    yesPath: 'sixjetset',
    noPath: 'puertas-check'
  },
  {
    id: 'sixjetset',
    action: 'Execute SixJetSet Strategy',
    color: 'success'
  },
  {
    id: 'puertas-check',
    question: 'At Key Psychological Level?',
    yesPath: 'puertas',
    noPath: 'simpleflow-check'
  },
  {
    id: 'puertas',
    action: 'Execute Puertas del Cielo',
    color: 'success'
  },
  {
    id: 'simpleflow-check',
    question: 'Price Above/Below EMA 50?',
    yesPath: 'simpleflow',
    noPath: 'discard'
  },
  {
    id: 'simpleflow',
    action: 'Execute SimpleFlow Strategy',
    color: 'success'
  },
  {
    id: 'discard',
    action: 'Discard Setup - No Valid Entry',
    color: 'destructive'
  }
]

export function PlaybookView() {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('pendulo-1')
  const [currentNode, setCurrentNode] = useState<string>('start')
  const [visitedNodes, setVisitedNodes] = useState<string[]>(['start'])
  const [pathHistory, setPathHistory] = useState<{ node: string, choice: 'yes' | 'no' }[]>([])

  const currentFlowNode = flowNodes.find(n => n.id === currentNode)

  const handleChoice = (choice: 'yes' | 'no') => {
    if (!currentFlowNode) return
    const nextNodeId = choice === 'yes' ? currentFlowNode.yesPath : currentFlowNode.noPath
    if (nextNodeId) {
      setVisitedNodes(prev => [...prev, nextNodeId])
      setPathHistory(prev => [...prev, { node: currentNode, choice }])
      setCurrentNode(nextNodeId)
    }
  }

  const resetFlowchart = () => {
    setCurrentNode('start')
    setVisitedNodes(['start'])
    setPathHistory([])
  }

  const strategy = strategies.find(s => s.id === selectedStrategy)

  const getNodeColorClasses = (color?: string) => {
    switch (color) {
      case 'success':
        return {
          bg: 'bg-success/10 dark:bg-success/10',
          border: 'border-success',
          text: 'text-success',
          glow: 'glow-green'
        }
      case 'destructive':
        return {
          bg: 'bg-destructive/10 dark:bg-destructive/10',
          border: 'border-destructive',
          text: 'text-destructive',
          glow: 'glow-red'
        }
      case 'warning':
        return {
          bg: 'bg-amber-500/10 dark:bg-amber-500/10',
          border: 'border-amber-500',
          text: 'text-amber-500',
          glow: ''
        }
      default:
        return {
          bg: 'bg-primary/10 dark:bg-primary/10',
          border: 'border-primary',
          text: 'text-primary',
          glow: 'glow-blue'
        }
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="font-heading text-2xl font-semibold text-foreground">Playbook</h2>
        <p className="text-muted-foreground">Your trading plan and strategy decision tree</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Strategy Editor */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">Strategy Guide</h3>
              <p className="text-sm text-muted-foreground">Review your trading rules</p>
            </div>
          </div>

          {/* Strategy Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {strategies.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStrategy(s.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  selectedStrategy === s.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                )}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Strategy Content */}
          {strategy && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-xl font-semibold text-foreground">{strategy.name}</h4>
                <span className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase",
                  strategy.riskLevel === 'Low' && "bg-success/20 text-success",
                  strategy.riskLevel === 'Medium' && "bg-amber-500/20 text-amber-500",
                  strategy.riskLevel === 'High' && "bg-destructive/20 text-destructive"
                )}>
                  {strategy.riskLevel} Risk
                </span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{strategy.description}</p>

              <div className="space-y-2">
                <h5 className="text-xs uppercase tracking-wider text-muted-foreground/70">Rules & Conditions</h5>
                <div className="space-y-2">
                  {strategy.rules.map((rule, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 dark:bg-white/[0.02] border border-border"
                    >
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-primary">{index + 1}</span>
                      </div>
                      <p className="text-sm text-foreground/80">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Flowchart */}
        <div className="glass rounded-2xl p-6 circuit-grid">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground">Decision Tree</h3>
                <p className="text-sm text-muted-foreground">Interactive strategy selector</p>
              </div>
            </div>
            <button
              onClick={resetFlowchart}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-muted-foreground hover:bg-secondary/80 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Flowchart Path */}
          <div className="space-y-4">
            {/* Visited path */}
            {pathHistory.map((item, index) => {
              const node = flowNodes.find(n => n.id === item.node)
              return (
                <div key={index} className="relative">
                  <div className="glass rounded-xl p-4 border border-border bg-card/80 dark:bg-card">
                    <p className="text-sm text-foreground/80 mb-3">{node?.question}</p>
                    <div className="flex gap-2">
                      <span className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold uppercase",
                        item.choice === 'yes' 
                          ? "bg-success/20 text-success" 
                          : "bg-secondary text-muted-foreground/50"
                      )}>
                        Yes
                      </span>
                      <span className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold uppercase",
                        item.choice === 'no' 
                          ? "bg-destructive/20 text-destructive" 
                          : "bg-secondary text-muted-foreground/50"
                      )}>
                        No
                      </span>
                    </div>
                  </div>
                  {/* Connector Line */}
                  <div className="absolute left-8 -bottom-4 w-0.5 h-4 bg-gradient-to-b from-primary to-transparent" />
                </div>
              )
            })}

            {/* Current Node */}
            {currentFlowNode && (
              <div className={cn(
                "rounded-xl p-5 transition-all border-2",
                currentFlowNode.action 
                  ? cn(
                      getNodeColorClasses(currentFlowNode.color).bg,
                      getNodeColorClasses(currentFlowNode.color).border,
                      getNodeColorClasses(currentFlowNode.color).glow
                    )
                  : "glass border-primary/30 glow-blue"
              )}>
                {currentFlowNode.action ? (
                  <div className="flex items-center gap-4">
                    {currentFlowNode.color === 'success' ? (
                      <Target className="w-8 h-8 text-success" />
                    ) : currentFlowNode.color === 'destructive' ? (
                      <AlertCircle className="w-8 h-8 text-destructive" />
                    ) : (
                      <Zap className="w-8 h-8 text-amber-500" />
                    )}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        {currentFlowNode.color === 'destructive' ? 'No Entry' : 'Execute at 1%'}
                      </p>
                      <p className={cn(
                        "font-heading text-lg font-semibold",
                        getNodeColorClasses(currentFlowNode.color).text
                      )}>
                        {currentFlowNode.action}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-foreground/80 mb-4">{currentFlowNode.question}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleChoice('yes')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-success/20 text-success font-bold uppercase text-sm hover:bg-success/30 transition-all hover:scale-[1.02]"
                      >
                        <Check className="w-4 h-4" />
                        Yes
                      </button>
                      <button
                        onClick={() => handleChoice('no')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-destructive/20 text-destructive font-bold uppercase text-sm hover:bg-destructive/30 transition-all hover:scale-[1.02]"
                      >
                        <X className="w-4 h-4" />
                        No
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Circuit Path Visualization */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Path Visualization</p>
            <div className="flex items-center gap-1 flex-wrap">
              {visitedNodes.map((nodeId, index) => {
                const node = flowNodes.find(n => n.id === nodeId)
                const colorClasses = getNodeColorClasses(node?.color)
                return (
                  <div key={index} className="flex items-center">
                    <div className={cn(
                      "px-2 py-1 rounded text-[10px] font-mono",
                      node?.action 
                        ? cn(colorClasses.bg, colorClasses.text)
                        : "bg-primary/20 text-primary"
                    )}>
                      {nodeId}
                    </div>
                    {index < visitedNodes.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-primary mx-1" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
