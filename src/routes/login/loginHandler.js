import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ADMIN_USER, ADMIN_PASSWD, SECRET } from '../../util/constants.js';

const loginHandler = {
    POST: (req, res) => {
        const { username, password } = req.body;
        if (username === ADMIN_USER && bcrypt.compareSync(password, ADMIN_PASSWD)) {
            const token = jwt.sign({ username, isAdmin: true }, SECRET, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    }
};

export default loginHandler;