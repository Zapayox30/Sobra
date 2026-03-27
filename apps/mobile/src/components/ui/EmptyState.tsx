import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing, fontSize } from '../../theme'

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    gap: spacing.sm,
  },
  emptyTitle: { color: colors.textSecondary, fontSize: fontSize.base, fontWeight: '600' },
  emptyDescription: { color: colors.textMuted, fontSize: fontSize.sm, textAlign: 'center' },
})
