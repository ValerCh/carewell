const Role = require('../models').Role;
const RoleValidation = require('../validations/role');

module.exports = {
    async create(req, res) {
        try {
            const {fields, logData} = req.body;
            // const fields = req.body;

            let { errors, isValid } = RoleValidation.validateCreateInput(fields);
            if (!isValid) {
                return res.json({ success: false, errors: errors });
            }
          
            let role = await Role.findOne({role_internal_name: fields.role_internal_name});
            if (role) {
                return res.json({ success: false, errors:  { internal_name: "Internal name exist" } });
            }
          
            role = await Role.findOne({role_display_name: fields.role_display_name});
            if (role) {
                return res.json({ success: false, errors:  { role_display_name: "Display name exist" } });
            }

            let newRole = await Role.create(fields);
            
            res.json({ success: true, role: newRole });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Create role error" } });
        }
    },
};