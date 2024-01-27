'use client'

import API_URL from '@/app/api/api'
import layout from '../layout.module.css'

const LoginPage = () => {
    return (
        <div>
            <h1 className={layout.formTitle}>Login</h1>
            <div className={layout.formContent}>
                <h3 className={layout.formFieldName}>Email</h3>
                <input
                    id="email-input"
                    className={layout.formFieldInput}
                    placeholder='johndoe1337@example.com'
                />
                <h3 className={layout.formFieldName}>Password</h3>
                <input
                    id="password-input"
                    className={layout.formFieldInput}
                    placeholder="●●●●●"
                    type='password'
                />
            </div>
            <button className={layout.confirmButton} onClick={async () => {
                const email = document.getElementById('email-input') as HTMLInputElement
                const password = document.getElementById('password-input') as HTMLInputElement

                console.log("yaa")
                if (!email.value || !password.value) return
                console.log('noo')

                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email.value,
                        password: password.value
                    })
                })
                
                if (response.status !== 202) return

                const data = await response.json()
            
                document.cookie = `token=${data.token}; SameSite=Strict; Secure; Path=/; Max-Age=2419200;`
                window.location.href = '/timeline'
            }}>
                Login
            </button>
        </div>
    )
}

export default LoginPage;