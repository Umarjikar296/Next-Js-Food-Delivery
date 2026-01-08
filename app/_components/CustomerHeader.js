'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CustomerHeader = (props) => {

    const userStorage =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user"))
            : null;
    const cartStorage =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("cart"))
            : null;
    const [user, setUser] = useState(userStorage ? userStorage : undefined)
    const [cartNumber, setCartNumber] = useState(cartStorage?.length)
    const [cartItem, setCartItem] = useState(cartStorage)
    const router = useRouter();
    console.log(userStorage);


    useEffect(() => {
        if (props.cartData) {
            console.log(props);
            if (cartNumber) {
                if (cartItem[0].resto_id != props.cartData.resto_id) {
                    localStorage.removeItem('cart')
                    setCartNumber(1);
                    setCartItem([props.cartData])
                    localStorage.setItem('cart', JSON.stringify(props.cartData))
                } else {
                    let localCartItem = cartItem;
                    localCartItem.push(JSON.parse(JSON.stringify(props.cartData)))
                    setCartItem(localCartItem);
                    setCartNumber(localCartItem.length)
                    localStorage.setItem('cart', JSON.stringify(localCartItem))
                }
            } else {
                setCartNumber(1);
                setCartItem([props.cartData])
                localStorage.setItem('cart', JSON.stringify(props.cartData))
            }
        }

    }, [props.cartData])

    const logout = () => {
        localStorage.removeItem('user');
        router.push('/user-auth')
    }

    return (
        <div className="header-wrapper">
            <div className="logo">
                <img />
            </div>
            <ul>
                <li>
                    <Link href="/">Home </Link>
                </li>
                {
                    user ?
                        <>
                            <li>
                                <Link href="/#">{user?.name} </Link>
                            </li>
                            <li><button onClick={logout}>Logout</button></li>
                        </> :
                        <>
                            <li>
                                <Link href="/restaurant">Restaurant? </Link>
                            </li>
                            <li>
                                <Link href="/user-auth">User? </Link>
                            </li>
                        </>
                }

                <li>
                    <Link href="/">Cart({cartNumber ? cartNumber : 0}) </Link>
                </li>

            </ul>
        </div>
    )
}
export default CustomerHeader;