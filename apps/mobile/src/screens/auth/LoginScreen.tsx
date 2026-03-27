import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { supabase } from '../../lib/supabase'
import { useI18n } from '../../lib/i18n'
import { Button, Input } from '../../components/ui'
import { colors, spacing, fontSize, borderRadius } from '../../theme'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { AuthStackParamList } from '../../navigation/types'

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>

export default function LoginScreen({ navigation }: Props) {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email || !password) return
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) Alert.alert('Error', error.message)
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>
              SO<Text style={styles.logoDollar}>$</Text>
            </Text>
          </View>
          <Text style={styles.brandName}>SOBRA</Text>
        </View>

        <Text style={styles.title}>{t.login}</Text>

        <View style={styles.form}>
          <Input
            label={t.email}
            value={email}
            onChangeText={setEmail}
            placeholder="tu@email.com"
            keyboardType="email-address"
          />

          <Input
            label={t.password}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          <Button
            title={t.login}
            onPress={handleLogin}
            loading={loading}
            disabled={!email || !password}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t.noAccount}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}> {t.register}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing['2xl'],
    gap: spacing['3xl'],
  },
  logoContainer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  logoBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.violet,
  },
  logoText: {
    color: colors.text,
    fontSize: fontSize['2xl'],
    fontWeight: '800',
    letterSpacing: -1,
  },
  logoDollar: {
    color: '#c4b5fd',
    fontSize: fontSize['3xl'],
  },
  brandName: {
    color: colors.text,
    fontSize: fontSize['2xl'],
    fontWeight: '800',
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  form: { gap: spacing.lg },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: { color: colors.textTertiary, fontSize: fontSize.sm },
  footerLink: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600' },
})
