import NextCors from "nextjs-cors";
import { firestoreDB } from "@/lib/firebaseConnection";

export default async function handler(req, res) {
  try {
    await NextCors(req, res, {
      methods: ["GET"],
      origin: "*",
      optionsSuccessStatus: 200,
    });

    // Verificar que no sea otro método diferente al de GET
    if (req.method !== "GET") {
      return res.status(405).end();
    }

    const { userId } = req.query;
    const userRef = firestoreDB.collection("users").doc(userId);
    const userData = (await userRef.get()).data();
    const favoritePlaces = userData.favorites;
    const detailedFavoritePlaces = [];

    if (userData) {
      // Verificar si existen lugares favoritos
      if (favoritePlaces && favoritePlaces.length > 0) {
        // Array para almacenar la información detallada de los lugares favoritos

        // Iterar sobre las IDs de los lugares favoritos y obtener la información detallada
        for (const placeId of favoritePlaces) {
          const placeRef = firestoreDB.collection("places").doc(placeId);
          const placeData = (await placeRef.get()).data();

          // Si se encontró información, agregarla al array
          if (placeData) {
            const newPlaceData = { ...placeData, placeId };
            detailedFavoritePlaces.push(newPlaceData);
          }
        }

        // Devolver la información detallada de los lugares favoritos
        return res.status(200).json({ userFavorites: detailedFavoritePlaces });
      } else {
        return res.status(200).json({ userFavorites: [] }); // No hay lugares favoritos
      }
    } else {
      return res
        .status(400)
        .json({ error: `No se encontró información del usuario.` });
    }
  } catch (error) {
    console.error("Error en el manejador:", error);
    return res.status(500).json({ error: "Ocurrió un error en el servidor." });
  }
}
