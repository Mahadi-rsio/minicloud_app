import { createAuthClient } from 'better-auth/react'

export const { getSession, signIn, signUp, signOut } = createAuthClient({
    baseURL: "http://localhost:3000/"
})
