import mongoose from "mongoose";
import { foodSchema } from "../../../../../lib/foodsModel"
import { connectionStr } from "../../../../../lib/db"
import { NextResponse } from "next/server";



export async function GET(request) {
    try {
        const pathname = new URL(request.url).pathname;
        const id = pathname.split("/").filter(Boolean).pop(); // <-- last segment

        await mongoose.connect(connectionStr);

        const result = await foodSchema.findById(id);

        return NextResponse.json({
            success: !!result,
            result,
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const pathname = new URL(request.url).pathname;
        const id = pathname.split("/").filter(Boolean).pop();

        const payload = await request.json();

        console.log("PUT id:", id);
        console.log("PUT payload:", payload);

        await mongoose.connect(connectionStr);

        const result = await foodSchema.findByIdAndUpdate(
            id,
            { $set: payload },                 // ✅ updates exactly what you send
            { new: true, runValidators: true } // ✅ returns updated doc + validates
        );

        return NextResponse.json({ success: !!result, result });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}

// export async function GET(request, content) {
//     const id = content.params.id;
//     console.log('ye edit k lia ki id h' + id);

//     let success = false;
//     await mongoose.connect(connectionStr, { useNewUrlParser: true });
//     const result = await foodSchema.findOne({ _id: id })
//     if (result) {
//         success: true;
//     }
//     return NextResponse.json({ result, success });
// }



// export async function PUT(request, content) {
//     const id = content.params.id;
//     const payload = await request.json()
//     let success = false;
//     await mongoose.connect(connectionStr, { useNewUrlParser: true })
//     const result = await foodSchema.findOneAndUpdate({ _id: id }, payload)
//     if (result) {
//         success: true
//     }
//     return NextResponse.json({ result, success })
// }