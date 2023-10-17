import { firestoreDB } from "@/lib/firebaseConnection";
export class AuthModel {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }
  //Metodo que nos va a permitir en el futuro crear un auth en la base de datoss
  static async createAuth(email, password) {
    const newUser = new AuthModel(email, name, phone);

    try {
      // la referencia a la coleccion que queremos modificar
      const docRef = await firestoreDB.collection("users").add({
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
      });

      const userId = docRef.id;
      const userCreated = new UserModel(
        newUser.email,
        newUser.name,
        newUser.phone
      );

      const response = {
        userId,
        userCreated,
      };

      return response;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  static async deleteAuth(idUser) {
    try {
      const deletedUser = await firestoreDB
        .collection("users")
        .doc(idUser)
        .delete();

      return deletedUser;
    } catch (error) {
      console.error("Error Delete user:", error);
      throw error;
    }
  }

  static async updateAuth(idUser, updateData) {
    try {
      const refData = firestoreDB.collection("users").doc(idUser);
      const updateUser = await refData.update(updateData);

      return updateUser;
    } catch (error) {
      console.error("Error Update user:", error);
      throw error;
    }
  }

  static async checkAuthExists(idUser, updateData) {
    try {
      const refData = firestoreDB.collection("users").doc(idUser);
      const updateUser = await refData.update(updateData);

      return updateUser;
    } catch (error) {
      console.error("Error Update user:", error);
      throw error;
    }
  }

  static async generateToken(idUser, updateData) {
    try {
      const refData = firestoreDB.collection("users").doc(idUser);
      const updateUser = await refData.update(updateData);

      return updateUser;
    } catch (error) {
      console.error("Error Update user:", error);
      throw error;
    }
  }
}
