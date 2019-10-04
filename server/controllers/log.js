const Log = require('../models').Log;
const LogValidation = require('../validations/log');

module.exports = {
    async create(req, res) {
        try {
            const {fields, logData} = req.body;

            let { errors, isValid } = LogValidation.validateCreateInput(fields);
            if (!isValid) {
                return res.json({ success: false, errors: errors });
            }
        
            let newLog = await Log.create(fields);
            
            res.json({ success: true, log: newLog });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Create log error" } });
        }
    },
};