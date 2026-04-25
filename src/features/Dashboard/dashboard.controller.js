const User = require('../../models/User');
const Template = require('../../models/Template');
const PrintJobService = require('../PrintJob/printjob.service');

exports.getStats = async (req, res) => {
    try {
        const totalPhotographers = await User.count({ where: { role: 'photographer' } });
        const totalTemplates = await Template.count({ where: { isActive: true } });
        const totalPrints = await PrintJobService.getTotalCount();
        const printActivity = await PrintJobService.getWeeklyActivity();

        res.status(200).send({
            cards: {
                photographers: totalPhotographers,
                activeTemplates: totalTemplates,
                totalPrints,
                activeEvents: 0, // Future feature
            },
            charts: {
                activity: printActivity,
            }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
