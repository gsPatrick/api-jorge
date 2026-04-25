const User = require('./User');
const Template = require('./Template');
const PrintJob = require('./PrintJob');

// Define Many-to-Many relationship (User <-> Template)
User.belongsToMany(Template, { through: 'UserTemplates', as: 'templates' });
Template.belongsToMany(User, { through: 'UserTemplates', as: 'users' });

// Define One-to-Many relationships (User -> PrintJob, Template -> PrintJob)
User.hasMany(PrintJob, { foreignKey: 'userId', as: 'printJobs' });
PrintJob.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Template.hasMany(PrintJob, { foreignKey: 'templateId', as: 'printJobs' });
PrintJob.belongsTo(Template, { foreignKey: 'templateId', as: 'template' });

module.exports = { User, Template, PrintJob };
