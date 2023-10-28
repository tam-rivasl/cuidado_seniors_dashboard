export default async (req: any, res: any) => {
    try {
        const mapedData = { date: req.body.date, plan_service:{plan_serviceId: req.body.plan_serviceId}, status: 'pending'  };
      console.log(mapedData);
        const apiUrl: string = process.env.NEXT_PUBLIC_API_URL+"/appointment/byDate";
        const response = await fetch(apiUrl,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(mapedData),
            });
        if (!response.ok) {
            throw new Error('Error al obtener datos de la API');
        }
        const data = await response.json();
        res.status(200).json(data);
        console.log("data:", data);
      } catch (error: any) {
        res
          .status(500)
          .json({ error: error.message || "Error al obtener datos de la API" });
      }
    };