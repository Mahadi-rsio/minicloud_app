import { createAuthClient } from 'better-auth/react'

export const {
    getSession,
    signIn,
    signUp,
    signOut,
    revokeSessions,
    getAccessToken
} = createAuthClient({
    baseURL: "http://localhost:3000/"
})
