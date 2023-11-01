import NextCors from "nextjs-cors";
import { firestoreDB } from "@/lib/firebaseConnection";

export default async function handler(req, res) {
  try {
    await NextCors(req, res, {
      methods: ["GET"],
      origin: "*",
      optionsSuccessStatus: 200,
    });

    if (req.method !== "GET") {
      return res.status(405).end();
    }

    const usersRef = firestoreDB.collection("users");
    const usersSnapshot = await usersRef.get();

    const promises = [];

    usersSnapshot.forEach(async (userDoc) => {
      const userData = userDoc.data();
      const userEmail = userData.email;

      const placesRef = firestoreDB.collection("places");
      const placesSnapshot = await placesRef
        .where("createdBy", "==", userEmail)
        .get();

      const matchingPlaces = [];
      placesSnapshot.forEach((placeDoc) => {
        const placeData = placeDoc.data();
        matchingPlaces.push({ id: placeDoc.id, ...placeData });
      });

      const updatedUserData = {
        ...userData,
        myPlaces: matchingPlaces,
      };

      const updateUserPromise = userDoc.ref.update(updatedUserData);
      promises.push(updateUserPromise);
    });

    // Esperar a que se completen todas las actualizaciones de usuarios
    await Promise.all(promises);

    return res
      .status(200)
      .json({ message: "Operación completada para todos los usuarios." });
  } catch (error) {
    console.error("Error en el manejador:", error);
    return res.status(500).json({ error: "Ocurrió un error en el servidor." });
  }
}
