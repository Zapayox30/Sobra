import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { colors } from '../../theme'

export function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.text} />
    </View>
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
})
