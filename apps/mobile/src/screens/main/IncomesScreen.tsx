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
import { useIncomes, useCreateIncome, useDeleteIncome } from '../../hooks/use-incomes'
import { useI18n } from '../../lib/i18n'
import { Card, Button, Input, ListItem, EmptyState, LoadingScreen, formatMoney, SectionHeader } from '../../components/ui'
import { colors, spacing, fontSize } from '../../theme'

export default function IncomesScreen() {
  const { t } = useI18n()
  const { data: incomes = [], isLoading } = useIncomes()
  const createIncome = useCreateIncome()
  const deleteIncome = useDeleteIncome()

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')

  if (isLoading) return <LoadingScreen />

  const total = incomes
    .filter((i) => i.is_active)
    .reduce((sum, i) => sum + Number(i.amount), 0)

  function handleCreate() {
    if (!name || !amount) return
    createIncome.mutate(
      {
        label: name,
        amount: parseFloat(amount),
        kind: 'salary',
        recurrence: 'monthly',
        starts_on: new Date().toISOString().split('T')[0],
        ends_on: null,
        is_active: true,
      },
      {
        onSuccess: () => {
          setShowForm(false)
          setName('')
          setAmount('')
        },
      }
    )
  }

  function handleDelete(id: string, itemName: string) {
    Alert.alert(t.confirmDelete, itemName, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: () => deleteIncome.mutate(id) },
    ])
  }

  const kindLabel = (kind: string) => {
    const map: Record<string, string> = {
      salary: t.salary,
      extra: t.extra,
      freelance: t.freelance,
      passive: t.passive,
      other: t.other,
    }
    return map[kind] || kind
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Total */}
        <Card>
          <Text style={styles.totalLabel}>{t.total}</Text>
          <Text style={styles.totalValue}>{formatMoney(total)}</Text>
          <Text style={styles.totalSub}>{t.perMonth}</Text>
        </Card>

        {/* List */}
        <SectionHeader title={t.incomes} />

        {incomes.length === 0 ? (
          <EmptyState title={t.noData} description={t.noDataDescription} />
        ) : (
          <Card>
            {incomes.map((income) => (
              <ListItem
                key={income.id}
                title={income.label}
                subtitle={kindLabel(income.kind)}
                right={formatMoney(Number(income.amount))}
                rightColor={colors.income}
                onLongPress={() => handleDelete(income.id, income.label)}
              />
            ))}
          </Card>
        )}
      </ScrollView>

      {/* FAB */}
      <View style={styles.fab}>
        <Button title={`+ ${t.add}`} onPress={() => setShowForm(true)} />
      </View>

      {/* Form Modal */}
      <Modal visible={showForm} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.add} {t.income.toLowerCase()}</Text>

            <Input label={t.name} value={name} onChangeText={setName} placeholder="Ej. Salario" />
            <Input
              label={t.amount}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />

            <View style={styles.modalActions}>
              <Button title={t.cancel} onPress={() => setShowForm(false)} variant="ghost" />
              <Button
                title={t.save}
                onPress={handleCreate}
                loading={createIncome.isPending}
                disabled={!name || !amount}
              />
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
  totalValue: { color: colors.income, fontSize: fontSize['3xl'], fontWeight: '800', fontVariant: ['tabular-nums'] },
  totalSub: { color: colors.textTertiary, fontSize: fontSize.xs },
  fab: { position: 'absolute', bottom: spacing['2xl'], left: spacing.lg, right: spacing.lg },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
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
