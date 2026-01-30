const User = require('../../models/User');
const Template = require('../../models/Template');

exports.getStats = async (req, res) => {
    try {
        const totalPhotographers = await User.count({ where: { role: 'photographer' } });
        const totalTemplates = await Template.count({ where: { isActive: true } });

        // Mock data for charts since we don't have a "PrintJob" model yet
        // In a real scenario, we would count daily prints here.
        const printActivity = [
            { name: 'Seg', prints: 12 },
            { name: 'Ter', prints: 19 },
            { name: 'Qua', prints: 3 },
            { name: 'Qui', prints: 5 },
            { name: 'Sex', prints: 20 },
            { name: 'Sab', prints: 30 },
            { name: 'Dom', prints: 15 },
        ];

        res.status(200).send({
            cards: {
                photographers: totalPhotographers,
                activeTemplates: totalTemplates,
                totalPrints: 12450, // Mock for now
                activeEvents: 3 // Mock
            },
            charts: {
                activity: printActivity
            }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
