import express, { Request, Response } from 'express';
import verifyToken from '../middleware';
const router = express.Router();

router.post('/recommend_products', verifyToken, async (req: Request, res: Response) => {
    try {
        const requestData = req.body;

        const flaskResponse = await fetch(`${process.env.FLASK_SERVER}/recommendation_model`, {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(requestData)
        });

        
        const products = await flaskResponse.json();
        // console.log("Flask response", products)

        if(!flaskResponse.ok){
            throw new Error("Error fetching recommendations")
        }

        return res.status(200).json(products);
    } catch (error) {
        res.status(500).send('Error communicating with Flask server');
    }
});

export default router;