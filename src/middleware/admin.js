export const adminMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ message: 'Unauthorized - No token provided' });
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        if (!decoded.isAdmin) return res.status(403).json({ message: 'Forbidden - Admin access required' });
        req.user = decoded;
        next();
    });
}