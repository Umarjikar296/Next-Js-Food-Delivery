import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { restaurantSchema } from "../../lib/restaurantModel";
import { connectionStr } from "../../lib/db"

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    // console.log(searchParams.get("location"));
    let filter = {}
    if (searchParams.get("location")) {
        let city = searchParams.get("location");
        filter = { city: { $regex: new RegExp(city, 'i') } } //make it case insenstive
    } else if (searchParams.get("restaurant")) {
        let rname = searchParams.get("restaurant")
        filter = { rname: { $regex: new RegExp(rname, 'i') } }
    }
    await mongoose.connect(connectionStr, { useNewUrlParser: true });
    let result = await restaurantSchema.find(filter)
    return NextResponse.json({ success: true, result });
}
