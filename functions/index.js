const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();

// Moderate new marketplace listings
exports.moderateListing = onDocumentCreated("listings/{listingId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        return;
    }
    const data = snapshot.data();
    const description = data.description || "";

    // Simple keyword blocking
    const bannedWords = ["fake", "banned", "illegal"];
    const found = bannedWords.find(word => description.toLowerCase().includes(word));

    if (found) {
        logger.info(`Flagging listing ${event.params.listingId} for word ${found}`);
        return snapshot.ref.update({ status: "flagged", moderationReason: `Contains ${found}` });
    }
});

// Archive past events (scheduled function mock, triggered on write for now)
exports.checkEventDate = onDocumentCreated("events/{eventId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;
    const data = snapshot.data();

    // Logic to check date would go here
});
