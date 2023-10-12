import NextCors from "nextjs-cors";
export default async function handler(req, res) {
  try {
    await NextCors(req, res, {
      // Options
      methods: ["POST"],
      origin: "*",
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    res.status(200).json({ name: "John Doe" });
  } catch (error) {}
}
