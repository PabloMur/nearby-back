import { firestoreDB } from "@/lib/firebaseConnection";
import { hashPassword, generateToken } from "@/tools";

export class AuthModel {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }
  //Metodo que nos va a permitir en el futuro crear un auth en la base de datoss
  static async createAuth(email, password) {
    const hashedPassword = await hashPassword(password);
    const newAuth = new AuthModel(email, hashedPassword);

    try {
      // la referencia a la coleccion que queremos modificar
      const docRef = await firestoreDB.collection("auth").add({
        email: newAuth.email,
        password: newAuth.password,
      });

      return { newAuth, id: docRef.id };
    } catch (error) {
      console.error("Error creating auth:", error);
      throw error;
    }
  }

  static async deleteAuth(idAuth) {
    try {
      const deletedUser = await firestoreDB
        .collection("auth")
        .doc(idAuth)
        .delete();

      return deletedUser;
    } catch (error) {
      console.error("Error Delete auth:", error);
      throw error;
    }
  }

  static async updateAuth(idAuth, updateData) {
    try {
      const refData = firestoreDB.collection("auth").doc(idAuth);
      const updateUser = await refData.update(updateData);

      return updateUser;
    } catch (error) {
      console.error("Error Update auth:", error);
      throw error;
    }
  }

  static async checkAuthExists(idAuth) {
    try {
      const refData = await firestoreDB.collection("users").doc(idAuth).get();
      const authExists = refData.exists;

      return authExists;
    } catch (error) {
      console.error("Error Update auth:", error);
      throw error;
    }
  }

  static generateAuthToken(object) {
    try {
      const token = generateToken(object);
      return token;
    } catch (error) {
      console.error("Error Update token:", error);
      throw error;
    }
  }
}
