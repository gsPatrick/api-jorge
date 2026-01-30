const TemplateService = require('./template.service');
const path = require('path');

exports.upload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "File is required!" });
        }

        const { name, configJson } = req.body;

        // configJson might be a stringified JSON if coming from form-data
        let parsedConfig = configJson;
        if (typeof configJson === 'string') {
            try {
                parsedConfig = JSON.parse(configJson);
            } catch (e) {
                return res.status(400).send({ message: "Invalid JSON format for configJson" });
            }
        }

        const templateData = {
            name,
            fileName: req.file.filename,
            configJson: parsedConfig,
        };

        const template = await TemplateService.createTemplate(templateData);
        res.status(201).send(template);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getActive = async (req, res) => {
    try {
        const templates = await TemplateService.getActiveTemplates();

        // Optionally transform to include full download URL
        const templatesWithUrl = templates.map(t => {
            const temp = t.toJSON();
            temp.downloadUrl = `/api/templates/${t.id}/download`;
            return temp;
        });

        res.status(200).send(templatesWithUrl);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.download = async (req, res) => {
    try {
        const template = await TemplateService.getTemplateById(req.params.id);
        if (!template) {
            return res.status(404).send({ message: "Template not found" });
        }

        const filePath = path.join(__dirname, '../../../uploads', template.fileName);
        res.download(filePath);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getAssigned = async (req, res) => {
    try {
        const userId = req.userId; // From authJwt
        const user = await require('../../models/User').findByPk(userId);

        if (!user) return res.status(404).send({ message: "User not found" });

        // Fetch assigned templates
        // We need to use the alias defined in associations: 'templates'
        const templates = await user.getTemplates({
            where: { isActive: true },
            joinTableAttributes: [] // Exclude join table data from result if desired
        });

        // Add download URL
        const templatesWithUrl = templates.map(t => {
            const temp = t.toJSON();
            temp.downloadUrl = `/api/templates/${t.id}/download`;
            return temp;
        });

        res.status(200).send(templatesWithUrl);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const template = await TemplateService.getTemplateById(req.params.id);
        if (!template) {
            return res.status(404).send({ message: "Template not found" });
        }
        res.status(200).send(template);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, configJson } = req.body;

        // Find existing template first
        const template = await TemplateService.getTemplateById(id);
        if (!template) {
            return res.status(404).send({ message: "Template not found" });
        }

        const updates = {};
        if (name) updates.name = name;

        if (configJson) {
            let parsedConfig = configJson;
            if (typeof configJson === 'string') {
                try {
                    parsedConfig = JSON.parse(configJson);
                } catch (e) {
                    return res.status(400).send({ message: "Invalid JSON format for configJson" });
                }
            }
            updates.configJson = parsedConfig;
        }

        if (req.file) {
            updates.fileName = req.file.filename;
        }

        await template.update(updates);
        res.status(200).send(template);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const template = await TemplateService.getTemplateById(req.params.id);
        if (!template) {
            return res.status(404).send({ message: "Template not found" });
        }
        await template.destroy(); // Soft delete if paranoid is true, or hard delete
        res.status(200).send({ message: "Template deleted successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
