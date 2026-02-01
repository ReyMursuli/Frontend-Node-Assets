// useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig()
  const { token: authSessionToken } = useAuth()
  const apiBase = config.public.apiBase

  return {
    fetch: <T>(url: string, options: any = {}) => {
      const cookieToken = useCookie('auth.token').value 

      const rawToken: string = authSessionToken.value || cookieToken || '';

      const authHeader = rawToken.startsWith('Bearer ') 
        ? rawToken 
        : `Bearer ${rawToken}`;

      return $fetch<T>(url, {
        baseURL: apiBase,
        ...options,
        headers: {
          ...options.headers,
          ...(rawToken ? { Authorization: authHeader } : {}),
        },
      })
    }
  }
}