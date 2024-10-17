class SequenceHelper {
    constructor({ sequence, db }) {
        this.sequence = sequence;
        this.db = db;
    }

    async getNextNumber() {
        // Example implementation to get the next sequence number.
        // Adjust according to your database sequence handling.
        const result = await this.db.run(`SELECT NEXTVAL('${this.sequence}') AS seq`);
        return result[0].seq;
    }
}
module.exports = SequenceHelper;