const Template = require('../../models/Template');

class TemplateService {
    async createTemplate(templateData) {
        return await Template.create(templateData);
    }

    async getActiveTemplates() {
        return await Template.findAll({
            where: { isActive: true }
        });
    }

    async getTemplateById(id) {
        return await Template.findByPk(id);
    }
}

module.exports = new TemplateService();
