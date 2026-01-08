'use client'
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const RestaurantHeader = () => {
    const [details, setDetails] = useState();
    const router = useRouter();
    const pathName = usePathname();

    useEffect(() => {
        const data = localStorage.getItem("restaurantUser");

        if (!data && pathName == "/restaurant/dashboard") {
            router.push("/restaurant")

        } else if (data && pathName == "/restaurant") {
            router.push("/restaurant/dashboard");

        } else {
            setDetails(JSON.parse(data));
        }

    }, [])

    const logout = () => {
        localStorage.removeItem("restaurantUser");
        router.push("/restaurant");
    }
    return (
        <div className="header-wrapper">
            <div className="logo">
                <h1>I am header logo </h1>
            </div>
            <ul>
                <li><Link href="/">Home</Link></li>

                {
                    details && details.rname ?
                        <>
                            <li><button onClick={logout}>Logout</button></li>

                            < li ><Link href="">Profile</Link></li> </> : <li><Link href="/user-auth">User?</Link></li>
                }

            </ul>
        </div >
    )
}

export default RestaurantHeader;