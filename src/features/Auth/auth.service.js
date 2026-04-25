const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwtConfig = require('../../config/jwt.config');

class AuthService {
    async login(email, password) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error('User Not found.');
        }

        if (!user.isActive) {
            throw new Error('User is inactive.');
        }

        const passwordIsValid = bcrypt.compareSync(
            password,
            user.password
        );

        if (!passwordIsValid) {
            throw new Error('Invalid Password!');
        }

        const token = jwt.sign({ id: user.id, role: user.role }, jwtConfig.secret, {
            expiresIn: jwtConfig.jwtExpiration,
        });

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken: token
        };
    }
}

module.exports = new AuthService();
