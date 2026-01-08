
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectionStr } from "../../../lib/db"
import { restaurantSchema } from "../../../lib/restaurantModel"
import { foodSchema } from "../../../lib/foodsModel"


export async function GET(request, content) {
    const params = await content.params;
    const id = params.id
    await mongoose.connect(connectionStr, { useNewUrlParser: true })
    const details = await restaurantSchema.findOne({ _id: id })
    const foodItems = await foodSchema.find({ resto_id: id })
    return NextResponse.json({ success: true, id: id, details: details, foodItems });
}
