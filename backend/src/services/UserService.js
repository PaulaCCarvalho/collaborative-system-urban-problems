import bcrypt from "bcrypt";
import { LoginSchema, UserSchema } from "../models/UserModel.js";
import UserRepository from "../repositories/UserRepository.js";
import jwt from "jsonwebtoken";

class UserService {
  static async signUp(userData) {
    const { error } = UserSchema.validateAsync(userData);
    if (error) throw new Error(error.details[0].message);

    const existingUser = await UserRepository.findUserByEmail(userData.email);

    if (existingUser) throw new Error("Email já cadastrado");

    const passwordHash = await bcrypt.hash(userData.senha, 10);

    return UserRepository.createUser({
      ...userData,
      senha: passwordHash,
    });
  }

  static async login(userData) {
    const { error } = LoginSchema.validateAsync(userData);
    if (error) throw new Error(error.details[0].message);

    const user = await UserRepository.findUserByEmail(userData.email);

    if (!user) throw new Error("Usuário não cadastrado");

    const isValid = await bcrypt.compare(userData.senha, user.senha);

    if (!isValid) {
      throw new Error("Credenciais inválidas");
    }

    return this.generateToken(user);
  }

  static generateToken(user) {
    return jwt.sign(
      { id: user.id, nome: user.nome, tipo: user.tipo, status: user.status },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }
}

export default UserService;
