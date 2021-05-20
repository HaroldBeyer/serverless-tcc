const { httpReturn } = require('../utils/httpReturn');
const { HTTP_SUCCESS, REQUEST_STATUS } = require('../utils/enums');

const { RequestService } = require('../services/request.service');
const { ScheduleService } = require('../services/schedule.service');

class AlterStatusFacade {
    constructor(DB, requestService, scheduleService) {
        this.requestService = requestService ? requestService : new RequestService(DB);
        this.scheduleService = scheduleService ? scheduleService : new ScheduleService(DB);
        this.db = DB;
    }

    async propagateNewStatus(requestId, status) {
        /**
         * we must get requestId to get request with scheduledDate and service
         * and then get the scheduleId so we can send it to change occupied
         */
        let request = await this.requestService.get(requestId);
        request = JSON.parse(request.body);
        const serviceId = request['input']['data']['service'];
        const scheduledDate = request['input']['data']['scheduledDate'];
        const requestStatus = status ? REQUEST_STATUS.CONFIRMED : REQUEST_STATUS.CANCELED;

        console.log(`params -  servcie : ${serviceId} , scheduledDate: ${scheduledDate}, requestId: ${requestId} `);
        const schedule = await this.db.getScheduleByDateAndService(scheduledDate, serviceId);
        console.log(`Schedule: ${JSON.stringify(schedule)}`);
        const scheduleId = schedule.id;

        let promises = [];
        promises.push(this.requestService.alterStatus(requestId, requestStatus));
        promises.push(this.scheduleService.alter(scheduleId, status));

        const result = await Promise.all(promises);

        return httpReturn(
            HTTP_SUCCESS.SuccessOK,
            `Succesfully updated ${requestId} and ${scheduleId}`,
            result
        );
    }
}

module.exports = {
    AlterStatusFacade
}
