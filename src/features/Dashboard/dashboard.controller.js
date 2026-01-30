const User = require('../../models/User');
const Template = require('../../models/Template');

exports.getStats = async (req, res) => {
    try {
        const totalPhotographers = await User.count({ where: { role: 'photographer' } });
        const totalTemplates = await Template.count({ where: { isActive: true } });

        // Mock data for charts since we don't have a "PrintJob" model yet
        // In a real scenario, we would count daily prints here.
        // Mock data structure zeroed out until real models exist
        const printActivity = [
            { name: 'Seg', prints: 0 },
            { name: 'Ter', prints: 0 },
            { name: 'Qua', prints: 0 },
            { name: 'Qui', prints: 0 },
            { name: 'Sex', prints: 0 },
            { name: 'Sab', prints: 0 },
            { name: 'Dom', prints: 0 },
        ];

        res.status(200).send({
            cards: {
                photographers: totalPhotographers,
                activeTemplates: totalTemplates,
                totalPrints: 0,
                activeEvents: 0
            },
            charts: {
                activity: printActivity
            }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
