const { httpReturn } = require('../utils/httpReturn');
const { HTTP_SUCCESS, DYNAMO_DB_CONFIGS, DYNAMO_DB_SORT_KEYS, REQUEST_STATUS } = require('../utils/enums');

const { RequestService } = require('../services/request.service');
const { } = require('../services/schedulePlan.service');
const { ScheduleService } = require('../services/schedule.service');

export class AlterStatusFacade {
    constructor() {
        this.TableName = DYNAMO_DB_CONFIGS.TableName;
        this.requestService = new RequestService();
        this.scheduleService = new ScheduleService();

    }


    /**
     * when request has changed to CONFIRMED, we must get:
     * hour, weekDay and set schedule to occupied
     * REMOVE SCHEDULE FROM SCHEDULEPLAN
     */
    setConfirmedStatus(scheduledDate, service) {
        
    }

    setCanceledStatus(scheduledDate, service) {

    }



}
