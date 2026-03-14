import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import {
  useFixedExpenses,
  usePersonalExpenses,
  useCreateFixedExpense,
  useCreatePersonalExpense,
  useDeleteFixedExpense,
  useDeletePersonalExpense,
} from '../../hooks/use-expenses'
import { useDebts, useDeleteDebt, useCreateDebt } from '../../hooks/use-debts'
import { useSavingsGoals, useDeleteSavingsGoal, useCreateSavingsGoal } from '../../hooks/use-savings-goals'
import { useCommitments, useDeleteCommitment, useCreateCommitment } from '../../hooks/use-commitments'
import { useI18n } from '../../lib/i18n'
import {
  Card,
  Button,
  Input,
  ListItem,
  EmptyState,
  LoadingScreen,
  formatMoney,
  SectionHeader,
} from '../../components/ui'
import { colors, spacing, fontSize } from '../../theme'

type Section = 'fixed' | 'personal' | 'debts' | 'savings' | 'commitments'

export default function ExpensesScreen() {
  const { t } = useI18n()
  const { data: fixed = [], isLoading: l1 } = useFixedExpenses()
  const { data: personal = [], isLoading: l2 } = usePersonalExpenses()
  const { data: debts = [], isLoading: l3 } = useDebts()
  const { data: goals = [], isLoading: l4 } = useSavingsGoals()
  const { data: commitments = [], isLoading: l5 } = useCommitments()

  const createFixed = useCreateFixedExpense()
  const createPersonal = useCreatePersonalExpense()
  const createDebt = useCreateDebt()
  const createGoal = useCreateSavingsGoal()
  const createCommitment = useCreateCommitment()
  const deleteFixed = useDeleteFixedExpense()
  const deletePersonal = useDeletePersonalExpense()
  const deleteDebt = useDeleteDebt()
  const deleteGoal = useDeleteSavingsGoal()
  const deleteCommitment = useDeleteCommitment()

  const [showForm, setShowForm] = useState(false)
  const [activeSection, setActiveSection] = useState<Section>('fixed')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')

  if (l1 || l2 || l3 || l4 || l5) return <LoadingScreen />

  const fixedTotal = fixed.filter((e) => e.is_active).reduce((s, e) => s + Number(e.amount), 0)
  const personalTotal = personal.filter((e) => e.is_active).reduce((s, e) => s + Number(e.amount), 0)
  const debtsTotal = debts.filter((d) => d.is_active).reduce((s, d) => s + Number(d.monthly_payment), 0)
  const savingsTotal = goals.filter((g) => g.is_active).reduce((s, g) => s + Number(g.monthly_contribution), 0)
  const commitmentsTotal = commitments.reduce((s, c) => s + Number(c.amount_per_month), 0)
  const grandTotal = fixedTotal + personalTotal + debtsTotal + savingsTotal + commitmentsTotal

  function handleCreate() {
    if (!name || !amount) return
    const val = parseFloat(amount)
    const base = { label: name, starts_on: new Date().toISOString().split('T')[0], ends_on: null, is_active: true }
    const onDone = {
      onSuccess: () => { setShowForm(false); setName(''); setAmount('') },
    }

    switch (activeSection) {
      case 'fixed':
        createFixed.mutate({ ...base, amount: val, category: 'otros' }, onDone)
        break
      case 'personal':
        createPersonal.mutate({ amount: val, category: 'otros', starts_on: base.starts_on, ends_on: null, is_active: true }, onDone)
        break
      case 'debts':
        createDebt.mutate({ label: name, monthly_payment: val, remaining_amount: val * 12, original_amount: val * 12, starts_on: base.starts_on, ends_on: null, is_active: true }, onDone)
        break
      case 'savings':
        createGoal.mutate({
          label: name,
          monthly_contribution: val,
          target_amount: val * 12,
          is_active: true,
        }, onDone)
        break
      case 'commitments':
        createCommitment.mutate({
          label: name,
          amount_per_month: val,
          months_total: 1,
          start_month: new Date().toISOString().split('T')[0],
        }, onDone)
        break
    }
  }

  function handleDelete(section: Section, id: string, itemName: string) {
    Alert.alert(t.confirmDelete, itemName, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.delete,
        style: 'destructive',
        onPress: () => {
          switch (section) {
            case 'fixed': deleteFixed.mutate(id); break
            case 'personal': deletePersonal.mutate(id); break
            case 'debts': deleteDebt.mutate(id); break
            case 'savings': deleteGoal.mutate(id); break
            case 'commitments': deleteCommitment.mutate(id); break
          }
        },
      },
    ])
  }

  function openForm(section: Section) {
    setActiveSection(section)
    setShowForm(true)
  }

  const sectionLabel: Record<Section, string> = {
    fixed: t.fixedExpenses,
    personal: t.personal,
    debts: t.debts,
    savings: t.savings,
    commitments: t.commitments,
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Grand total */}
        <Card>
          <Text style={styles.totalLabel}>{t.total} {t.expenses.toLowerCase()}</Text>
          <Text style={styles.totalValue}>{formatMoney(grandTotal)}</Text>
          <Text style={styles.totalSub}>{t.perMonth}</Text>
        </Card>

        {/* Fixed */}
        <SectionHeader title={t.fixedExpenses} action={`+ ${t.add}`} onAction={() => openForm('fixed')} />
        {fixed.length === 0 ? <EmptyState title={t.noData} description={t.noDataDescription} /> : (
          <Card>
            {fixed.map((e) => (
              <ListItem
                key={e.id}
                title={e.label}
                subtitle={e.category}
                right={formatMoney(Number(e.amount))}
                rightColor={colors.expense}
                onLongPress={() => handleDelete('fixed', e.id, e.label)}
              />
            ))}
          </Card>
        )}

        {/* Personal */}
        <SectionHeader title={t.personal} action={`+ ${t.add}`} onAction={() => openForm('personal')} />
        {personal.length === 0 ? <EmptyState title={t.noData} description={t.noDataDescription} /> : (
          <Card>
            {personal.map((e) => (
              <ListItem
                key={e.id}
                title={e.label ?? e.category}
                subtitle={e.category}
                right={formatMoney(Number(e.amount))}
                rightColor={colors.expense}
                onLongPress={() => handleDelete('personal', e.id, e.label ?? e.category)}
              />
            ))}
          </Card>
        )}

        {/* Debts */}
        <SectionHeader title={t.debts} action={`+ ${t.add}`} onAction={() => openForm('debts')} />
        {debts.length === 0 ? <EmptyState title={t.noData} description={t.noDataDescription} /> : (
          <Card>
            {debts.map((d) => (
              <ListItem
                key={d.id}
                title={d.label}
                subtitle={`${t.remainingAmount}: ${formatMoney(Number(d.remaining_amount))}`}
                right={formatMoney(Number(d.monthly_payment))}
                rightColor={colors.expense}
                onLongPress={() => handleDelete('debts', d.id, d.label)}
              />
            ))}
          </Card>
        )}

        {/* Savings */}
        <SectionHeader title={t.savings} action={`+ ${t.add}`} onAction={() => openForm('savings')} />
        {goals.length === 0 ? <EmptyState title={t.noData} description={t.noDataDescription} /> : (
          <Card>
            {goals.map((g) => (
              <ListItem
                key={g.id}
                title={g.label}
                subtitle={`${Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100)}% ${t.progress}`}
                right={formatMoney(Number(g.monthly_contribution))}
                rightColor={colors.amber}
                onLongPress={() => handleDelete('savings', g.id, g.label)}
              />
            ))}
          </Card>
        )}

        {/* Commitments */}
        <SectionHeader title={t.commitments} action={`+ ${t.add}`} onAction={() => openForm('commitments')} />
        {commitments.length === 0 ? <EmptyState title={t.noData} description={t.noDataDescription} /> : (
          <Card>
            {commitments.map((c) => (
              <ListItem
                key={c.id}
                title={c.label}
                right={formatMoney(Number(c.amount_per_month))}
                rightColor={colors.expense}
                onLongPress={() => handleDelete('commitments', c.id, c.label)}
              />
            ))}
          </Card>
        )}
      </ScrollView>

      {/* Form Modal */}
      <Modal visible={showForm} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.add} {sectionLabel[activeSection].toLowerCase()}</Text>
            <Input label={t.name} value={name} onChangeText={setName} placeholder="Nombre" />
            <Input label={t.amount} value={amount} onChangeText={setAmount} placeholder="0.00" keyboardType="decimal-pad" />
            <View style={styles.modalActions}>
              <Button title={t.cancel} onPress={() => setShowForm(false)} variant="ghost" />
              <Button title={t.save} onPress={handleCreate} disabled={!name || !amount} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: 100 },
  totalLabel: { color: colors.textSecondary, fontSize: fontSize.sm },
  totalValue: { color: colors.expense, fontSize: fontSize['3xl'], fontWeight: '800', fontVariant: ['tabular-nums'] },
  totalSub: { color: colors.textTertiary, fontSize: fontSize.xs },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing['2xl'],
    gap: spacing.lg,
  },
  modalTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md },
})
