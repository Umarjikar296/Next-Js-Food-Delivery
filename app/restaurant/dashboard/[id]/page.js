'use client'
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const EditFoodItems = () => {
    const { id } = useParams();

    console.log(id);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [path, setPath] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (id) {
            handleLoadFoodItem();
        }
    }, [])

    const handleLoadFoodItem = async () => {
        let response = await fetch(`http://localhost:3000/api/restaurant/foods/${id}`)
        response = await response.json();
        console.log(response);
        
        if (response.success) {
            // console.log(response.result);
            // console.log(response.result.name);
            // console.log(id);

            // setName(response.result.name);
            // setPrice(response.result.price);
        }
    }

    const handleEditFoodItem = async () => {
        if (!name || !path || !price || !description) {
            setError(true);
            return;
        }
        setError(false);
        console.log(name, price, path, description);
    };

    return (
        <div className="container">
            <h1>Update Food Items</h1>

            <div className="input-wrapper">
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="input-field" placeholder="Enter food name" />
                {error && !name && <span className="input-error">please enter valid input</span>}
            </div>

            <div className="input-wrapper">
                <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" className="input-field" placeholder="Enter price" />
                {error && !price && <span className="input-error">please enter valid input</span>}
            </div>

            <div className="input-wrapper">
                <input value={path} onChange={(e) => setPath(e.target.value)} type="text" className="input-field" placeholder="Enter path" />
                {error && !path && <span className="input-error">please enter valid input</span>}
            </div>

            <div className="input-wrapper">
                <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" className="input-field" placeholder="Enter description" />
                {error && !description && <span className="input-error">please enter valid input</span>}
            </div>
            <div className="input-wrapper">
                <button onClick={handleEditFoodItem}>Update Food Item</button>
            </div>
            <div className="input-wrapper">
                <button onClick={() => router.push('../dashboard')}>Cancle</button>
            </div>
        </div>
    );
};

export default EditFoodItems;
