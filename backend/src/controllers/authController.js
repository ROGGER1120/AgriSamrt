import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'agrismart_super_secret_jwt_key_2026_crop_harvest', {
    expiresIn: '30d',
  });
};

// @desc Register user (Farmer or Admin)
// @route POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, state, district, favoriteCrops, securityQuestion, securityAnswer } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role === 'admin' ? 'admin' : 'farmer',
      phone: phone || '',
      state: state || 'Maharashtra',
      district: district || 'Nashik',
      favoriteCrops: Array.isArray(favoriteCrops) && favoriteCrops.length > 0 ? favoriteCrops : ['Wheat', 'Tomato', 'Onion'],
      securityQuestion: securityQuestion || 'What is your primary crop?',
      securityAnswer: (securityAnswer || 'wheat').toLowerCase(),
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        state: user.state,
        district: user.district,
        favoriteCrops: user.favoriteCrops,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        state: user.state,
        district: user.district,
        favoriteCrops: user.favoriteCrops,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get current user profile
// @route GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Toggle or update favorite crops
// @route PUT /api/auth/favorites
export const updateFavorites = async (req, res) => {
  try {
    const { favoriteCrops, cropToToggle } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (cropToToggle) {
      const index = user.favoriteCrops.indexOf(cropToToggle);
      if (index > -1) {
        user.favoriteCrops.splice(index, 1);
      } else {
        user.favoriteCrops.push(cropToToggle);
      }
    } else if (Array.isArray(favoriteCrops)) {
      user.favoriteCrops = favoriteCrops;
    }

    await user.save();
    res.json({ success: true, favoriteCrops: user.favoriteCrops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Forgot password security check
// @route POST /api/auth/forgot-password-check
export const forgotPasswordCheck = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account registered with this email' });
    }

    res.json({
      success: true,
      securityQuestion: user.securityQuestion || 'What is your primary crop?',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Reset password with security answer
// @route POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (securityAnswer && user.securityAnswer) {
      if (user.securityAnswer.toLowerCase().trim() !== securityAnswer.toLowerCase().trim()) {
        return res.status(400).json({ success: false, message: 'Incorrect answer to security question' });
      }
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully! You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
