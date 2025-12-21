import { useState } from "react";

const AddFoodItems = (props) => {
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [path, setPath] = useState("")
    const [description, setDescription] = useState("")
    const [error, setError] = useState(false)


    const handleAddFoodItem = async () => {
        console.log(name, price, path, description);
        if (!name || !path || !price || !description) {
            setError(true);
            return false;
        } else {
            setError(false)
        }
        let resto_id;
        const restaurantData = JSON.parse(localStorage.getItem("restaurantUser"));
        if (restaurantData) {
            resto_id = restaurantData._id
        }else{
            console.log('idhar gadbad h bhai....');
            
        }
        let response = await fetch("http://localhost:3000/api/restaurant/foods", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, price, img_path: path, description, resto_id })
        });
        response = await response.json();
        if (response.success) {
            alert("successfull")
            props.setAddItem(false);
        } else {
            alert("unsuccessfull")
        }

    }

    return (

        <div className="container">
            <h1>Add New Food Items</h1>
            <div className="input-wrapper">
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="input-field" placeholder="Enter food name" />
                {error && !name && <span className="input-error">please enter valid input</span>}
            </div>
            <div className="input-wrapper">

                <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" className="input-field" placeholder="Enter price" />
                {error && !name && <span className="input-error">please enter valid input</span>}
            </div>
            <div className="input-wrapper">
                <input value={path} onChange={(e) => setPath(e.target.value)} type="text" className="input-field" placeholder="Enter path" />
                {error && !name && <span className="input-error">please enter valid input</span>}
            </div>
            <div className="input-wrapper">
                <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" className="input-field" placeholder="Enter Description" />
                {error && !name && <span className="input-error">please enter valid input</span>}
            </div>
            <div className="input-wrapper">
                <button className="button" onClick={handleAddFoodItem}>Add Food Item</button>
            </div>
        </div>

    )
}

export default AddFoodItems;