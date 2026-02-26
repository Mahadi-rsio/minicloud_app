import { useEffect, useState } from 'react'
import { getSession, signIn } from './../lib/authClient'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function Login() {

    const [userId, setUserId] = useState<string | null | undefined>("")
    const [userName, setUserName] = useState('')

    const handleLogin = async () => {
        const { data, error } = await signIn.social({
            provider: 'github',

        })

        if (!data || error) {
            toast.error('login faild')
        }

    }

    async function session() {
        const { data, error } = await getSession()

        if (data) {
            setUserId(data.user.id)
            setUserName(data.user.name)
        }
        if (error) {
            toast.error("You are not logged in")
        }

    }

    useEffect(() => {
        session()
    }, [])

    return (
        <>
            {userId && (
                <p>You are logged in as {userName}</p>
            )}
            {!userId && (
                <>
                    <p>Log in now</p>
                    <Button variant='default' onClick={handleLogin}>Login</Button>
                </>
            )}


        </>
    )
}
