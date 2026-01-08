'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";

const UserSignup = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [city, setCity] = useState('')
    const [address, setAddress] = useState('')
    const [mobile, setMobile] = useState('')
    const router = useRouter();

    const handleSignUp = async () => {
        console.log(name, email, password, city, address, mobile);
        let response = await fetch('http://localhost:3000/api/user', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, city, address, mobile })
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
                <input type="text" value={name} className="input-field" onChange={(e) => setName(e.target.value)} placeholder="Enter Name" />
            </div>
            <div className="input-wrapper">
                <input type="text" value={email} className="input-field" onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
            </div>
            <div className="input-wrapper">
                <input type="text" value={password} className="input-field" onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" />
            </div>
            <div className="input-wrapper">
                <input type="text" value={confirmPassword} className="input-field" onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
            </div>
            <div className="input-wrapper">
                <input type="text" value={city} className="input-field" onChange={(e) => setCity(e.target.value)} placeholder="Enter City" />
            </div>
            <div className="input-wrapper">
                <input type="text" value={address} className="input-field" onChange={(e) => setAddress(e.target.value)} placeholder="Enter Address" />
            </div>
            <div className="input-wrapper">
                <input type="text" value={mobile} className="input-field" onChange={(e) => setMobile(e.target.value)} placeholder="Enter Mobile" />
            </div>
            <div className="input-wrapper">
                <button onClick={() => handleSignUp()} className="button">SingUp</button>
            </div>
        </div>
    )
}

export default UserSignup;