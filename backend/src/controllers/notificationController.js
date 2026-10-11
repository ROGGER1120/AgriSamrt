import { Notification } from '../models/Notification.js';

// @desc Get notifications with optional type filter
// @route GET /api/notifications
export const getNotifications = async (req, res) => {
  try {
    const { type, limit = 50 } = req.query;
    const filter = { isActive: true };

    if (type && type !== 'all') {
      filter.type = type;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    const userId = req.user?._id;
    const unreadCount = userId
      ? await Notification.countDocuments({
          isActive: true,
          readBy: { $ne: userId },
        })
      : notifications.length;

    res.json({
      success: true,
      unreadCount,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create a notification (Admin)
// @route POST /api/notifications
export const createNotification = async (req, res) => {
  try {
    const { title, message, type, priority, crop, market, iconType, actionUrl } = req.body;

    if (!title || !message || !type) {
      return res.status(400).json({ success: false, message: 'Please provide title, message and type' });
    }

    const notification = await Notification.create({
      title,
      message,
      type,
      priority: priority || 'medium',
      crop,
      market,
      iconType: iconType || 'bell',
      actionUrl,
    });

    res.status(201).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Mark a notification as read
// @route PUT /api/notifications/:id/read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (userId) {
      await Notification.findByIdAndUpdate(id, {
        $addToSet: { readBy: userId },
      });
    }

    res.json({ success: true, message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Mark all notifications as read for current user
// @route PUT /api/notifications/read-all
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (userId) {
      await Notification.updateMany(
        { isActive: true },
        { $addToSet: { readBy: userId } }
      );
    }

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
