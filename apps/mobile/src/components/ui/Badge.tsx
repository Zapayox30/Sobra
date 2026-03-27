import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, borderRadius, spacing, fontSize } from '../../theme'

export function Badge({
  label,
  color = colors.emerald,
}: {
  label: string
  color?: string
}) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '20', borderColor: color + '40' }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: fontSize.xs, fontWeight: '600' },
})
