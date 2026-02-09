'use client'
import { useState } from 'react'
import CustomerHeader from '../_components/CustomerHeader'
import RestaurantFooter from '../_components/RestaurantFooter'
import UserSignup from '../_components/UserSignup'
import UserLogin from '../_components/UserLogin'

const UserAuth = () => {
    const [login, setLogin] = useState(true);

    const toggleAuth = () => setLogin(!login); // ✅ same logic

    return (
        <div>
            <CustomerHeader />
            <div className="container">
                <div style={{ textAlign: 'center' }}>
                    <h1>{login ? 'User Login' : 'User SignUp'}</h1>
                </div>

                {login ? (
                    <UserLogin onToggle={toggleAuth} />
                ) : (
                    <UserSignup onToggle={toggleAuth} />
                )}

                {/* <button className="button-link" onClick={toggleAuth}>
                    {login ? 'Dont have an account? Signup' : 'Already have an account? Login'}
                </button> */}
            </div>
            <RestaurantFooter />
        </div>
    );
}

export default UserAuth;
