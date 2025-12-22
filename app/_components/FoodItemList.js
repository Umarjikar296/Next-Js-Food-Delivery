import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

const FoodItemList = () => {

    const [foodItems, setFoodItems] = useState()
    const router = useRouter()

    useEffect(() => {
        loadFoodItems();
    }, []);

    const loadFoodItems = async () => {
        const restaurantData = JSON.parse(localStorage.getItem('restaurantUser'));
        // console.log(restaurantData);

        const resto_id = restaurantData._id;
        // console.log(resto_id);

        let response = await fetch('http://localhost:3000/api/restaurant/foods/' + resto_id)

        response = await response.json();
        // console.log(response);

        if (response.success) {
            setFoodItems(response.result)
            // console.log(response);   

        } else {
            alert("not loading bhai kuch galat h.")
        }

    }

    const deleteFoodItem = async (id) => {
        console.log("Deleting item id:", id, "type:", typeof id);

        const url = `http://localhost:3000/api/restaurant/foods/${id}`;
        console.log("DELETE URL:", url);

        let response = await fetch(url, { method: "DELETE" });
        const data = await response.json();

        console.log("DELETE response:", data);

        if (data.success) loadFoodItems();
        else console.log("food item not deleted");
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