'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AccountForm } from '@/components/forms/account-form'
import { WalletForm } from '@/components/forms/wallet-form'
import { useAccounts, useDeleteAccount } from '@/hooks/use-accounts'
import { useWallets, useDeleteWallet } from '@/hooks/use-wallets'
import { useProfile } from '@/hooks/use-user'
import { formatCurrency } from '@/lib/calc'
import {
  Landmark,
  Wallet,
  Plus,
  Trash2,
  Edit,
} from 'lucide-react'
import type { Account, Wallet as WalletType } from '@/types'

export default function AccountsPage() {
  const { data: accounts, isLoading: loadingAccounts } = useAccounts()
  const { data: wallets, isLoading: loadingWallets } = useWallets()
  const { data: profile } = useProfile()
  const deleteAccount = useDeleteAccount()
  const deleteWallet = useDeleteWallet()

  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false)
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | undefined>()
  const [editingWallet, setEditingWallet] = useState<WalletType | undefined>()

  const currency = profile?.currency || 'PEN'

  const totalAccounts = accounts
    ?.filter((a) => a.is_active)
    .reduce((sum, a) => sum + Number(a.current_balance), 0) ?? 0

  const totalWallets = wallets
    ?.filter((w) => w.is_active)
    .reduce((sum, w) => sum + Number(w.current_balance), 0) ?? 0

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account)
    setIsAccountDialogOpen(true)
  }

  const handleEditWallet = (wallet: WalletType) => {
    setEditingWallet(wallet)
    setIsWalletDialogOpen(true)
  }

  if (loadingAccounts || loadingWallets) return <LoadingSpinner />

  const walletTypeLabel: Record<string, string> = {
    yape: '📱 Yape',
    plin: '📲 Plin',
    cash: '💵 Efectivo',
    other: '📦 Otro',
  }

  const accountTypeLabel: Record<string, string> = {
    bank: '🏦 Banco',
    savings: '💰 Ahorro',
    investment: '📈 Inversión',
    other: '📦 Otro',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Cuentas y Billeteras</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gestiona tu dinero en bancos, efectivo y billeteras digitales
          </p>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cuentas bancarias</CardTitle>
            <Landmark className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{formatCurrency(totalAccounts, currency)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {accounts?.filter((a) => a.is_active).length ?? 0} cuentas activas
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Billeteras</CardTitle>
            <Wallet className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{formatCurrency(totalWallets, currency)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {wallets?.filter((w) => w.is_active).length ?? 0} billeteras activas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="accounts">
        <TabsList>
          <TabsTrigger value="accounts">🏦 Cuentas</TabsTrigger>
          <TabsTrigger value="wallets">📱 Billeteras</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => {
                setEditingAccount(undefined)
                setIsAccountDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva cuenta
            </Button>
          </div>

          {!accounts || accounts.length === 0 ? (
            <EmptyState
              icon={Landmark}
              title="Sin cuentas bancarias"
              description="Agrega tus cuentas para llevar un control de tus saldos"
              action={{
                label: 'Agregar cuenta',
                onClick: () => {
                  setEditingAccount(undefined)
                  setIsAccountDialogOpen(true)
                },
              }}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {accounts.map((account) => (
                <Card key={account.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
                    <Landmark className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(Number(account.current_balance), account.currency ?? currency)}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{accountTypeLabel[account.account_type ?? 'bank']}</span>
                      {account.institution && (
                        <>
                          <span>•</span>
                          <span>{account.institution}</span>
                        </>
                      )}
                      {!account.is_active && (
                        <>
                          <span>•</span>
                          <span className="text-red-600">Inactiva</span>
                        </>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditAccount(account)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('¿Eliminar esta cuenta?')) deleteAccount.mutate(account.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="wallets" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => {
                setEditingWallet(undefined)
                setIsWalletDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva billetera
            </Button>
          </div>

          {!wallets || wallets.length === 0 ? (
            <EmptyState
              icon={Wallet}
              title="Sin billeteras"
              description="Agrega tus billeteras digitales y efectivo"
              action={{
                label: 'Agregar billetera',
                onClick: () => {
                  setEditingWallet(undefined)
                  setIsWalletDialogOpen(true)
                },
              }}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {wallets.map((wallet) => (
                <Card key={wallet.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{wallet.name}</CardTitle>
                    <Wallet className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(Number(wallet.current_balance), wallet.currency ?? currency)}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{walletTypeLabel[wallet.wallet_type ?? 'cash']}</span>
                      {!wallet.is_active && (
                        <>
                          <span>•</span>
                          <span className="text-red-600">Inactiva</span>
                        </>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditWallet(wallet)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('¿Eliminar esta billetera?')) deleteWallet.mutate(wallet.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAccount ? 'Editar cuenta' : 'Nueva cuenta'}</DialogTitle>
          </DialogHeader>
          <AccountForm
            account={editingAccount}
            onSuccess={() => {
              setIsAccountDialogOpen(false)
              setEditingAccount(undefined)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingWallet ? 'Editar billetera' : 'Nueva billetera'}</DialogTitle>
          </DialogHeader>
          <WalletForm
            wallet={editingWallet}
            onSuccess={() => {
              setIsWalletDialogOpen(false)
              setEditingWallet(undefined)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
