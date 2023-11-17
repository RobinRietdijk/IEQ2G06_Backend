import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_KEY || 'jwtsecret'; 
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWD = process.env.ADMIN_PASSWD || bcrypt.hashSync('admin', 10);

export default () => {
    const router = express.Router();

    router.use((req, res, next) => {
        next();
    });

    router.post('/', async (req, res) => {
        const { username, password } = req.body;
        if (username === ADMIN_USER && bcrypt.compareSync(password, ADMIN_PASSWD)) {
            const token = jwt.sign({ username, isAdmin: true }, SECRET, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });

    return router;
}