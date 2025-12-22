import mongoose from "mongoose";
import { connectionStr } from '../../../lib/db';
import { foodSchema } from "../../../lib/foodsModel";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {

        const payload = await request.json();
        let success = false
        await mongoose.connect(connectionStr, { useNewUrlParser: true })
        const food = new foodSchema(payload);

        const result = await food.save();
        if (result) {
            success = true
        }
        return NextResponse.json({ result, success: true })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}

// old version

