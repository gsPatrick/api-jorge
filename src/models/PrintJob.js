const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const PrintJob = sequelize.define('PrintJob', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    templateId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('success', 'failed'),
        defaultValue: 'success',
        allowNull: false,
    },
    printMode: {
        type: DataTypes.ENUM('BLUETOOTH_STANDARD', 'SDK', 'LOCAL_NETWORK'),
        allowNull: false,
    },
}, {
    tableName: 'print_jobs',
    timestamps: true, // createdAt serves as the timestamp
});

module.exports = PrintJob;
