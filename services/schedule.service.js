const uuid = require('uuid');
const { httpReturn } = require('../utils/httpReturn');
const { HTTP_SUCCESS, DYNAMO_DB_CONFIGS, DYNAMO_DB_SORT_KEYS, DYNAMO_DB_APPLICATIONS } = require('../utils/enums');

class ScheduleService {
    constructor(AWS) {
        this.TableName = DYNAMO_DB_CONFIGS.TableName;
        this.type = DYNAMO_DB_SORT_KEYS.SCHEDULE;
        this.application = DYNAMO_DB_APPLICATIONS.SERVERLESS_APPLICATION;

        this.dynamoDb = new AWS.DynamoDB.DocumentClient();
    }

    async get(event) {
        const id = event.pathParameters.id;

        const params = {
            TableName: this.TableName,
            Key: {
                application: this.application,
                id,
            }
        };

        const result = await this.dynamoDb.get(params).promise();

        return httpReturn(
            HTTP_SUCCESS.SuccessOK,
            `Succesfully got ${id}`,
            result
        );
    }

    async getAll() {
        const params = {
            TableName: this.TableName,
            FilterExpression: "application = :application",
            ExpressionAttributeValues: { ":application": this.application }
        };

        const result = await this.dynamoDb.scan(params).promise();

        return httpReturn(
            HTTP_SUCCESS.SuccessOK,
            `Succesfully got all`,
            result
        );
    }

    async insert(event) {
        const requestBody = JSON.parse(event.body);
        const id = uuid.v1();
        const { hour, day, year, month } = requestBody;
        const date = new Date(year, month, day, hour).toISOString();

        let Item = { application: this.application, id, type: this.type, occupied: false, date };

        const params = {
            TableName: this.TableName,
            Item
        }

        const result = await this.dynamoDb.put(params).promise();

        return httpReturn(
            HTTP_SUCCESS.SuccessCreated,
            `Succesfully created`,
            result
        );
    }

    async alter(id, option) {
        const params = {
            TableName: this.TableName,
            UpdateExpression: 'SET #occupied =:o',
            ExpressionAttributeValues: {
                ':o': option
            },
            ExpressionAttributeNames: {
                "#occupied": "occupied"
            },
            Key: { id, applcation: this.application },
            ReturnValues: 'UPDATED_NEW'
        }

        console.log(`Key: ${{ id, type: this.type }}`);

        return this.dynamoDb.update(params).promise();
    }

    async insertPlan(scheduleId, schedulePlanId) {
        const params = {
            TableName: this.TableName,
            UpdateExpression: 'SET #schedulePlan =:sp',
            ExpressionAttributeValues: {
                ':sp': schedulePlanId
            },
            ExpressionAttributeNames: {
                "#schedulePlan": "schedulePlan"
            },
            Key: { id: scheduleId, application: this.application },
            ReturnValues: 'UPDATED_NEW'
        }

        return this.dynamoDb.update(params).promise();
    }
}


module.exports = {
    ScheduleService
}