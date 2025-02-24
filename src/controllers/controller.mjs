import { insertAnalyticsEvents } from '../services/service.mjs';
import { AnalyticsEvent } from '../models/model.mjs';

export const analyticsController = async (records) => {
    try {
        // Transformer les enregistrements en instances du modèle AnalyticsEvent
        const events = records.map(record => new AnalyticsEvent(record));

        // Appeler le service pour insérer les événements dans MongoDB
        await insertAnalyticsEvents(events);
    } catch (error) {
        console.error('Erreur dans le contrôleur analytics :', error);
        throw error;
    }
};
