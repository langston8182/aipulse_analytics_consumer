import { AnalyticsEvent } from '../models/model.js';

export const insertAnalyticsEvents = async (events) => {
    try {
        const result = await AnalyticsEvent.insertMany(events);
        console.log(`${result.length} événements insérés.`);
    } catch (error) {
        console.error('Erreur lors de l\'insertion des événements :', error);
        throw error;
    }
};
