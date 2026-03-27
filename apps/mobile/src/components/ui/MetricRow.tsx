import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing, fontSize } from '../../theme'

export function MetricRow({
  label,
  value,
  color,
  sign,
}: {
  label: string
  value: string
  color?: string
  sign?: '+' | '-'
}) {
  return (
    <View style={styles.metricRow}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, color ? { color } : null]}>
        {sign ? `${sign} ` : ''}
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  metricLabel: { color: colors.textSecondary, fontSize: fontSize.sm },
  metricValue: { color: colors.text, fontSize: fontSize.sm, fontWeight: '500', fontVariant: ['tabular-nums'] },
})
