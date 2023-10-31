import NextCors from "nextjs-cors";
import { firestoreDB } from "@/lib/firebaseConnection";
import { algoliaDB } from "@/lib/algoliaConnection";

export default async function handler(req, res) {
  try {
    await NextCors(req, res, {
      methods: ["PUT"],
      origin: "*", // Debes configurar esto adecuadamente para tu aplicación en producción
      optionsSuccessStatus: 200,
    });

    // Verificar que no sea otro método diferente al de PUT
    if (req.method !== "PUT") {
      return res.status(405).end();
    }

    // Obtener todos los documentos de Firestore
    const firestoreSnapshot = await firestoreDB.collection("places").get();

    // Preparar los datos para enviar a Algolia
    const records = [];
    firestoreSnapshot.forEach((doc) => {
      const data = doc.data();
      // Añadir el objeto que se enviará a Algolia
      records.push({
        objectID: doc.id, // Utiliza el ID del documento como objectID en Algolia
        ...data,
      });
    });

    // Actualizar en Algolia
    await algoliaDB.saveObjects(records);

    return res.json({
      success: true,
      message: `Se han sincronizado ${records.length} documentos con Algolia.`,
    });
  } catch (error) {
    console.error("Error en el manejador:", error);
    return res.status(500).json({ error: "Ocurrió un error en el servidor." });
  }
}
