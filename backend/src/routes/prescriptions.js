const router = require('express').Router();
const prescriptionController = require('../controllers/prescriptionController');
const auth = require('../middleware/auth');
const { allow } = require('../middleware/rbac');

router.post('/', auth, allow('DOCTOR'), prescriptionController.create);
router.get('/', auth, allow('PATIENT', 'DOCTOR'), prescriptionController.getMyPrescriptions);
router.get('/:id', auth, prescriptionController.getPrescription);
router.post('/:id/medications', auth, allow('DOCTOR'), prescriptionController.addMedication);

module.exports = router;
