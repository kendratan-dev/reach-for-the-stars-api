const { Router } = require('express');
const { User } = require('../models');
const { requireUser } = require('../middlewares/require-user');
const validate = require('../middlewares/validate');
const { body, param } = require('express-validator');
const { conflict, notFound } = require('../errors/app-error');

const router = Router();

// Admin guard for all user management routes
router.use(requireUser('ADMIN'));

router.get('/', async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['password_hash'] } });
  res.status(200).json({ data: users });
});

router.patch('/:id/role',
  [
    param('id').isInt({ min: 1 }).toInt(),
    body('role').isIn(['PLAYER', 'HOST', 'ADMIN']).withMessage('Invalid role')
  ],
  validate,
  async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) throw notFound('USER_NOT_FOUND', 'User not found.');

    // Prevent an admin from changing their own role
    if (user.user_id === req.user.user_id) {
      throw conflict('CANNOT_CHANGE_OWN_ROLE', 'You cannot change your own role.');
    }

    user.role = req.body.role;
    await user.save();

    res.status(200).json({ user: { id: user.user_id, role: user.role } });
  }
);

module.exports = router;