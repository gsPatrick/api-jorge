const { Op, fn, col, literal } = require('sequelize');
const PrintJob = require('../../models/PrintJob');
const User = require('../../models/User');
const Template = require('../../models/Template');

class PrintJobService {
    async create(data) {
        return await PrintJob.create(data);
    }

    async getByUser(userId) {
        return await PrintJob.findAll({
            where: { userId },
            include: [{ model: Template, as: 'template', attributes: ['id', 'name'] }],
            order: [['createdAt', 'DESC']],
            limit: 100,
        });
    }

    async getTotalCount() {
        return await PrintJob.count({ where: { status: 'success' } });
    }

    async getWeeklyActivity() {
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

        // Get prints from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const prints = await PrintJob.findAll({
            where: {
                status: 'success',
                createdAt: { [Op.gte]: sevenDaysAgo },
            },
            attributes: [
                [fn('EXTRACT', literal("DOW FROM \"createdAt\"")), 'dayOfWeek'],
                [fn('COUNT', col('id')), 'count'],
            ],
            group: [fn('EXTRACT', literal("DOW FROM \"createdAt\""))],
            raw: true,
        });

        // Build activity array for all 7 days (Mon-Sun)
        const dayOrder = [1, 2, 3, 4, 5, 6, 0]; // Mon to Sun
        const activity = dayOrder.map(dayNum => {
            const found = prints.find(p => parseInt(p.dayOfWeek) === dayNum);
            return {
                name: dayNames[dayNum],
                prints: found ? parseInt(found.count) : 0,
            };
        });

        return activity;
    }

    async getPhotographerRanking(from, to) {
        const where = { status: 'success' };

        if (from || to) {
            where.createdAt = {};
            if (from) where.createdAt[Op.gte] = new Date(from);
            if (to) where.createdAt[Op.lte] = new Date(to + 'T23:59:59');
        }

        const ranking = await PrintJob.findAll({
            where,
            attributes: [
                'userId',
                [fn('COUNT', col('PrintJob.id')), 'totalPrints'],
                [fn('MAX', col('PrintJob.createdAt')), 'lastPrint'],
            ],
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email'],
            }],
            group: ['userId', 'user.id'],
            order: [[fn('COUNT', col('PrintJob.id')), 'DESC']],
            raw: true,
            nest: true,
        });

        return ranking;
    }
}

module.exports = new PrintJobService();
