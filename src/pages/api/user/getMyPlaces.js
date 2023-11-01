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

    const { userId } = req.query;
    const userRef = firestoreDB.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res
        .status(400)
        .json({ error: "No se encontró información del usuario." });
    }

    const userData = userDoc.data();
    const userEmail = userData.email; // Suponiendo que el email está almacenado en el campo 'email'

    if (userData) {
      const placesRef = firestoreDB.collection("places");
      const placesSnapshot = await placesRef
        .where("createdBy", "==", userEmail)
        .get();

      const matchingPlaces = [];
      placesSnapshot.forEach((placeDoc) => {
        const placeData = placeDoc.data();
        matchingPlaces.push({ id: placeDoc.id, ...placeData });
      });

      // Actualizar el campo myPlaces en los datos del usuario
      const updatedUserData = {
        ...userData,
        myPlaces: matchingPlaces,
      };

      // Actualizar el documento del usuario con los lugares encontrados
      await userRef.update(updatedUserData);

      return res.status(200).json({ userMatchingPlaces: matchingPlaces });
    } else {
      return res
        .status(400)
        .json({ error: "No se encontró información del usuario." });
    }
  } catch (error) {
    console.error("Error en el manejador:", error);
    return res.status(500).json({ error: "Ocurrió un error en el servidor." });
  }
}
