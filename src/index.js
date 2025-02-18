// index.js
import { analyticsController } from './controllers/controller.js';
import { connectToDatabase } from './db.js';

const MONGODB_URI = process.env.MONGODB_URI;

export const handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        // Établir la connexion à la base de données
        await connectToDatabase(MONGODB_URI);

        // Traiter chaque enregistrement du flux Kinesis
        const records = event.Records.map(record => {
            // Décoder et parser le payload de Kinesis
            const payload = Buffer.from(record.kinesis.data, 'base64').toString('utf-8');
            return JSON.parse(payload);
        });

        // Appeler le contrôleur pour traiter les enregistrements
        await analyticsController(records);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Traitement réussi' }),
        };
    } catch (error) {
        console.error('Erreur dans le handler :', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erreur interne du serveur' }),
        };
    }
};
