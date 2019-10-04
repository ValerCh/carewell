const Patient = require('../models').Patient;
const PatientValidation = require('../validations/patient');
const AuthHelper = require('../helpers/auth');

module.exports = {
    async create(req, res) {
        try {
            const {fields, logData} = req.body;
            // const fields = req.body;
            let currentUser = AuthHelper.currentUser(req, res);
            let { errors, isValid } = PatientValidation.validateCreateInput(fields);
            if (!isValid) {
                return res.json({ success: false, errors: errors });
            }

            let patient = await Patient.findOne({email1: fields.email1});
            if (patient) {
                return res.json({ success: false, errors:  { email: "Email already exists" } });
            }
            fields.org_id = currentUser.org_id;
            let newPatient = await Patient.create(fields);
            
            res.json({ success: true, patient: newPatient });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Create patient error" } });
        }
    },
    async getList(req, res) {
        try {
            const {fields, logData} = req.body;
            
            let patientList = await Patient.find();
            if (!patientList) {
                return res.json({ success: false, errors:  { error: "DB error" } });
            }
            
            res.json({ success: true, patientList: patientList });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Get patient list error" } });
        }
    },
};