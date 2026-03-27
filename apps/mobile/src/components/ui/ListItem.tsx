import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, spacing, fontSize } from '../../theme'

export function ListItem({
  title,
  subtitle,
  right,
  rightColor,
  onPress,
  onLongPress,
}: {
  title: string
  subtitle?: string
  right?: string
  rightColor?: string
  onPress?: () => void
  onLongPress?: () => void
}) {
  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.6}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.listItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.listItemSubtitle}>{subtitle}</Text>}
      </View>
      {right && (
        <Text style={[styles.listItemRight, rightColor ? { color: rightColor } : null]}>
          {right}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listItemTitle: { color: colors.text, fontSize: fontSize.base, fontWeight: '500' },
  listItemSubtitle: { color: colors.textTertiary, fontSize: fontSize.sm, marginTop: 2 },
  listItemRight: { color: colors.text, fontSize: fontSize.base, fontWeight: '600', fontVariant: ['tabular-nums'] },
})
