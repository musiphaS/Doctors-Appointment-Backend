import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
    try {
        // Extract token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
        }
        
        const token = authHeader.split(" ")[1]; // Extract token after "Bearer "

        // Decode and verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Validate token content
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: "Access Denied. Invalid Admin Credentials." });
        }

        // Attach admin info to the request object (optional)
        req.admin = decoded;

        next(); // Proceed to the next middleware or controller
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(403).json({ success: false, message: "Invalid or expired token. Please login again." });
    }
};

export default authAdmin;