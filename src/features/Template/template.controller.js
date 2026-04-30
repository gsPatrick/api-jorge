const TemplateService = require('./template.service');
const path = require('path');

exports.upload = async (req, res) => {
    try {
        if (!req.files || !req.files['file']) {
            return res.status(400).send({ message: "Background file is required!" });
        }

        const backgroundFile = req.files['file'][0];
        const overlayFile = req.files['overlayFile'] ? req.files['overlayFile'][0] : null;

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
            fileName: backgroundFile.filename,
            overlayFileName: overlayFile ? overlayFile.filename : null,
            configJson: parsedConfig,
        };

        const template = await TemplateService.createTemplate(templateData);
        res.status(201).send(template);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const templates = await TemplateService.getAllTemplates();
        const templatesWithUrl = templates.map(t => {
            const temp = t.toJSON();
            temp.downloadUrl = `/api/templates/${t.id}/download`;
            if (t.overlayFileName) {
                temp.overlayDownloadUrl = `/api/templates/${t.id}/download?type=overlay`;
            }
            return temp;
        });
        res.status(200).send(templatesWithUrl);
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
            if (t.overlayFileName) {
                temp.overlayDownloadUrl = `/api/templates/${t.id}/download?type=overlay`;
            }
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

        const isOverlay = req.query.type === 'overlay';
        const fileName = isOverlay ? template.overlayFileName : template.fileName;

        if (isOverlay && !fileName) {
            return res.status(404).send({ message: "Overlay not found for this template" });
        }

        const filePath = path.join(__dirname, '../../../uploads', fileName);
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
            if (t.overlayFileName) {
                temp.overlayDownloadUrl = `/api/templates/${t.id}/download?type=overlay`;
            }
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
            
            // Handle explicit removal of overlay
            if (parsedConfig.removeOverlay) {
                updates.overlayFileName = null;
            }
        }

        if (req.files) {
            if (req.files['file']) {
                updates.fileName = req.files['file'][0].filename;
            }
            if (req.files['overlayFile']) {
                updates.overlayFileName = req.files['overlayFile'][0].filename;
            }
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

exports.toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const template = await TemplateService.getTemplateById(id);
        if (!template) {
            return res.status(404).send({ message: "Template not found" });
        }
        await template.update({ isActive });
        res.status(200).send(template);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.duplicate = async (req, res) => {
    try {
        const { id } = req.params;
        const newTemplate = await TemplateService.duplicateTemplate(id);
        res.status(201).send(newTemplate);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
