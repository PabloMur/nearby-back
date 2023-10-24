import NextCors from "nextjs-cors";
import { firestoreDB } from "@/lib/firebaseConnection";

export default async function handler(req, res) {
  try {
    await NextCors(req, res, {
      methods: ["POST"],
      origin: "*", // Debes configurar esto adecuadamente para tu aplicación en producción
      optionsSuccessStatus: 200,
    });

    //? Verificar que no sea otro metodo diferente al de POST (Crear)
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "metodo incorrecto",
      });
    }

    const {
      category,
      ratings,
      createdBy,
      comments,
      description,
      imageUrl,
      latitude,
      longitude,
      placeName,
      socialNetworks,
      website,
      zone,
      stars,
    } = req.body; //? Obtener el nombre, email de "req" con el body

    //? Para poder crear un usuario, el nombre y el email, son obligatorios asi que se verifican primero

    if (
      !description ||
      !imageUrl ||
      !latitude ||
      !longitude ||
      !placeName ||
      !zone
    ) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    } else {
      const finalCategory = category ? category : "otro";
      const finalWebsite = website ? website : "";

      const newPlace = await firestoreDB.collection("places").add({
        category: finalCategory,
        ratings: 0,
        createdBy,
        comments: [],
        description,
        imageUrl, //resolver a futuro
        latitude,
        longitude,
        placeName,
        socialNetworks,
        website: finalWebsite,
        zone,
        stars: 0,
      });
      return res.json({ placeCreated: newPlace });
    }
  } catch (error) {
    console.error("Error en el manejador:", error);
    return res.status(500).json({ error: "Ocurrió un error en el servidor." });
  }
}
