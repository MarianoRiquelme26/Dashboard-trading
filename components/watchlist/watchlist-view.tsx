"use client"

import { useState } from 'react'
import { Plus, X, GripVertical, Folder, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Asset {
  id: string
  ticker: string
  trend: 'up' | 'down'
  price: string
}

interface CorrelationGroup {
  id: string
  name: string
  color: string
  assets: Asset[]
}

const initialGroups: CorrelationGroup[] = [
  {
    id: 'usd',
    name: 'USD Block',
    color: 'var(--primary)',
    assets: [
      { id: '1', ticker: 'EUR/USD', trend: 'up', price: '1.0854' },
      { id: '2', ticker: 'GBP/USD', trend: 'down', price: '1.2723' },
      { id: '3', ticker: 'AUD/USD', trend: 'up', price: '0.6589' },
      { id: '4', ticker: 'NZD/USD', trend: 'up', price: '0.6124' },
    ]
  },
  {
    id: 'jpy',
    name: 'JPY Block',
    color: 'var(--destructive)',
    assets: [
      { id: '5', ticker: 'USD/JPY', trend: 'up', price: '148.23' },
      { id: '6', ticker: 'EUR/JPY', trend: 'up', price: '160.89' },
      { id: '7', ticker: 'GBP/JPY', trend: 'down', price: '188.56' },
    ]
  },
  {
    id: 'indices',
    name: 'Indices',
    color: 'var(--success)',
    assets: [
      { id: '8', ticker: 'US30', trend: 'up', price: '38542.50' },
      { id: '9', ticker: 'US500', trend: 'up', price: '4925.80' },
      { id: '10', ticker: 'NAS100', trend: 'down', price: '17234.25' },
    ]
  }
]

export function WatchlistView() {
  const [groups, setGroups] = useState<CorrelationGroup[]>(initialGroups)
  const [newTicker, setNewTicker] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<string>('usd')
  const [isAddingGroup, setIsAddingGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')

  const addAsset = () => {
    if (!newTicker.trim()) return
    setGroups(prev => prev.map(group => {
      if (group.id === selectedGroup) {
        return {
          ...group,
          assets: [
            ...group.assets,
            {
              id: Date.now().toString(),
              ticker: newTicker.toUpperCase(),
              trend: Math.random() > 0.5 ? 'up' : 'down',
              price: (Math.random() * 200).toFixed(4)
            }
          ]
        }
      }
      return group
    }))
    setNewTicker('')
  }

  const removeAsset = (groupId: string, assetId: string) => {
    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          assets: group.assets.filter(a => a.id !== assetId)
        }
      }
      return group
    }))
  }

  const addGroup = () => {
    if (!newGroupName.trim()) return
    const colors = ['#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4']
    setGroups(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newGroupName,
        color: colors[Math.floor(Math.random() * colors.length)],
        assets: []
      }
    ])
    setNewGroupName('')
    setIsAddingGroup(false)
  }

  const removeGroup = (groupId: string) => {
    setGroups(prev => prev.filter(g => g.id !== groupId))
    if (selectedGroup === groupId) {
      setSelectedGroup(groups[0]?.id || '')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground">Watchlist</h2>
          <p className="text-muted-foreground">Manage your trading assets and correlation groups</p>
        </div>
        <button
          onClick={() => setIsAddingGroup(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Group
        </button>
      </div>

      {/* Add Asset Bar */}
      <div className="glass rounded-2xl p-4 flex items-center gap-4">
        <input
          type="text"
          value={newTicker}
          onChange={(e) => setNewTicker(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addAsset()}
          placeholder="Enter ticker (e.g., USD/CHF)"
          className="flex-1 bg-transparent border-none text-foreground/80 placeholder-muted-foreground focus:outline-none text-sm"
        />
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="glass px-4 py-2 rounded-xl text-sm text-foreground/80 bg-card border-border focus:border-primary outline-none"
        >
          {groups.map(group => (
            <option key={group.id} value={group.id} className="bg-card text-foreground">
              {group.name}
            </option>
          ))}
        </select>
        <button
          onClick={addAsset}
          disabled={!newTicker.trim()}
          className="px-4 py-2 rounded-xl bg-primary/20 text-primary font-medium hover:bg-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Asset
        </button>
      </div>

      {/* New Group Modal */}
      {isAddingGroup && (
        <div className="glass rounded-2xl p-4 flex items-center gap-4 border border-primary/30">
          <Folder className="w-5 h-5 text-primary" />
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addGroup()}
            placeholder="Enter group name..."
            className="flex-1 bg-transparent border-none text-foreground/80 placeholder-muted-foreground focus:outline-none text-sm"
            autoFocus
          />
          <button
            onClick={addGroup}
            disabled={!newGroupName.trim()}
            className="px-4 py-2 rounded-xl bg-success/20 text-success font-medium hover:bg-success/30 transition-colors disabled:opacity-50"
          >
            Create
          </button>
          <button
            onClick={() => setIsAddingGroup(false)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Correlation Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="glass rounded-2xl overflow-hidden"
            style={{ borderTop: `3px solid ${group.color}` }}
          >
            {/* Group Header */}
            <div className="p-4 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `color-mix(in srgb, ${group.color} 20%, transparent)` }}
                >
                  <Folder className="w-4 h-4" style={{ color: group.color }} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{group.name}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {group.assets.length} assets
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeGroup(group.id)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Assets List */}
            <div className="p-4 space-y-2">
              {group.assets.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No assets in this group
                </p>
              ) : (
                group.assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 dark:bg-white/[0.02] hover:bg-secondary dark:hover:bg-white/[0.04] transition-colors group"
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab" />
                    <div className="flex-1">
                      <span className="font-heading font-medium text-foreground">{asset.ticker}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-foreground/80">{asset.price}</span>
                      {asset.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-success" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                    <button
                      onClick={() => removeAsset(group.id, asset.id)}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info Note */}
      <div className="glass rounded-xl p-4 border border-primary/20">
        <p className="text-sm text-muted-foreground">
          <span className="text-primary font-semibold">Pro Tip:</span> Assets in correlation groups will be clustered together on the Dashboard view for easier monitoring during high-impact news events.
        </p>
      </div>
    </div>
  )
}
