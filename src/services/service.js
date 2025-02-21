import { AnalyticsEvent } from '../models/model.js';

export const insertAnalyticsEvents = async (events) => {
    try {
        for (const event of events) {
            // Conversion du timestamp en objet Date
            const eventDate = new Date(event.timestamp);

            // Calcul du début et de la fin de la journée
            const startOfDay = new Date(eventDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(eventDate);
            endOfDay.setHours(23, 59, 59, 999);

            // Construction de l'objet de mise à jour
            const updateObj = {
                $setOnInsert: {
                    eventType: event.eventType,
                    hashedIp: event.hashedIp,
                    timestamp: eventDate,
                    page: event.page,
                    referrer: event.referrer,
                    deviceType: event.deviceType,
                    browser: event.browser,
                    country: event.country,
                },
                $inc: {
                    "actions.shares.facebook": (event.actions && event.actions.shares && event.actions.shares.facebook) ? event.actions.shares.facebook : 0,
                    "actions.shares.linkedin": (event.actions && event.actions.shares && event.actions.shares.linkedin) ? event.actions.shares.linkedin : 0,
                    "actions.shares.x": (event.actions && event.actions.shares && event.actions.shares.x) ? event.actions.shares.x : 0,
                    "actions.clicks": (event.actions && event.actions.clicks) ? event.actions.clicks : 0,
                }
            };
            // Ajout de l'article à la liste via $addToSet si articleId est présent
            if (event.articleId) {
                updateObj.$push = { articleIds: event.articleId };
            }

            // Opération upsert qui met à jour ou insère un document
            await AnalyticsEvent.findOneAndUpdate(
                {
                    hashedIp: event.hashedIp,
                    timestamp: { $gte: startOfDay, $lte: endOfDay }
                },
                updateObj,
                { upsert: true, new: true }
            );
        }
        console.log(`${events.length} événements traités (mis à jour ou insérés).`);
    } catch (error) {
        console.error('Erreur lors de l\'insertion/mise à jour des événements :', error);
        throw error;
    }
};