export default async (req: any, res: any) => {
  try {
    const mapedData = { ...req.body, nurse: 1   };
    console.log(mapedData);
    const apiUrl: string =
      process.env.NEXT_PUBLIC_API_URL + `/appointment/nurseId/1/planServiceId/${mapedData.plan_service}`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mapedData),
    });

    const data = await response.json();
    res.status(200).json(data);
    console.log("data:", data);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Error al obtener datos de la API" });
  }
};
