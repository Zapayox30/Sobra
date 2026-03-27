import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Keyboard,
  ActivityIndicator
} from 'react-native'
import { colors, spacing, fontSize, borderRadius } from '../../theme'

interface Category {
  id: string
  label: string
  icon: string
  color: string
}

export const QUICK_CATEGORIES: Category[] = [
  { id: 'comida', label: 'Comida', icon: '🍔', color: colors.amber },
  { id: 'transporte', label: 'Transporte', icon: '🚕', color: colors.blue },
  { id: 'supermercado', label: 'Supermercado', icon: '🛒', color: colors.emerald },
  { id: 'ocio', label: 'Ocio', icon: '☕', color: colors.purple },
  { id: 'salud', label: 'Salud', icon: '💊', color: colors.cyan },
  { id: 'otros', label: 'Otros', icon: '📦', color: colors.textTertiary },
]

interface QuickAddModalProps {
  visible: boolean
  onClose: () => void
  onSave: (amount: number, categoryId: string, label: string) => void
  isSubmitting?: boolean
}

export function QuickAddModal({ visible, onClose, onSave, isSubmitting }: QuickAddModalProps) {
  const [amount, setAmount] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category>(QUICK_CATEGORIES[0])
  
  const inputRef = useRef<TextInput>(null)

  // Auto-focus when modal opens
  useEffect(() => {
    if (visible) {
      setAmount('')
      setSelectedCategory(QUICK_CATEGORIES[0])
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      Keyboard.dismiss()
    }
  }, [visible])

  const handleSave = () => {
    const num = parseFloat(amount.replace(',', '.'))
    if (!isNaN(num) && num > 0) {
      onSave(num, selectedCategory.id, `${selectedCategory.icon} ${selectedCategory.label}`)
    }
  }

  const isValid = parseFloat(amount.replace(',', '.')) > 0

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Añadir Gasto</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input (Massive) */}
          <View style={styles.amountContainer}>
            <Text style={styles.currency}>S/</Text>
            <TextInput
              ref={inputRef}
              style={styles.amountInput}
              value={amount}
              onChangeText={(text) => setAmount(text.replace(/[^0-9.,]/g, ''))}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              maxLength={8}
            />
          </View>

          {/* Category Picker (Pills) */}
          <View style={styles.categoriesContainer}>
            <Text style={styles.sectionTitle}>¿En qué se te fue?</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillsScroll}
            >
              {QUICK_CATEGORIES.map(cat => {
                const isSelected = selectedCategory.id === cat.id
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat)}
                    activeOpacity={0.7}
                    style={[
                      styles.pill,
                      isSelected && { backgroundColor: cat.color + '20', borderColor: cat.color }
                    ]}
                  >
                    <Text style={styles.pillIcon}>{cat.icon}</Text>
                    <Text style={[
                      styles.pillLabel,
                      isSelected && { color: cat.color, fontWeight: '600' }
                    ]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.saveBtn,
              (!isValid || isSubmitting) && styles.saveBtnDisabled
            ]}
            onPress={handleSave}
            disabled={!isValid || isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={styles.saveBtnText}>Guardar S/ {amount || '0.00'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    paddingBottom: spacing['4xl'], // Para el home indicator
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  closeBtn: {
    padding: spacing.xs,
  },
  closeText: {
    color: colors.textSecondary,
    fontSize: fontSize.base,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
    gap: spacing.sm,
  },
  currency: {
    fontSize: fontSize['3xl'],
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 8,
  },
  amountInput: {
    fontSize: 54, // Massive text
    fontWeight: '800',
    color: colors.text,
    minWidth: 120,
    textAlign: 'center',
  },
  categoriesContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  pillsScroll: {
    gap: spacing.sm,
    paddingRight: spacing.xl,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 6,
  },
  pillIcon: {
    fontSize: fontSize.base,
  },
  pillLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: colors.primaryForeground,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
})
