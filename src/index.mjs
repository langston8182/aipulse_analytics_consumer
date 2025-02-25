import { analyticsController } from './controllers/controller.mjs';
import { connectToDatabase } from './db.mjs';

const MONGODB_URI = process.env.MONGODB_URI;

export const handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        // 1. Connexion MongoDB
        const env = process.env.ENVIRONMENT || "preprod";
        const dbUri = env === "prod" ? process.env.MONGODB_URI_PROD : process.env.MONGODB_URI_PREPROD;

        if (!dbUri) {
            throw new Error(`Aucune URI MongoDB définie pour l'environnement ${env}`);
        }
        await connectToDatabase(dbUri);

        // Traiter chaque enregistrement du flux SQS
        const records = event.Records.map(record => {
            return JSON.parse(record.body);
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
