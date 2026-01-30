const db = require('./src/config/db.config');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        await db.authenticate();
        await db.sync();

        const adminEmail = 'admin@admin.com';
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });

        if (!existingAdmin) {
            const hashedPassword = bcrypt.hashSync('admin', 8);
            await User.create({
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                isActive: true
            });
            console.log('Admin user created successfully.');
        } else {
            console.log('Admin user already exists.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seed();
