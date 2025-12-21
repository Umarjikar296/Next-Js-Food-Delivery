import { connectionStr } from "@/app/lib/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { restaurantSchema } from "../../lib/restaurantModel";

export async function GET() {
    await mongoose.connect(connectionStr, { useNewUrlParser: true })
    const data = await restaurantSchema.find()
    console.log(data);
    return NextResponse.json({ result: true })
}

export async function POST(request) {
    let payload = await request.json();
    let result;
    let success = false;
    await mongoose.connect(connectionStr, { useNewUrlParser: true })
    //use it for login
    if (payload.login) {
        result = await restaurantSchema.findOne({ email: payload.email, password: payload.password })
        if (result) {
            success = true;
        }
    } else {
        //use it for signup
        const restaurant = new restaurantSchema(payload)
        result = await restaurant.save();
        if (result) {
            success = true;
        }
    }
    return NextResponse.json({ result, success })
}