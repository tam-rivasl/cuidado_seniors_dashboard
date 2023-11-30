import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        let apiUrl: string;
        if (req.body?.firstDate != null && req.body?.secondDate != null && req.body.userId !=null ) {
            apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/appointment?userId=${req.body.userId}&firstDate=${req.body.firstDate}&secondDate=${req.body.secondDate}`;
        } else if (req.body?.status) {
            console.log('status existe??');
            apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/appointment?userId=${req.body.userId}&status=${req.body.status}`;
        } else if (!req.body.userId) {
            console.log('status existe??');
            apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/appointment?firstDate=${req.body.firstDate}&secondDate=${req.body.secondDate}`;
        }
         else {
            apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/appointment?userId=${req.body.userId}`;
        }

        const response = await fetch(apiUrl);
        console.log(apiUrl, 'url');
        if (!response.ok) {
            throw new Error('Error al obtener datos de la API');
        }

        const data = await response.json();

        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Error al obtener datos de la API' });
    }
};
