const db = require('../src/config/db.config');
require('../src/models/associations');
const User = require('../src/models/User');
const Template = require('../src/models/Template');

const reset = async () => {
    try {
        console.log('Connecting to database...');
        await db.authenticate();

        console.log('Forcing database sync (DROP ALL TABLES)...');
        await db.sync({ force: true });

        console.log('Database reset successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Reset error:', error);
        process.exit(1);
    }
};

reset();
