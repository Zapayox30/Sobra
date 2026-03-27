/**
 * Accounts & Wallets hooks — powered by createCrudHooks factory
 */
import { createCrudHooks } from './create-crud-hooks'

// ── Accounts (bank, savings, investment) ──
const accountHooks = createCrudHooks('accounts', ['surplus'])

export const useAccounts = accountHooks.useList
export const useCreateAccount = accountHooks.useCreate
export const useUpdateAccount = accountHooks.useUpdate
export const useDeleteAccount = accountHooks.useDelete

// ── Wallets (Yape, Plin, cash) ──
const walletHooks = createCrudHooks('wallets', ['surplus'])

export const useWallets = walletHooks.useList
export const useCreateWallet = walletHooks.useCreate
export const useUpdateWallet = walletHooks.useUpdate
export const useDeleteWallet = walletHooks.useDelete
