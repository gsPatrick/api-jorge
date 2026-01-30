const User = require('./User');
const Template = require('./Template');

// Define Many-to-Many relationship
User.belongsToMany(Template, { through: 'UserTemplates', as: 'templates' });
Template.belongsToMany(User, { through: 'UserTemplates', as: 'users' });

module.exports = { User, Template };
