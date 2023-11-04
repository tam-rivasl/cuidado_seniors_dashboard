export default async (req: any, res: any) => {
  try {
    const mapedData = { ...req.body };
    console.log(mapedData);
    const apiUrl: string =
      process.env.NEXT_PUBLIC_API_URL + "/appointment/assign/appointment";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mapedData),
    });

    if (response.ok) {
      const data = await response.json();
      res.status(200).json(data);
      console.log("data:", data);
    } else {
      const errorResponse = await response.json();
      res.status(response.status).json(errorResponse);
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Error al obtener datos de la API" });
  }
};
