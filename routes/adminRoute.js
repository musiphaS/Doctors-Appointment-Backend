import express from 'express';
import { addDoctor, loginAdmin } from '../controllers/adminController.js';
import authAdmin from '../middleware/authAdmin.js';
import multer from "multer";

const adminRouter = express.Router();
const storage = multer.diskStorage({});
const upload = multer({ storage });
// Debugging incoming request
adminRouter.post('/add-doctor', upload.single("image"),authAdmin, (req, res, next) => {
  console.log('Request received at /api/admin/add-doctor');
  console.log('Request body:', req.body);
  next();
}, addDoctor);

adminRouter.post('/login', loginAdmin);


export default adminRouter;
