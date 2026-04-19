const router = require('express').Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { allow } = require('../middleware/rbac');

router.use(auth, allow('ADMIN'));

router.get('/users', adminController.getAllUsers);
router.put('/users/:id/status', adminController.setUserStatus);
router.put('/users/:id/verify-doctor', adminController.verifyDoctor);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
