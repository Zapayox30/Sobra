import React from 'react'
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native'
import { useSurplus, useSurplusHistory, useSaveSurplus } from '../../hooks/use-surplus'
import { useProfile } from '../../hooks/use-auth'
import { useI18n } from '../../lib/i18n'
import { Card, MetricRow, Button, LoadingScreen, formatMoney, SectionHeader, Badge } from '../../components/ui'
import { colors, spacing, fontSize, borderRadius } from '../../theme'

export default function DashboardScreen() {
  const { t } = useI18n()
  const { surplus, isLoading, cardDueTotal, overdue } = useSurplus()
  const { data: profile } = useProfile()
  const { data: history = [] } = useSurplusHistory()
  const saveSurplus = useSaveSurplus()
  const [refreshing, setRefreshing] = React.useState(false)

  if (isLoading) return <LoadingScreen />

  const s = surplus!
  const monthName = new Date().toLocaleString('es-PE', { month: 'long', year: 'numeric' })
  const isPositive = s.netSurplus >= 0

  function handleSave() {
    const month = new Date().toISOString().slice(0, 7)
    saveSurplus.mutate({ surplus: s, month })
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting */}
      <Text style={styles.greeting}>
        {t.greeting}{profile?.full_name ? `, ${profile.full_name}` : ''} 👋
      </Text>
      <Text style={styles.monthLabel}>{monthName}</Text>

      {/* Hero Card — Net Surplus */}
      <Card style={styles.heroCard}>
        <Text style={styles.heroLabel}>{t.netSurplus}</Text>
        <Text style={[styles.heroValue, { color: isPositive ? colors.emerald : colors.red }]}>
          {formatMoney(s.netSurplus)}
        </Text>

        <View style={styles.heroRow}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatLabel}>{t.dailySuggestion}</Text>
            <Text style={styles.heroStatValue}>{formatMoney(s.dailySuggestion)}</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatLabel}>{t.remainingDays}</Text>
            <Text style={styles.heroStatValue}>{s.remainingDays} días</Text>
          </View>
        </View>
      </Card>

      {/* Classification */}
      <Card>
        <Text style={styles.cardTitle}>{t.classification}</Text>
        <View style={styles.classRow}>
          <ClassBadge label={t.safe} value={s.classification.safe} color={colors.surplusSafe} />
          <ClassBadge label={t.operative} value={s.classification.operative} color={colors.surplusOperative} />
          <ClassBadge label={t.unavailable} value={s.classification.unavailable} color={colors.surplusUnavailable} />
        </View>

        {/* Progress bar */}
        {s.netSurplus > 0 && (
          <View style={styles.progressBar}>
            <View style={[styles.progressSegment, { flex: 50, backgroundColor: colors.surplusSafe }]} />
            <View style={[styles.progressSegment, { flex: 30, backgroundColor: colors.surplusOperative }]} />
            <View style={[styles.progressSegment, { flex: 20, backgroundColor: colors.surplusUnavailable }]} />
          </View>
        )}
      </Card>

      {/* Breakdown */}
      <Card>
        <Text style={styles.cardTitle}>{t.breakdown}</Text>
        <MetricRow label={t.income} value={formatMoney(s.incomeTotal)} color={colors.income} sign="+" />
        <MetricRow label={t.fixedExpenses} value={formatMoney(s.fixedTotal)} sign="-" />
        <MetricRow label={t.debts} value={formatMoney(s.debtsTotal)} sign="-" />
        <MetricRow label={t.savings} value={formatMoney(s.savingsCommitted)} sign="-" />
        <MetricRow label={t.commitments} value={formatMoney(s.commitmentsTotal)} sign="-" />
        <MetricRow label={t.creditCards} value={formatMoney(s.cardDueTotal)} sign="-" />
        <MetricRow label={t.personal} value={formatMoney(s.personalTotal)} sign="-" />

        <View style={styles.divider} />
        <MetricRow
          label={t.grossSurplus}
          value={formatMoney(s.grossSurplus)}
          color={s.grossSurplus >= 0 ? colors.emerald : colors.red}
        />
        <MetricRow
          label={t.netSurplus}
          value={formatMoney(s.netSurplus)}
          color={isPositive ? colors.emerald : colors.red}
        />
      </Card>

      {/* Consolidated Balance */}
      <Card>
        <MetricRow label={t.consolidatedBalance} value={formatMoney(s.consolidatedBalance)} color={colors.blue} />
      </Card>

      {/* Save surplus */}
      <Button
        title={t.saveSurplus}
        onPress={handleSave}
        variant="secondary"
        loading={saveSurplus.isPending}
      />
    </ScrollView>
  )
}

function ClassBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.classBadge}>
      <View style={[styles.classDot, { backgroundColor: color }]} />
      <View>
        <Text style={styles.classLabel}>{label}</Text>
        <Text style={[styles.classValue, { color }]}>{formatMoney(value)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing['4xl'] },

  greeting: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700' },
  monthLabel: { color: colors.textTertiary, fontSize: fontSize.sm, textTransform: 'capitalize', marginTop: -spacing.sm },

  heroCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  heroLabel: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '500' },
  heroValue: { fontSize: fontSize['4xl'], fontWeight: '800', fontVariant: ['tabular-nums'], marginVertical: spacing.sm },
  heroRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatLabel: { color: colors.textTertiary, fontSize: fontSize.xs },
  heroStatValue: { color: colors.text, fontSize: fontSize.base, fontWeight: '600', marginTop: 2 },
  heroDivider: { width: 1, height: 32, backgroundColor: colors.border },

  cardTitle: { color: colors.text, fontSize: fontSize.base, fontWeight: '600', marginBottom: spacing.md },

  classRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  classBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  classDot: { width: 8, height: 8, borderRadius: 4 },
  classLabel: { color: colors.textTertiary, fontSize: fontSize.xs },
  classValue: { fontSize: fontSize.sm, fontWeight: '600', fontVariant: ['tabular-nums'] },

  progressBar: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: spacing.md,
    gap: 2,
  },
  progressSegment: { borderRadius: 3 },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
    borderStyle: 'dashed',
  },
})
