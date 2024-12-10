import validator from 'validator';
import bcrypt from 'bcrypt';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinary.js';

const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;

        // Log incoming data
        console.log("Body:", req.body);
        console.log("File:", req.file);

        // Check for missing fields
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !req.file) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // Check image upload
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required." });
        }

        // Parse address if needed
        const parsedAddress = JSON.parse(address);

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "doctors",
        });

        // Create doctor object
        const doctorData = {
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: parsedAddress,
            image: result.secure_url,
            date: Date.now(),
        };

        // Save to database
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.status(201).json({ success: true, message: "Doctor added successfully", doctor: newDoctor });
    } catch (error) {
        console.error("Error adding doctor:", error);
        res.status(500).json({ success: false, message: "An error occurred while adding the doctor." });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Admin login credentials validation
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
            return res.json({ success: true, token });
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during login. Please try again.",
        });
    }
};

export { addDoctor, loginAdmin };
