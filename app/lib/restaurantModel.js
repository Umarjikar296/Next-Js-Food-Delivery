import mongoose from "mongoose";

const restaurantModel = new mongoose.Schema({
    email: String,
    password: String,
    contact: String,
    rname: String,
    city: String,
});

export const restaurantSchema = mongoose.models.restaurants || mongoose.model("restaurants", restaurantModel);