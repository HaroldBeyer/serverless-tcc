const AWS = require('aws-sdk');
const uuid = require('uuid');
const { httpReturn } = require('../utils/httpReturn');
const { HTTP_SUCCESS, DYNAMO_DB_CONFIGS, DYNAMO_DB_SORT_KEYS } = require('../utils/enums');

export class ScheduleService {
    constructor() {
        this.TableName = DYNAMO_DB_CONFIGS.TableName;
        this.type = DYNAMO_DB_SORT_KEYS.SCHEDULE;
        AWS.config.setPromisesDependency(require('bluebird'));

        this.dynamoDb = new AWS.DynamoDB.DocumentClient();
    }

    get(event) {
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

    getAll() {
        const Key = { type: this.type };
        const result = await this.dynamoDb.get({ TableName, Key }).promise();

        return httpReturn(
            HTTP_SUCCESS.SuccessOK,
            `Succesfully got all`,
            result
        );
    }

    insert(event) {
        const requestBody = JSON.parse(event.body);
        const id = uuid.v1();
        const keys = Object.keys(requestBody);
        let Item = { id, type: this.type }
        keys.forEach(key => {
            Item[key] = requestBody[key];
        });

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

    delete(event) {
        const id = event.pathParameters.id;

        const result = await dynamoDb.delete({ TableName: this.TableName, Key: { id } }).promise();

        return httpReturn(
            HTTP_SUCCESS.SuccessOK,
            `Succesfully deleted ${id}`,
            result
        );
    }

    put() {

    }

    patch() {

    }

    occupy(id) {
        let UpdateExpression = 'SET #occupied =:o';
        let ExpressionAttributeValues = {};
        let ExpressionAttributeNames = {};

    }





}
