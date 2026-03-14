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
import { useCreditCards, useCreateCreditCard, useDeleteCreditCard, useCardDues } from '../../hooks/use-credit-cards'
import { useI18n } from '../../lib/i18n'
import { Card, Button, Input, ListItem, EmptyState, LoadingScreen, formatMoney, SectionHeader, Badge } from '../../components/ui'
import { colors, spacing, fontSize } from '../../theme'

export default function CardsScreen() {
  const { t } = useI18n()
  const { data: cards = [], isLoading } = useCreditCards()
  const { cardDueTotal, cardMinimumDue, overdue } = useCardDues()
  const createCard = useCreateCreditCard()
  const deleteCard = useDeleteCreditCard()

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [bankName, setBankName] = useState('')
  const [limit, setLimit] = useState('')

  if (isLoading) return <LoadingScreen />

  function handleCreate() {
    if (!name || !bankName) return
    createCard.mutate(
      {
        name,
        issuer: bankName,
        credit_limit: parseFloat(limit) || null,
        cutoff_day: 15,
        due_day: 5,
        is_active: true,
      },
      {
        onSuccess: () => { setShowForm(false); setName(''); setBankName(''); setLimit('') },
      }
    )
  }

  function handleDelete(id: string, cardName: string) {
    Alert.alert(t.confirmDelete, cardName, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: () => deleteCard.mutate(id) },
    ])
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <Card>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>{t.totalDue}</Text>
              <Text style={[styles.summaryValue, overdue && { color: colors.red }]}>
                {formatMoney(cardDueTotal)}
              </Text>
            </View>
            <View>
              <Text style={styles.summaryLabel}>{t.minimumDue}</Text>
              <Text style={styles.summaryValueSm}>{formatMoney(cardMinimumDue)}</Text>
            </View>
          </View>
          {overdue && <Badge label="⚠️ Pago vencido" color={colors.red} />}
        </Card>

        {/* Cards list */}
        <SectionHeader title={t.creditCards} />

        {cards.length === 0 ? (
          <EmptyState title={t.noData} description={t.noDataDescription} />
        ) : (
          <Card>
            {cards.map((card) => (
              <ListItem
                key={card.id}
                title={card.name}
                subtitle={`${card.issuer ?? ''} • ${t.creditLimit}: ${formatMoney(Number(card.credit_limit ?? 0))}`}
                right={card.is_active ? t.active : t.inactive}
                rightColor={card.is_active ? colors.emerald : colors.textMuted}
                onLongPress={() => handleDelete(card.id, card.name)}
              />
            ))}
          </Card>
        )}
      </ScrollView>

      <View style={styles.fab}>
        <Button title={`+ ${t.add}`} onPress={() => setShowForm(true)} />
      </View>

      <Modal visible={showForm} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.add} tarjeta</Text>
            <Input label={t.name} value={name} onChangeText={setName} placeholder="Visa Gold" />
            <Input label={t.bankName} value={bankName} onChangeText={setBankName} placeholder="BCP" />
            <Input label={t.creditLimit} value={limit} onChangeText={setLimit} placeholder="5000" keyboardType="decimal-pad" />
            <View style={styles.modalActions}>
              <Button title={t.cancel} onPress={() => setShowForm(false)} variant="ghost" />
              <Button title={t.save} onPress={handleCreate} loading={createCard.isPending} disabled={!name || !bankName} />
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
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  summaryLabel: { color: colors.textSecondary, fontSize: fontSize.sm },
  summaryValue: { color: colors.text, fontSize: fontSize['2xl'], fontWeight: '800', fontVariant: ['tabular-nums'] },
  summaryValueSm: { color: colors.textSecondary, fontSize: fontSize.lg, fontWeight: '600', fontVariant: ['tabular-nums'] },
  fab: { position: 'absolute', bottom: spacing['2xl'], left: spacing.lg, right: spacing.lg },
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
