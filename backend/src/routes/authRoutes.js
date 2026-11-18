const router = require('express').Router();
const c = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register/start', c.startRegistration);
router.post('/register/verify', c.verifyRegistration);
router.post('/login', c.login);
router.post('/password/forgot', c.startPasswordReset);
router.post('/password/verify', c.verifyPasswordReset);
router.post('/password/reset', c.resetPassword);
router.get('/me', protect, c.me);

module.exports = router;
