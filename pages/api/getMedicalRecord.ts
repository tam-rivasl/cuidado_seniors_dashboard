export default async (req: any, res: any) => {
    try {
      const apiUrl: string =
        process.env.NEXT_PUBLIC_API_URL + "/medical-record/" + req.body.patientId;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData, "response");
        throw new Error(errorData.message || "Error al obtener datos de la API");
      }
  
      const data = await response.json();
  
      res.status(200).json(data);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: error.message || "Error al obtener datos de la API" });
    }
  };
  