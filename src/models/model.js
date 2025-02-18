import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
    eventType: String,
    hashedIp: String,
    timestamp: { type: Date, default: Date.now },
    page: String,
    articleId: String,
    referrer: String,
    deviceType: String,
    browser: String,
    country: String,
    timeOnPage: Number,
    actions: Object,
});

export const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsSchema);
