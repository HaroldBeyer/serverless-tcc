const uuid = require('uuid');
const { httpReturn } = require('../utils/httpReturn');
const { HTTP_SUCCESS, DYNAMO_DB_CONFIGS, DYNAMO_DB_SORT_KEYS } = require('../utils/enums');

class ScheduleService {
    constructor(AWS) {
        this.TableName = DYNAMO_DB_CONFIGS.TableName;
        this.type = DYNAMO_DB_SORT_KEYS.SCHEDULE;

        this.dynamoDb = new AWS.DynamoDB.DocumentClient();
    }

    async get(event) {
        const id = event.pathParameters.id;

        const result = await this.dynamoDb.get({
            TableName: this.TableName, Key: {
                id,
                type: this.type
            }
        }).promise();

        return httpReturn(
            HTTP_SUCCESS.SuccessOK,
            `Succesfully got ${id}`,
            result
        );
    }

    async getAll() {
        const Key = { type: this.type };
        const result = await this.dynamoDb.get({ TableName, Key }).promise();

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

        let Item = { id, type: this.type, occupied: false, date };

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
            Key: { id, type: this.type },
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
            Key: { id: scheduleId, type: this.type },
            ReturnValues: 'UPDATED_NEW'
        }

        return this.dynamoDb.update(params).promise();
    }
}


module.exports = {
    ScheduleService
}