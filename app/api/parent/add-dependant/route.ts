


import dbConnect from "@/app/utils/dbConnect";
import Dependant from "@/app/models/Dependant";
import Parent from "@/app/models/Parent";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";



//generate smart card Id
function generateSmartCardId(){
    return "PSC-" + Math.random().toString(36).substring(2,10).toUpperCase();
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const parent = await Parent.findOne({ email: session.user.email });
    if (!parent) {
      return NextResponse.json({ message: "Parent not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, pin, institute, dailySpendLimit } = body;

    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json({ message: "PIN must be exactly 4 digits." }, { status: 400 });
    }
    


    // Generate a unique smartCardId — retry if collision (extremely rare)
    let smartCardId = generateSmartCardId();
    let attempts = 0;
    while (await Dependant.findOne({ smartCardId })) {
      smartCardId = generateSmartCardId();
      attempts++;
      if (attempts > 10) {
        return NextResponse.json({ message: "Could not generate unique card ID. Try again." }, { status: 500 });
      }
    }

    // Hash the PIN before saving
    const hashedPin = await bcrypt.hash(pin, 10);

    const dependant = new Dependant({
      parentId: parent._id,
      name,
      pin: hashedPin,
      smartCardId,
      institute,
      dailySpendLimit,
      balance: 0,
    });

    

    await dependant.save();

    // Add dependant to parent's dependants array
    //parent.dependants.push(dependant._id);
    //await parent.save();
    await Parent.findByIdAndUpdate(parent._id, {
        $push: {dependants: dependant._id}
    });

    //prevent duplicate smart cards, since every child should have one unique
    //smart card
    //const existingCard = await Dependant.findOne({smartCardId});
    //if(existingCard) {
    //    return NextResponse.json(
    //        {message: "Smart card already registered"},
    //        {status: 400}
    //    );
    //}
    //above prevents 2 children using the same card

    return NextResponse.json({
      message: "Child added successfully.",
      dependant: {
        _id: dependant._id,
        name: dependant.name,
        smartCardId: dependant.smartCardId,
        institute: dependant.institute,
        balance: dependant.balance,
      },
    });
  } catch (err: any) {
     console.error("[add-dependant]", err);

    // Handle MongoDB duplicate key error as a safety net
    if (err.code === 11000) {
      return NextResponse.json(
        { message: "A duplicate entry was detected. Please try again." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: err.message || "Error adding child" },
      { status: 500 }
    );
  }
}


