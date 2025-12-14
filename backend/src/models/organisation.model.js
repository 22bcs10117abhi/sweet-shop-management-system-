import mongoose from "mongoose";

const organisationSchema = new mongoose.Schema({
    adminAddress: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    organisationName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    orgRegId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    contractAddress: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    }
}, {
    timestamps: true
});

export const Organisation = mongoose.model('Organisation', organisationSchema);
