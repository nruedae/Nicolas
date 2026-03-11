import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'expo-status-bar'
import { Text } from 'react-native'

import ScanScreen from './src/screens/ScanScreen'
import MyCardScreen from './src/screens/MyCardScreen'
import ContactsScreen from './src/screens/ContactsScreen'
import { colors } from './src/theme'

const Tab = createBottomTabNavigator()

const TAB_ICON = { Scan: '📷', 'My Card': '🪪', Contacts: '👥' }

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarIcon: () => (
            <Text style={{ fontSize: 18 }}>{TAB_ICON[route.name]}</Text>
          ),
        })}
      >
        <Tab.Screen name="Scan" component={ScanScreen} options={{ title: 'Scan a Card' }} />
        <Tab.Screen name="My Card" component={MyCardScreen} />
        <Tab.Screen name="Contacts" component={ContactsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
