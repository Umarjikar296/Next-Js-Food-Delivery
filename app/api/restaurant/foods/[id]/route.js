import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { foodSchema } from '../../../../lib/foodsModel'
import { connectionStr } from '../../../../lib/db';



// Old version
// export async function GET(request, content) {
//     const id = await content.params.id;
//     let success = false;
//     console.log('ye h id' + id);


//     await mongoose.connect(connectionStr, { useNewUrlParser: true });
//     const result = await foodSchema.find({ resto_id: id });

//     if (result) {
//         success = true;
//     }
//     return NextResponse.json({ result, success })
// }
export async function GET(request) {
  try {
    const pathname = new URL(request.url).pathname;
    const id = pathname.split("/").filter(Boolean).pop(); // ✅ restaurant id from URL

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing restaurant id in URL" },
        { status: 400 }
      );
    }

    await mongoose.connect(connectionStr);

    // cast to ObjectId if possible
    const restoId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : id;

    const result = await foodSchema.find({ resto_id: restoId });

    return NextResponse.json({ success: true, result });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  // Get last path segment as id: /api/restaurant/foods/<id>
  const pathname = new URL(request.url).pathname;
  const id = pathname.split("/").filter(Boolean).pop(); // handles trailing slashes too

  console.log("DELETE pathname:", pathname);
  console.log("DELETE id from URL:", id);

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Missing id in URL" },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid food id", received: id },
      { status: 400 }
    );
  }

  await mongoose.connect(connectionStr);

  const result = await foodSchema.deleteOne({ _id: id });

  return NextResponse.json({
    success: result.deletedCount > 0,
    result,
  });
}



// export async function DELETE(request, content) {
//     const id = content.params._id;
//     console.log(id);
//     let success = false;
//     await mongoose.connect(connectionStr, { useNewUrlParser: true });

//     const result = await foodSchema.deleteOne({ _id: id })
    
//     console.log(result);

//     if (result.deletedCount > 0) {
//         success = true
//     }

//     return NextResponse.json({ result, success })
// }
