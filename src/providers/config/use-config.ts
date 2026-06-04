import { useContext } from 'react'
import { ConfigContext } from './config-provider'

/**
 * Global app config / feature flags from anywhere:
 *
 *   const { config, isEnabled, setFlag } = useConfig()
 *   if (isEnabled('new-checkout')) { ... }
 */
export function useConfig() {
  const ctx = useContext(ConfigContext)
  if (!ctx) throw new Error('useConfig must be used within <ConfigProvider>')
  return ctx
}
