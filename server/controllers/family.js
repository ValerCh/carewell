const Family = require('../models').Family;
const FamilyValidation = require('../validations/family');
const AuthHelper = require('../helpers/auth');

module.exports = {
    async create(req, res) {
        try {
            const {fields, logData} = req.body;

            let currentUser = AuthHelper.currentUser(req, res);
            let { errors, isValid } = FamilyValidation.validateCreateInput(fields);
            if (!isValid) {
                return res.json({ success: false, errors: errors });
            }
            fields.org_id = currentUser.org_id;
            let newFamily = await Family.create(fields);
            
            res.json({ success: true, family: newFamily });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Create family error" } });
        }
    },

    async getFamilyByUserId(req, res) {
        try {
            const {fields, logData} = req.body;

            let family = await Family.findOne(fields);
            if (!family) {
                return res.json({ success: false, errors: { error: "Family does not exist" } });
            }
            
            res.json({ success: true, family: family });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "get family error" } });
        }
    },

    async updateFamily(req, res) {
        try {
            const {fields, logData} = req.body;

            let family = await Family.findById(fields.id);
            if (!family) {
                return res.json({ success: false, errors: { error: "Family does not exist" } });
            }
            
            result = await family.updateOne(fields);
            
            res.json({ success: true, result: result });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Update family error" } });
        }
    },
};