import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react'

/**
 * App-wide runtime config + feature flags, reachable from anywhere via useConfig().
 * Extend `AppConfig` with whatever your app needs (toggles, limits, remote values).
 * Seed it from remote config / the API by passing `initial` or calling setConfig().
 */
export type AppConfig = {
  featureFlags: Record<string, boolean>
  /** example knobs — replace with your own */
  enableAnalytics: boolean
}

const DEFAULT_CONFIG: AppConfig = {
  featureFlags: {},
  enableAnalytics: true,
}

export type ConfigContextValue = {
  config: AppConfig
  setConfig: (patch: Partial<AppConfig>) => void
  setFlag: (key: string, value: boolean) => void
  isEnabled: (key: string) => boolean
}

export const ConfigContext = createContext<ConfigContextValue | null>(null)

export function ConfigProvider({ children, initial }: { children: ReactNode; initial?: Partial<AppConfig> }) {
  const [config, setState] = useState<AppConfig>({ ...DEFAULT_CONFIG, ...initial })

  const setConfig = useCallback((patch: Partial<AppConfig>) => setState((p) => ({ ...p, ...patch })), [])
  const setFlag = useCallback(
    (key: string, value: boolean) => setState((p) => ({ ...p, featureFlags: { ...p.featureFlags, [key]: value } })),
    [],
  )
  const isEnabled = useCallback((key: string) => config.featureFlags[key] ?? false, [config])

  const value = useMemo<ConfigContextValue>(
    () => ({ config, setConfig, setFlag, isEnabled }),
    [config, setConfig, setFlag, isEnabled],
  )

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
}
