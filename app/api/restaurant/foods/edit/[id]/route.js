import mongoose from "mongoose";
import { foodSchema } from "../../../../../lib/foodsModel"
import { connectionStr } from "../../../../../lib/db"
import { NextResponse } from "next/server";

export async function GET(request, content) {
    const id = content.params.id;
    let success = false;
    await mongoose.connect(connectionStr, { useNewUrlParser: true });
    const result = await foodSchema.findOne({ _id: id })
    if (result) {
        success: true;
    }
    return NextResponse.json({ result, success });
}