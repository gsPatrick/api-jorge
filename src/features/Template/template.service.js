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

    async getAllTemplates() {
        return await Template.findAll({
            order: [['createdAt', 'DESC']]
        });
    }

    async getTemplateById(id) {
        return await Template.findByPk(id);
    }

    async duplicateTemplate(id) {
        const original = await Template.findByPk(id);
        if (!original) throw new Error("Template not found");

        const newData = {
            name: `${original.name} (Cópia)`,
            fileName: original.fileName,
            overlayFileName: original.overlayFileName,
            configJson: original.configJson,
            isActive: true
        };

        return await Template.create(newData);
    }
}

module.exports = new TemplateService();
