const router = require('express').Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');
const { allow } = require('../middleware/rbac');
const upload = require('../middleware/upload');

router.post('/', auth, allow('PATIENT'), upload.single('file'), reportController.upload);
router.get('/', auth, allow('PATIENT'), reportController.getMyReports);
router.get('/all', auth, allow('ADMIN'), reportController.getAllReports);
router.get('/patients/all', auth, allow('DOCTOR', 'ADMIN'), reportController.getAllPatientsReports);
router.get('/patient/:patientProfileId', auth, allow('DOCTOR', 'ADMIN'), reportController.getPatientReports);
router.get('/:id', auth, reportController.getReport);

module.exports = router;
