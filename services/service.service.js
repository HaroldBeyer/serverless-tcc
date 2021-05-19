const uuid = require('uuid');
const { httpReturn } = require('../utils/httpReturn');
const { HTTP_SUCCESS, DYNAMO_DB_CONFIGS, DYNAMO_DB_SORT_KEYS } = require('../utils/enums');

class ServiceService {
    constructor(AWS) {
        this.TableName = DYNAMO_DB_CONFIGS.TableName;
        this.type = DYNAMO_DB_SORT_KEYS.SERVICE;

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
        const params = {
            // Specify which items in the results are returned.
            FilterExpression: "#type = :t",
            // Define the expression attribute value, which are substitutes for the values you want to compare.
            ExpressionAttributeValues: {
                ":t": { S: this.type }
            },
            ExpressionAttributeNames: {
                "#type": "type"
            },
            TableName: this.TableName,
            ProjectExpression: "id, name, type"
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

        const Item = { id, type: this.type, name }

        console.log(`Item: ${JSON.stringify(Item)}`);

        const params = {
            TableName: this.TableName,
            Item
        }

        console.log(`Params: ${JSON.stringify(params)}`);

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
