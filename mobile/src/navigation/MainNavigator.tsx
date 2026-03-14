import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import type { MainTabParamList } from './types'
import DashboardScreen from '../screens/main/DashboardScreen'
import IncomesScreen from '../screens/main/IncomesScreen'
import ExpensesScreen from '../screens/main/ExpensesScreen'
import CardsScreen from '../screens/main/CardsScreen'
import ProfileScreen from '../screens/main/ProfileScreen'
import { useI18n } from '../lib/i18n'
import { colors, fontSize } from '../theme'
import { View, Text, StyleSheet } from 'react-native'

const Tab = createBottomTabNavigator<MainTabParamList>()

// Simple text-based icons (no external icon library needed)
const tabIcons: Record<string, string> = {
  Dashboard: '🏠',
  Incomes: '💰',
  Expenses: '📊',
  Cards: '💳',
  Profile: '👤',
}

export default function MainNavigator() {
  const { t } = useI18n()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700', fontSize: fontSize.lg },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: 6,
          height: 60,
        },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
            {tabIcons[route.name] || '📌'}
          </Text>
        ),
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: t.dashboard }}
      />
      <Tab.Screen
        name="Incomes"
        component={IncomesScreen}
        options={{ title: t.incomes }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{ title: t.expenses }}
      />
      <Tab.Screen
        name="Cards"
        component={CardsScreen}
        options={{ title: t.cards }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t.profile }}
      />
    </Tab.Navigator>
  )
}
