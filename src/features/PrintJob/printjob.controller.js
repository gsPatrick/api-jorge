const PrintJobService = require('./printjob.service');

exports.create = async (req, res) => {
    try {
        const { templateId, status, printMode } = req.body;
        const userId = req.userId; // From JWT middleware

        if (!templateId || !printMode) {
            return res.status(400).send({ message: 'templateId and printMode are required.' });
        }

        const printJob = await PrintJobService.create({
            userId,
            templateId,
            status: status || 'success',
            printMode,
        });

        res.status(201).send(printJob);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getMyPrints = async (req, res) => {
    try {
        const userId = req.userId;
        const prints = await PrintJobService.getByUser(userId);
        res.status(200).send(prints);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
