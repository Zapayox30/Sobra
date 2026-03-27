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
import { View, StyleSheet } from 'react-native'
import { Home, ArrowRightLeft, PieChart, CreditCard, User } from 'lucide-react-native'

const Tab = createBottomTabNavigator<MainTabParamList>()

// Professional icon mapping
const getTabIcon = (routeName: string, focused: boolean, color: string) => {
  const size = 24
  const opacity = focused ? 1 : 0.6
  
  switch (routeName) {
    case 'Dashboard': return <Home size={size} color={color} style={{ opacity }} />
    case 'Incomes': return <ArrowRightLeft size={size} color={color} style={{ opacity }} />
    case 'Expenses': return <PieChart size={size} color={color} style={{ opacity }} />
    case 'Cards': return <CreditCard size={size} color={color} style={{ opacity }} />
    case 'Profile': return <User size={size} color={color} style={{ opacity }} />
    default: return <Home size={size} color={color} style={{ opacity }} />
  }
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
        tabBarIcon: ({ focused, color }) => getTabIcon(route.name, focused, color),
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
