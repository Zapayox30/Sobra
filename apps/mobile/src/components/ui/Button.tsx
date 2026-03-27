import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, type ViewStyle, type TextStyle } from 'react-native'
import { colors, borderRadius, spacing, fontSize } from '../../theme'

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
}: {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
}) {
  const btnStyle = [
    styles.button,
    variant === 'primary' && styles.btnPrimary,
    variant === 'secondary' && styles.btnSecondary,
    variant === 'ghost' && styles.btnGhost,
    variant === 'danger' && styles.btnDanger,
    size === 'sm' && styles.btnSm,
    size === 'lg' && styles.btnLg,
    disabled && styles.btnDisabled,
    style,
  ]

  const textStyle = [
    styles.buttonText,
    variant === 'primary' && styles.btnPrimaryText,
    variant === 'secondary' && styles.btnSecondaryText,
    variant === 'ghost' && styles.btnGhostText,
    variant === 'danger' && styles.btnDangerText,
    size === 'sm' && { fontSize: fontSize.sm },
  ]

  return (
    <TouchableOpacity style={btnStyle} onPress={onPress} disabled={disabled || loading} activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? colors.primaryForeground : colors.text} />
      ) : (
        <Text style={textStyle as any}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  btnPrimary: { backgroundColor: colors.primary },
  btnSecondary: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  btnGhost: { backgroundColor: 'transparent' },
  btnDanger: { backgroundColor: colors.redDark },
  btnSm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  btnLg: { paddingVertical: spacing.lg, paddingHorizontal: spacing['2xl'] },
  btnDisabled: { opacity: 0.5 },
  buttonText: { fontWeight: '600', fontSize: fontSize.base },
  btnPrimaryText: { color: colors.primaryForeground },
  btnSecondaryText: { color: colors.text },
  btnGhostText: { color: colors.textSecondary },
  btnDangerText: { color: colors.text },
})
