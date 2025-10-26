const express = require('express');
const {
    register,
    login,
    getMe,
    updateDetails,
    updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { userValidationRules, validate } = require('../middleware/validation');

const router = express.Router();

router.post('/register', userValidationRules(), validate, register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;