const router = require('express').Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

router.get('/', auth, notificationController.getAll);
router.get('/unread', auth, notificationController.getUnread);
router.put('/read-all', auth, notificationController.markAllRead);
router.put('/:id/read', auth, notificationController.markRead);

module.exports = router;
