/**
 * Debts CRUD hooks — powered by createCrudHooks factory
 */
import { createCrudHooks } from './create-crud-hooks'

const debtHooks = createCrudHooks('debts', ['surplus'])

export const useDebts = debtHooks.useList
export const useCreateDebt = debtHooks.useCreate
export const useUpdateDebt = debtHooks.useUpdate
export const useDeleteDebt = debtHooks.useDelete
