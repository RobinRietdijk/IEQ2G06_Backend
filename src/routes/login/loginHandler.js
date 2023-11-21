import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ADMIN_USER, ADMIN_PASSWD, SECRET, REFRESH_SECRET } from '../../util/constants.js';
import refreshHandler from './refresh/refreshHandler.js';

const loginHandler = {
    REFRESH: refreshHandler,
    GET: (req, res) => {
        const token = req.headers.authorization;

        if (!token) {
          return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }
      
        jwt.verify(token, SECRET, (err, decoded) => {
          if (err) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
          }
      
          res.status(200).json({ user: req.user });
        });
    },
    POST: (req, res) => {
        const token = req.headers.authorization;
        const { username, password } = req.body;
        if (token) {
            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
                }
                res.json({ message: 'Token authentication successful' });
            });
        } else if (username === ADMIN_USER && bcrypt.compareSync(password, ADMIN_PASSWD)) {
            const token = jwt.sign({ username, isAdmin: true }, SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign({ username: username, isAdmin: true }, REFRESH_SECRET, { expiresIn: '7d' });
            
            res.json({ token: token, refreshToen: refreshToken });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    }
};

export default loginHandler;