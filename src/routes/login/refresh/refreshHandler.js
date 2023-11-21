import jwt from 'jsonwebtoken';
import { SECRET, REFRESH_SECRET } from '../../../util/constants.js';

const refreshHandler = {
    POST: (req, res) => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token is required' });
        }

        jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized - Invalid refresh token' });
            }

            const newToken = jwt.sign({ username: decoded.username, isAdmin: decoded.isAdmin }, SECRET, {
                expiresIn: '15m',
            });

            res.json({ token: newToken });
        });
    }
};

export default refreshHandler;