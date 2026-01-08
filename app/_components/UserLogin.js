import { useRouter } from "next/navigation";
import { useState } from "react"

const UserLogin = () => {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState();
    const router = useRouter();

    const loginHandle = async () => {
        let response = await fetch('http://localhost:3000/api/user/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        })
        response = await response.json();
        if (response.success) {
            // to save the signup data in localStorage excluding password
            const { result } = response;
            delete result.password;
            localStorage.setItem('user', JSON.stringify(result));
            router.push('/')
        } else {
            alert("Failed")
        }
    }

    return (

        <div>
            <div className="input-wrapper">
                <input className="input-field" type="text" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input-wrapper">
                <input className="input-field" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="input-wrapper">
                <button onClick={loginHandle} className="button">Login</button>
            </div>

        </div>
    )
}

export default UserLogin