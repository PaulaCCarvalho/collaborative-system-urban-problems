import NotificationRepository from "../repositories/NotificationRepository.js";
import UserRepository from "../repositories/UserRepository.js";

class NotificationService {
  static async notifyPublicUsers({ tipo, assunto, ocorrencia_id, autor_id }) {
    const publicUsers = await UserRepository.findByTypeExcludingUser(
      "publico",
      autor_id
    );

    for (const user of publicUsers) {
      await NotificationRepository.create({
        tipo,
        assunto,
        ocorrencia_id,
        usuario_id: user.id,
      });
    }
  }

  static async notifyUser({ usuario_id, tipo, assunto, ocorrencia_id }) {
    await NotificationRepository.create({
      tipo,
      assunto,
      ocorrencia_id,
      usuario_id,
    });
  }

  static async getUserNotifications(usuario_id) {
    return await NotificationRepository.findByUser(usuario_id);
  }

  static async markNotificationAsRead(id) {
    return await NotificationRepository.markAsRead(id);
  }
}

export default NotificationService;
