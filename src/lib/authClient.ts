import { createAuthClient } from 'better-auth/react'
import { deviceAuthorizationClient } from 'better-auth/client/plugins'

export const {
    getSession,
    signIn,
    signUp,
    signOut,
    revokeSessions,
    getAccessToken,
    device
} = createAuthClient({
    baseURL: "http://localhost:3000/",
    plugins: [
        deviceAuthorizationClient()
    ],
    fetchOptions: {
        credentials: "include"
    }
})
