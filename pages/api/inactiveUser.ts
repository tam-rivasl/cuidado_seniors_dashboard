import { NextApiRequest, NextApiResponse } from 'next';
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const mapedData = { ...req.body };
    console.log('dataaaa', mapedData);
    const apiUrl: string =
      process.env.NEXT_PUBLIC_API_URL + "/user/update/status/" + req.body.userId;
    const response = await fetch(apiUrl, {
      method: "PATCH",
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
      console.error('Error en la solicitud API:', errorData.message);
      throw new Error(errorData.message || "Usuario ya se encuentra inactivo");
    }
  } catch (error) {
    console.error('Error en la conexion de la API', error);
    res.status(500).json({
      error: "Error de conexion consulte soporte",
    });
  }
};
