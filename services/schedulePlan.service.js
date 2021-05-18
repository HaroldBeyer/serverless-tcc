const AWS = require('aws-sdk');
const uuid = require('uuid');
const { httpReturn } = require('../utils/httpReturn');
const { HTTP_SUCCESS, DYNAMO_DB_CONFIGS, DYNAMO_DB_SORT_KEYS } = require('../utils/enums');

class SchedulePlanService {
    constructor() {
        this.TableName = DYNAMO_DB_CONFIGS.TableName;
        this.type = DYNAMO_DB_SORT_KEYS.SCHEDULE_PLAN;
        AWS.config.setPromisesDependency(require('bluebird'));

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
        const result = await this.dynamoDb.get({ TableName: this.TableName, Key }).promise();

        return httpReturn(
            HTTP_SUCCESS.SuccessOK,
            `Succesfully got all`,
            result
        );
    }

    async insert(event) {
        const requestBody = JSON.parse(event.body);
        const id = uuid.v1();
        const { service } = requestBody;
        let Item = { id, type: this.type, service }

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

    async insertSchedule(event) {
        const requestBody = JSON.parse(event.body);
        const id = event.pathParameters.id;

        const { schedule } = requestBody;

        const schedulePlan = await this.dynamoDb.get({ TableName: this.TableName, Key: { id, type: this.type } }).promise();

        let schedules = schedulePlan.Item.schedules;

        console.log(`schedules: ${JSON.stringify(schedules)}`);

        if (!schedules) {
            schedules = [];
        }

        schedules.push(schedule);

        let UpdateExpression = 'SET #schedules =:s';
        let ExpressionAttributeValues = { ":s": schedules };
        let ExpressionAttributeNames = { "#schedules": "schedules" };

        const params = {
            TableName: this.TableName,
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
            Key: { id, type: this.type },
            ReturnValues: 'UPDATED_NEW'
        }

        const result = await this.dynamoDb.update(params).promise();

        return httpReturn(
            HTTP_SUCCESS.SuccessOK,
            `Succesfully updated ${id}`,
            result
        );
    }


}


module.exports = {
    SchedulePlanService
}