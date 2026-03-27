/**
 * Incomes CRUD hooks — powered by createCrudHooks factory
 */
import { createCrudHooks } from './create-crud-hooks'

const incomeHooks = createCrudHooks('incomes', ['surplus'])

export const useIncomes = incomeHooks.useList
export const useCreateIncome = incomeHooks.useCreate
export const useUpdateIncome = incomeHooks.useUpdate
export const useDeleteIncome = incomeHooks.useDelete
