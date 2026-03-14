import React from 'react'
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native'
import { useProfile, useUser } from '../../hooks/use-auth'
import { useAccounts, useWallets } from '../../hooks/use-accounts'
import { useSurplusHistory } from '../../hooks/use-surplus'
import { useI18n } from '../../lib/i18n'
import { supabase } from '../../lib/supabase'
import { Card, Button, ListItem, LoadingScreen, formatMoney, SectionHeader } from '../../components/ui'
import { colors, spacing, fontSize, borderRadius } from '../../theme'
import Constants from 'expo-constants'

export default function ProfileScreen() {
  const { t } = useI18n()
  const { data: user } = useUser()
  const { data: profile, isLoading } = useProfile()
  const { data: accounts = [] } = useAccounts()
  const { data: wallets = [] } = useWallets()
  const { data: history = [] } = useSurplusHistory(3)

  if (isLoading) return <LoadingScreen />

  function handleLogout() {
    Alert.alert(t.logout, '', [
      { text: t.cancel, style: 'cancel' },
      { text: t.logout, style: 'destructive', onPress: () => supabase.auth.signOut() },
    ])
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar + name */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(profile?.full_name || user?.email || '?')[0].toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{profile?.full_name || t.profile}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Accounts */}
      {accounts.length > 0 && (
        <>
          <SectionHeader title={t.accounts} />
          <Card>
            {accounts.map((a) => (
              <ListItem
                key={a.id}
                title={a.name}
                subtitle={a.institution ?? a.account_type}
                right={formatMoney(Number(a.current_balance))}
                rightColor={colors.blue}
              />
            ))}
          </Card>
        </>
      )}

      {/* Wallets */}
      {wallets.length > 0 && (
        <>
          <SectionHeader title={t.wallets} />
          <Card>
            {wallets.map((w) => (
              <ListItem
                key={w.id}
                title={w.name}
                subtitle={w.wallet_type}
                right={formatMoney(Number(w.current_balance))}
                rightColor={colors.cyan}
              />
            ))}
          </Card>
        </>
      )}

      {/* Recent surplus history */}
      {history.length > 0 && (
        <>
          <SectionHeader title="Historial reciente" />
          <Card>
            {history.map((h) => (
              <ListItem
                key={h.id}
                title={h.month}
                right={formatMoney(Number(h.net_surplus))}
                rightColor={Number(h.net_surplus) >= 0 ? colors.emerald : colors.red}
              />
            ))}
          </Card>
        </>
      )}

      {/* Settings */}
      <Card>
        <ListItem title={t.currency} right={profile?.currency || 'PEN'} />
        <ListItem title={t.language} right="Español" />
        <ListItem title={t.version} right={Constants.expoConfig?.version || '1.0.0'} />
      </Card>

      {/* Logout */}
      <Button title={t.logout} onPress={handleLogout} variant="danger" />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing['4xl'] },
  header: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.violet,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: colors.text, fontSize: fontSize['2xl'], fontWeight: '700' },
  name: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700' },
  email: { color: colors.textTertiary, fontSize: fontSize.sm },
})
