const User = require('../../models/User');
const bcrypt = require('bcryptjs');

class UserService {
    async createUser(userData) {
        const hashedPassword = bcrypt.hashSync(userData.password, 8);
        const user = await User.create({
            ...userData,
            password: hashedPassword,
        });
        return user;
    }

    async getAllUsers() {
        return await User.findAll({
            attributes: { exclude: ['password'] },
            include: ['templates'], // Include associated templates
            order: [['createdAt', 'DESC']]
        });
    }

    async updateStatus(id, isActive) {
        const user = await User.findByPk(id);
        if (!user) throw new Error('User not found');
        user.isActive = isActive;
        await user.save();
        return user;
    }

    async deleteUser(id) {
        const user = await User.findByPk(id);
        if (!user) throw new Error('User not found');
        await user.destroy();
        return true;
    }

    async updateUser(id, userData) {
        const user = await User.findByPk(id);
        if (!user) throw new Error('User not found');

        if (userData.password) {
            userData.password = bcrypt.hashSync(userData.password, 8);
        }

        await user.update(userData);
        return user;
    }

    async assignTemplates(userId, templateIds) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');

        // setTemplates is a magic method added by Sequelize belongsToMany
        await user.setTemplates(templateIds);
        return await this.getUserWithTemplates(userId);
    }

    async getUserWithTemplates(userId) {
        return await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: ['templates']
        });
    }
}

module.exports = new UserService();
