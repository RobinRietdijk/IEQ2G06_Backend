import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ADMIN_USER, ADMIN_PASSWD, SECRET, REFRESH_SECRET } from '../../util/constants.js';

const loginHandler = {
    POST: (req, res) => {
        const { username, password } = req.body;
        const token = req.headers.authorization;
        if (token) {
            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
                }
                const newToken = jwt.sign({ username: decoded.username }, SECRET, { expiresIn: '15m' });
                const newRefreshToken = jwt.sign({ username: decoded.username }, REFRESH_SECRET, { expiresIn: '7d' });

                res.json({ token: newToken, refreshToken: newRefreshToken });
            });
        } else if (username === ADMIN_USER && bcrypt.compareSync(password, ADMIN_PASSWD)) {
            const token = jwt.sign({ username: username }, SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign({ username: username }, REFRESH_SECRET, { expiresIn: '7d' });
            
            res.json({ token: token, refreshToken: refreshToken });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    }
};

export default loginHandler;