const { httpReturn } = require('../utils/httpReturn');
const { HTTP_SUCCESS, DYNAMO_DB_CONFIGS, REQUEST_STATUS } = require('../utils/enums');

const { RequestService } = require('../services/request.service');
const { ScheduleService } = require('../services/schedule.service');
const { SchedulePlanService } = require('../services/schedulePlan.service');

class AlterStatusFacade {
    constructor(AWS, requestService, scheduleService, schedulePlanService) {
        this.TableName = DYNAMO_DB_CONFIGS.TableName;
        this.requestService = requestService ? requestService : new RequestService(AWS);
        this.scheduleService = scheduleService ? scheduleService : new ScheduleService(AWS);
        this.schedulePlanService = schedulePlanService ? schedulePlanService : new SchedulePlanService(AWS);
    }

    async propagateNewStatus(requestId, status) {
        let request = await this.requestService.get(requestId);
        request = JSON.parse(request.body);
        const serviceId = request['input']['Item']['service'];
        const scheduledDate = request['input']['Item']['scheduledDate'];
        console.log(`serviceId: ${serviceId} and scheduledDate ${scheduledDate}`);
        let scheduledPlan = await this.schedulePlanService.get()
        //get scheduleplan from service
        //get schedule from schedulePlan.
        // but which one ? the one with the same scheduledDate!


        const requestStatus = status ? REQUEST_STATUS.CONFIRMED : REQUEST_STATUS.CANCELED;
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

    async insertPlanIntoSchedule(scheduleId, schedulePlanId) {
        return this.scheduleService.insertPlan(scheduleId, schedulePlanId);
    }
}

module.exports = {
    AlterStatusFacade
}
