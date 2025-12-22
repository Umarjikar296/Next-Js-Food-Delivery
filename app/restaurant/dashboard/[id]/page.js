'use client'
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const EditFoodItems = () => {
    const { id } = useParams();

    // console.log(id);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [path, setPath] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState(false);
    const router = useRouter();

    // useEffect(() => {
    //     if (id) handleLoadFoodItem();
    // }, [id])
    useEffect(() => {
        if (!id) return;

        const handleLoadFoodItem = async () => {
            const res = await fetch(`/api/restaurant/foods/edit/${id}`, { cache: "no-store" });
            const data = await res.json();
            console.log("EDIT GET:", data);

            if (data.success && data.result) {
                setName(data.result.name ?? "");
                setPrice(String(data.result.price ?? "")); // input likes string
                setPath(data.result.img_path ?? "");
                setDescription(data.result.description ?? "");
            }
        };

        handleLoadFoodItem();
    }, [id]);





    const handleEditFoodItem = async () => {
        if (!name || !path || !price || !description) {
            setError(true);
            return;
        }
        setError(false);

        const res = await fetch(`/api/restaurant/foods/edit/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                price: Number(price),     // ✅ store as number
                img_path: path,           // ✅ must match schema field name
                description,
            }),
        });

        const data = await res.json();
        console.log("PUT result:", data);

        if (data.success) {
            alert("Updated in DB ✅");
            router.push('../dashboard')
        } else {
            console.log("Update failed ❌", data);
        }
    };


    // const handleLoadFoodItem = async () => {
    //     let response = await fetch("http://localhost:3000/api/restaurant/foods/" + id);
    //     response = await response.json();

    //     if (response.success) {
    //         setName(response.result.name || "");
    //         setPrice(response.result.price ?? "");
    //         setPath(response.result.img_path || "");
    //         setDescription(response.result.description || "");
    //     }
    // };






    // const handleEditFoodItem = async () => {
    //     if (!name || !path || !price || !description) {
    //         setError(true);
    //         return;
    //     }
    //     setError(false);
    //     console.log(name, price, path, description);

    //     let response = await fetch('http://localhost:3000/api/restaurant/foods/' + id, {
    //         method: 'PUT',
    //         body: JSON.stringify({ name, price, img_path: path, description, })
    //     });
    //     if (response.success) {
    //         alert('data updated')
    //     } else {
    //         console.log('galat h bhai');

    //     }
    // };

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
