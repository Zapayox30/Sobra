/**
 * Expenses CRUD hooks — powered by createCrudHooks factory
 */
import { createCrudHooks } from './create-crud-hooks'

// ── Fixed Expenses ──
const fixedHooks = createCrudHooks('fixed_expenses', ['surplus'])

export const useFixedExpenses = fixedHooks.useList
export const useCreateFixedExpense = fixedHooks.useCreate
export const useUpdateFixedExpense = fixedHooks.useUpdate
export const useDeleteFixedExpense = fixedHooks.useDelete

// ── Personal Expenses ──
const personalHooks = createCrudHooks('personal_expenses', ['surplus'])

export const usePersonalExpenses = personalHooks.useList
export const useCreatePersonalExpense = personalHooks.useCreate
export const useUpdatePersonalExpense = personalHooks.useUpdate
export const useDeletePersonalExpense = personalHooks.useDelete
