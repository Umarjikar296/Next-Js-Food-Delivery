'use client'
import { useState } from 'react'
import CustomerHeader from '../_components/CustomerHeader'
import RestaurantFooter from '../_components/RestaurantFooter'
import UserSignup from '../_components/UserSignup'
import UserLogin from '../_components/UserLogin'

const UserAuth = () => {
    const [login, setLogin] = useState(true)
    return (
        <div>
            <CustomerHeader />
            <div className="container">
                <h1>{login ? 'User Login' : 'User SignUp'}</h1>
                {login ? <UserLogin /> : <UserSignup />}
                <button className='button-link' onClick={() => setLogin(!login)}>
                    {login ? 'Dont have an account? Signup' : 'Already have an account? Login'}
                </button>
            </div>
            <RestaurantFooter />
        </div>
    )
}

export default UserAuth;