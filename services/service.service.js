const uuid = require('uuid');
const { httpReturn } = require('../utils/httpReturn');
const { HTTP_SUCCESS, DYNAMO_DB_CONFIGS, DYNAMO_DB_SORT_KEYS, DYNAMO_DB_APPLICATIONS } = require('../utils/enums');

class ServiceService {
    constructor(AWS) {
        this.TableName = DYNAMO_DB_CONFIGS.TableName;
        this.type = DYNAMO_DB_SORT_KEYS.SERVICE;
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
        const { name } = requestBody;

        const Item = { id, type: this.type, name, application: this.application };

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
}

module.exports = {
    ServiceService
}
