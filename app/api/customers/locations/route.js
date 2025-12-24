import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { restaurantSchema } from "../../../lib/restaurantModel"
import { connectionStr } from "../../../lib/db";

export async function GET() {
    await mongoose.connect(connectionStr, { useNewUrlParser: true })
    let result = await restaurantSchema.find();

    result = result.map((item) => item.city.charAt(0).toUpperCase() + item.city.slice(1));

    // ==> to remove duplicate city names
    result = [...new Set(result.map((item) => item))]


    return NextResponse.json({ success: true, result })
}