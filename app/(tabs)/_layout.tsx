import { Tabs } from 'expo-router'
import { FloatingTabBar } from '@/shared/components/navigation/floating-tab-bar'


export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="bike" />
      <Tabs.Screen name="charge" />
      <Tabs.Screen name="alerts" />
      <Tabs.Screen name="profile" />
    </Tabs>
  )
}
