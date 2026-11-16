const router = require('express').Router();
const c = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// own account
router.put('/me', c.updateMe);
router.put('/me/password', c.changePassword);

// admin: manage users (keep /stats and /me above /:id)
router.get('/', authorize('Admin'), c.listUsers);
router.get('/stats', authorize('Admin'), c.userStats);
router.get('/:id', authorize('Admin'), c.getUser);
router.put('/:id', authorize('Admin'), c.updateUser);
router.delete('/:id', authorize('Admin'), c.deleteUser);

module.exports = router;
