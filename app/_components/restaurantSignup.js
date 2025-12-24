
import { useRouter } from "next/navigation";
import { useState } from "react"

const RestaurantSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const [contact, setContact] = useState('');
    const [rname, setRname] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const router = useRouter();

    const handleSignup = async () => {
        if (password !== cpassword) {
            setPasswordError(true)
            return false
        } else {
            setPasswordError(false)

        }
        if (!email || !password || !cpassword || !contact || !rname || !city) {
            setError(true)
            return false
        } else {
            setError(false)
        }


        console.log(email, password, cpassword, contact, rname, city);
        
        let response = await fetch("/api/restaurant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, contact, rname, city }),
        });

        response = await response.json();

        if (response.success) {
            const { result } = response;
            delete result.password;

            localStorage.setItem("restaurantUser", JSON.stringify(result));

            router.replace("/restaurant/dashboard");
            router.refresh();
        }

        // let response = await fetch("http://localhost:3000/api/restaurant", {
        //     method: "POST",
        //     body: JSON.stringify({ email, password, contact, rname, city })
        // })
        // response = await response.json();
        // console.log(response);
        // if (response.success) {
        //     console.log(response);
        //     const { result } = response
        //     delete result.password;
        //     localStorage.setItem("restaurantUser", JSON.stringify(result));
        //     router.push('/restaurant/dashboard')
        // }

    }
    return (
        <>
            <h3>
                Restaurant Signup component
            </h3>
            <div>
                <div className="input-wrapper">
                    <input className="input-field" type="email" placeholder="Enter Email Id" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                {
                    error && !email && <span className="input-error">Please enter email</span>
                }

                <div className="input-wrapper">
                    <input className="input-field" type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {
                    passwordError && <span className="input-error">Password doesn't match</span>
                }

                {
                    error && !password && <span className="input-error">Please enter password</span>
                }

                <div className="input-wrapper">
                    <input className="input-field" type="password" placeholder="Confirm Password" value={cpassword} onChange={(e) => setCpassword(e.target.value)} />
                </div>
                {
                    passwordError && <span className="input-error">Password doesn't match</span>
                }

                {
                    error && !cpassword && <span className="input-error">Please enter password</span>
                }

                <div className="input-wrapper">
                    <input className="input-field" type="number" placeholder="Contact Number" value={contact} onChange={(e) => setContact(e.target.value)} />
                </div>

                {
                    error && !contact && <span className="input-error">Please enter contact</span>
                }

                <div className="input-wrapper">
                    <input className="input-field" type="text" placeholder="Enter Restaurant Name" value={rname} onChange={(e) => setRname(e.target.value)} />
                </div>
                {
                    error && !rname && <span className="input-error">Please enter name</span>
                }

                <div className="input-wrapper">
                    <input className="input-field" type="text" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                {
                    error && !city && <span className="input-error">Please enter city</span>
                }

                <div className="input-wrapper">
                    <button onClick={handleSignup} className="button">SignUp</button>
                </div>
            </div>
        </>
    )
}

export default RestaurantSignup