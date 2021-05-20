const { httpReturn } = require('../utils/httpReturn');
const { HTTP_SUCCESS, FAUNA_DB_COLLECTIONS } = require('../utils/enums');

class ScheduleService {
    constructor(DB) {
        this.type = FAUNA_DB_COLLECTIONS.SCHEDULE;
        this.db = DB;
    }

    async get(event) {
        const id = event && event.pathParameters && event.pathParameters.id ? event.pathParameters.id : event;

        const result = await this.db.get(this.type, id);

        return httpReturn(
            HTTP_SUCCESS.SuccessOK,
            `Succesfully got ${id}`,
            result
        );
    }



    async getAll() {
        const result = await this.db.getAll(this.type);

        return httpReturn(
            HTTP_SUCCESS.SuccessOK,
            `Succesfully got all`,
            result
        );
    }

    async insert(event) {
        const requestBody = JSON.parse(event.body);
        const { hour, day, year, month, service } = requestBody;
        const date = new Date(year, month, day, hour).toISOString();

        let Item = { occupied: false, date, service };


        const result = await this.db.create(this.type, Item);

        return httpReturn(
            HTTP_SUCCESS.SuccessCreated,
            `Succesfully created`,
            result
        );
    }

    async alter(id, option) {
        return this.db.update(this.type, id, { occupied: option });
    }

}


module.exports = {
    ScheduleService
}