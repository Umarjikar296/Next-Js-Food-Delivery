import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

const FoodItemList = () => {

    const [foodItems, setFoodItems] = useState()
    const [restoId, setRestoId] = useState(null);
    const router = useRouter()

    // useEffect(() => {
    //     loadFoodItems();
    // }, []);


    // const loadFoodItems = async (id) => {
    //     const res = await fetch(`/api/restaurant/foods/${id}`, { cache: "no-store" });
    //     const data = await res.json();

    //     if (data.success) {
    //         setFoodItems(data.result);
    //     } else {
    //         alert("not loading");
    //     }
    // };

    useEffect(() => {
        const restaurantData = JSON.parse(localStorage.getItem("restaurantUser"));
        setRestoId(restaurantData?._id || null);
    }, []);

    useEffect(() => {
        if (!restoId) return;

        setFoodItems([]); // ✅ immediately clear old restaurant items
        loadFoodItems(restoId);
    }, [restoId]);

    const loadFoodItems = async (id) => {
        let res = await fetch(`/api/restaurant/foods/${id}`, { cache: "no-store" });
        const data = await res.json();

        if (data.success) setFoodItems(data.result);
    };

    const deleteFoodItem = async (id) => {
        const res = await fetch(`/api/restaurant/foods/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) loadFoodItems(restoId);
    };

    // const deleteFoodItem = async function (id) {
    //     console.log("ye h eski id" + id);

    //     let response = await fetch(`http://localhost:3000/api/restaurant/foods/${id}`, {
    //         method: 'DELETE'
    //     });
    //     response = await response.json();
    //     console.log(response);
    //     // console.log('yaha');


    //     if (response.success) {
    //         loadFoodItems();
    //     } else {
    //         console.log('food item not deleted');

    //     }

    // }

    return (
        <div>
            <h1> Food Items</h1>
            <table>
                <thead>
                    <tr>
                        <td>S.N</td>
                        <td>Name</td>
                        <td>Price</td>
                        <td>Description</td>
                        <td>Image</td>
                        <td>Operations</td>
                    </tr>
                </thead>

                <tbody>
                    {
                        foodItems && foodItems.map((item, key) => (

                            <tr key={key}>
                                <td>{key + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                                <td>{item.description}</td>
                                <td><img width={100} src={item.img_path} alt="" /></td>

                                <td><button onClick={() => deleteFoodItem(item._id)} >Delete</button><button onClick={() => router.push('dashboard/' + item._id)}>Edit</button></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default FoodItemList;