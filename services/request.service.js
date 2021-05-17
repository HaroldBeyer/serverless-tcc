const AWS = require('aws-sdk');
const uuid = require('uuid');
const { httpReturn } = require('../utils/httpReturn');
const { HTTP_SUCCESS, DYNAMO_DB_CONFIGS, DYNAMO_DB_SORT_KEYS, REQUEST_STATUS } = require('../utils/enums');

export class RequestService {
    constructor() {
        this.TableName = DYNAMO_DB_CONFIGS.TableName;
        this.type = DYNAMO_DB_SORT_KEYS.REQUEST;
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
        const { service, status, scheduledDate } = requestBody;
        const createdAt = new Date();
        let Item = { id, type: this.type, service, status, scheduledDate, createdAt };

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


    update(id, option) {
        const id = event.pathParameters.requestId;

        let UpdateExpression = 'SET #status =:s';
        let ExpressionAttributeValues = { ":s": option };
        let ExpressionAttributeNames = { "#status": "status" };

        const params = {
            TableName: this.TableName,
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
            key: { id },
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
