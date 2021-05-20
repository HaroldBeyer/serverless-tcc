const { AlterStatusFacade } = require('../facades/alter-status.facade');

const { httpReturn } = require('../utils/httpReturn');
const { HTTP_SUCCESS, REQUEST_STATUS, FAUNA_DB_COLLECTIONS } = require('../utils/enums');

class RequestService {
    constructor(DB) {
        this.type = FAUNA_DB_COLLECTIONS.REQUEST;
        this.db = DB;
        this.facade = new AlterStatusFacade(DB, this, null);
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
        const createdAt = new Date().toISOString();
        const status = REQUEST_STATUS.WAITING;
        const { service, scheduledDate } = requestBody;

        const Item = { service, status, scheduledDate, createdAt };


        const result = await this.db.create(this.type, Item);

        return httpReturn(
            HTTP_SUCCESS.SuccessCreated,
            `Succesfully created`,
            result
        );
    }

    async confirm(event) {
        const id = event.pathParameters.id;
        console.log(`Id: ${id}`);
        return this.facade.propagateNewStatus(id, true);
    }

    async cancel(event) {
        const id = event.pathParameters.id;
        return this.facade.propagateNewStatus(id, false);
    }

    async alterStatus(id, status) {
        return this.db.update(this.type, id, { status });
    }

}

module.exports = {
    RequestService
}