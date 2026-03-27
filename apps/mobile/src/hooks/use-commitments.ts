/**
 * Monthly Commitments CRUD hooks — powered by createCrudHooks factory
 */
import { createCrudHooks } from './create-crud-hooks'

const commitmentHooks = createCrudHooks('monthly_commitments', ['surplus'])

export const useCommitments = commitmentHooks.useList
export const useCreateCommitment = commitmentHooks.useCreate
export const useUpdateCommitment = commitmentHooks.useUpdate
export const useDeleteCommitment = commitmentHooks.useDelete
