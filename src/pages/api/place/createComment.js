import NextCors from "nextjs-cors";
import { firestoreDB } from "@/lib/firebaseConnection";

export default async function handler(req, res) {
    try {
        await NextCors(req, res, {
            methods: ["POST"],
            origin: "*", // Debes configurar esto adecuadamente para tu aplicación en producción
            optionsSuccessStatus: 200,
        });

        // Verificar que no sea otro método diferente al de POST (Crear)
        if (req.method !== "POST") {
            return res.status(405).end();
        }

        const { comment } = req.body; // Obtener los datos de "req" desde el cuerpo de la solicitud
        const { placeId, userId } = req.query;

        // Obteniendo la referencia del lugar
        const refPlace = firestoreDB.collection("places").doc(placeId);
        const placeDoc = await refPlace.get();
        
        // Obtener la referencia del usuario
        const refUser = firestoreDB.collection("users").doc(userId);
        const userDoc = await refUser.get();
        const userData = userDoc.data();

        if (placeDoc.exists) {
            const placeData = placeDoc.data();

            // Agregar el comentario al lugar
            if (!placeData.comments) {
                placeData.comments = [];
            }
            // comment.name = userData.name; 
            const newComment = {
                ...comment,
                name: userData.name
            }
            placeData.comments.push(newComment);
            
            // Actualizar el lugar con el nuevo comentario
            await refPlace.update(placeData);
        } else {
            console.log("El documento de lugar no existe.");
        }


        if (userDoc.exists) {
            // Agregar el comentario al usuario
            if (!userData.comments) {
                userData.comments = [];
            }
            comment.idPlace=placeId;
            userData.comments.push(comment);

            // Actualizar el usuario con el nuevo comentario
            await refUser.update(userData);
        } else {
            console.log("El documento de usuario no existe.");
        }

        return res.json({ success: true, message: "Comentario guardado con éxito." });

    } catch (error) {
        console.error("Error en el manejador:", error);
        return res.status(500).json({ error: "Ocurrió un error en el servidor." });
    }
}
