const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Template = sequelize.define('Template', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    configJson: {
        type: DataTypes.JSONB,
        allowNull: true,
        // Expected structure: { x: number, y: number, width: number, height: number }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'templates',
    timestamps: true,
});

module.exports = Template;
