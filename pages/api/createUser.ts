export default async (req: any, res: any) => {
  try {
    const mapedData = { ...req.body, age: parseInt(req.body.age), rolId: req.body.nurseConfirmation ? 1 : 2};
    console.log(mapedData);
    delete mapedData.nurseConfirmation;
    const apiUrl: string =
      process.env.NEXT_PUBLIC_API_URL + "/user/create";
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
    } else {
      const errorData = await response.json();
      console.log(errorData, 'response')
      throw new Error( errorData.message || "Error en la solicitud API");
    }
  } catch (error: any) {
    console.error('Error:', error);
    res
      .status(500)
      .json({ error: error.message || "Error al obtener datos de la API" });
  }
};
