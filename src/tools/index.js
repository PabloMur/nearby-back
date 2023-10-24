import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secret = process.env.TOKEN_SECRET;

export async function hashPassword(password) {
  try {
    const saltRounds = 10; // Número de rondas de salto para el hash (recomendado: 10)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error(
      "Error al generar el hash de la contraseña: " + error.message
    );
  }
}

export async function comparePasswords(passwordUser, passwordBD) {
  try {
    // const hashPasswordUser = await hashPassword(passwordUser);
    // console.log(hashPasswordUser);
    // console.log(passwordBD);
    // const passwordsMatch = await bcrypt.compare(hashPasswordUser, passwordBD);
    // console.log(passwordsMatch);
    // return passwordsMatch;
    return passwordUser == passwordBD;
  } catch (error) {
    throw new Error("Error al comparar contraseñas: " + error.message);
  }
}

export function generateToken(objeto) {
  const token = jwt.sign(objeto, secret);
  return token;
}

export function decodeToken(token) {
  const decoded = jwt.decode(token, secret);
  return decoded;
}

export function verifyToken(token) {
  const verify = jwt.verify(token, secret);
  return verify;
}
