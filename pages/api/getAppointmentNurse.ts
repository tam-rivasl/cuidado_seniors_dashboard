export default async (req: any, res: any) => {
    try {
        const apiUrl: string = process.env.NEXT_PUBLIC_API_URL + "/appointment?userId=" + req.body.userId;
        const response = await fetch(apiUrl);
        console.log(apiUrl, "url");
        if (!response.ok) {
            throw new Error('Error al obtener datos de la API');
        }

        const data = await response.json();

        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Error al obtener datos de la API' });
    }
};