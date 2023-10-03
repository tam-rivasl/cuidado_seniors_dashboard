export default async (req: any, res: any) => {
  try {
    const mapedData = { ...req.body, age: parseInt(req.body.age), status: 'active', rolId: 1 };
    console.log(mapedData);
    const apiUrl: string =
      process.env.NEXT_PUBLIC_API_URL + "/user/create" ?? "";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mapedData),
    });

    const data = await response.json();
    res.status(200).json(data);
    console.log('data:', data)
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Error al obtener datos de la API" });
  }
};
