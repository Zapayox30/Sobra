import React from 'react'
import { View, Text, TextInput, StyleSheet, type ViewStyle } from 'react-native'
import { colors, borderRadius, spacing, fontSize } from '../../theme'

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

const styles = StyleSheet.create({
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
})
