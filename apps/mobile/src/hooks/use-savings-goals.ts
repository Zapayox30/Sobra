/**
 * Savings Goals CRUD hooks — powered by createCrudHooks factory
 */
import { createCrudHooks } from './create-crud-hooks'

const savingsHooks = createCrudHooks('savings_goals', ['surplus'])

export const useSavingsGoals = savingsHooks.useList
export const useCreateSavingsGoal = savingsHooks.useCreate
export const useUpdateSavingsGoal = savingsHooks.useUpdate
export const useDeleteSavingsGoal = savingsHooks.useDelete
