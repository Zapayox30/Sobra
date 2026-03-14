/**
 * Shared UI components for SOBRA mobile
 */
import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native'
import { colors, spacing, fontSize, borderRadius } from '../theme'

// ── Card ──
export function Card({
  children,
  style,
}: {
  children: React.ReactNode
  style?: ViewStyle
}) {
  return <View style={[styles.card, style]}>{children}</View>
}

// ── Button ──
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
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

// ── Input ──
export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  error,
  style,
}: {
  label?: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'decimal-pad'
  secureTextEntry?: boolean
  error?: string
  style?: ViewStyle
}) {
  return (
    <View style={[{ gap: spacing.xs }, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={[styles.input, error && styles.inputError]}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

// ── Metric Row ──
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

// ── Section Header ──
export function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string
  action?: string
  onAction?: () => void
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && onAction && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

// ── Empty State ──
export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
    </View>
  )
}

// ── Loading ──
export function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.text} />
    </View>
  )
}

// ── Badge ──
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

// ── List Item (swipeable row for CRUD lists) ──
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

// ── Format money ──
export function formatMoney(amount: number, currency = 'S/'): string {
  const abs = Math.abs(amount)
  const formatted = abs.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `${currency} ${formatted}`
}

// ── Styles ──
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
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

  label: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '500' },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    color: colors.text,
    fontSize: fontSize.base,
  },
  inputError: { borderColor: colors.red },
  errorText: { color: colors.red, fontSize: fontSize.xs },

  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  metricLabel: { color: colors.textSecondary, fontSize: fontSize.sm },
  metricValue: { color: colors.text, fontSize: fontSize.sm, fontWeight: '500', fontVariant: ['tabular-nums'] },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  sectionAction: { color: colors.textSecondary, fontSize: fontSize.sm },

  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    gap: spacing.sm,
  },
  emptyTitle: { color: colors.textSecondary, fontSize: fontSize.base, fontWeight: '600' },
  emptyDescription: { color: colors.textMuted, fontSize: fontSize.sm, textAlign: 'center' },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: fontSize.xs, fontWeight: '600' },

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
