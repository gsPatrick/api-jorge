const AuthService = require('./auth.service');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "Email and password are required!" });
        }

        const data = await AuthService.login(email, password);
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
