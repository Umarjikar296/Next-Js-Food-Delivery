import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { foodSchema } from '../../../../lib/foodsModel'
import { connectionStr } from '../../../../lib/db';



export async function GET(request, content) {
    const id = await content.params.id;
    let success = false;

    await mongoose.connect(connectionStr, { useNewUrlParser: true });
    const result = await foodSchema.find({});
    if (result) {
        success = true;
    }
    return NextResponse.json({ result, success })
}

export async function DELETE(request, content) {
    const id = await content.params.id;
    let success = false;
    await mongoose.connect(connectionStr, { useNewUrlParser: true });
    const result = await foodSchema.deleteOne({})
    if (result.deletedCount > 0) {
        success = true
    }

    return NextResponse.json({ result, success })
}
