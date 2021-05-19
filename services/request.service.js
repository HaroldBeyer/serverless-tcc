const { AlterStatusFacade } = require('../facades/alter-status.facade');

const uuid = require('uuid');
const { httpReturn } = require('../utils/httpReturn');
const { HTTP_SUCCESS, DYNAMO_DB_CONFIGS, DYNAMO_DB_SORT_KEYS, REQUEST_STATUS } = require('../utils/enums');

class RequestService {
    constructor(AWS) {
        this.TableName = DYNAMO_DB_CONFIGS.TableName;
        this.type = DYNAMO_DB_SORT_KEYS.REQUEST;

        this.dynamoDb = new AWS.DynamoDB.DocumentClient();
        this.facade = new AlterStatusFacade(AWS, this);
    }

    async get(id) {
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
        const createdAt = new Date().toISOString();
        const status = REQUEST_STATUS.WAITING;
        const { service } = requestBody;

        const _service = await this.dynamoDb.get({ TableName: this.TableName, Key: { id: service, type: DYNAMO_DB_SORT_KEYS.SERVICE } }).promise();

        const scheduledDate = _service.Item.Date;

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

    async confirm(event) {
        const id = event.pathParameters.id;
        return this.facade.propagateNewStatus(id, true);
    }

    async cancel(event) {
        const id = event.pathParameters.id;
        return this.facade.propagateNewStatus(id, false);
    }

    async alterStatus(id, status) {
        const UpdateExpression = 'SET #status =:s';
        const ExpressionAttributeValues = { ":s": status };
        const ExpressionAttributeNames = { "#status": "status" };
        const params = {
            TableName: this.TableName,
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
            Key: { id, type: this.type },
            ReturnValues: 'UPDATED_NEW'
        };
        console.log(`Key: ${{ id, type: this.type }}`);
        return this.dynamoDb.update(params).promise();
    }

}

module.exports = {
    RequestService
}