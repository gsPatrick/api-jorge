const UserService = require('./user.service');

exports.create = async (req, res) => {
    try {
        const user = await UserService.createUser(req.body);
        res.status(201).send(user);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const user = await UserService.updateStatus(req.params.id, req.body.isActive);
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await UserService.deleteUser(req.params.id);
        res.status(200).send({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const user = await UserService.updateUser(req.params.id, req.body);
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.assignTemplates = async (req, res) => {
    try {
        // Expects { templateIds: [] }
        const user = await UserService.assignTemplates(req.params.id, req.body.templateIds);
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
