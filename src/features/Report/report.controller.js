const PrintJobService = require('../PrintJob/printjob.service');

exports.getPhotographerRanking = async (req, res) => {
    try {
        const { from, to } = req.query;
        const ranking = await PrintJobService.getPhotographerRanking(from, to);
        res.status(200).send(ranking);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
