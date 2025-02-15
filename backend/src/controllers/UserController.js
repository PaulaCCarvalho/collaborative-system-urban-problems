import UserService from "../services/UserService.js";

class UserController {
  static async signUp(req, res) {
    try {
      const userData = req.body;
      await UserService.signUp(userData);
      return res.status(201).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const token = await UserService.login(req.body);
      res.json({ token });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

export default UserController;
