import NotificationService from "../services/NotificationService.js";

class NotificationController {
  static async list(req, res) {
    try {
      const usuario_id = req.user.id;
      const notifications =
        await NotificationService.getUserNotifications(usuario_id);
      res.status(200).json(notifications);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const notification = await NotificationService.markNotificationAsRead(id);
      res.status(200).json(notification);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default NotificationController;
