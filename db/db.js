const faunadb = require('faunadb');
const { Get, Create, Update, Index, Ref, Collection, Paginate, Documents, Map, Lambda, Var, Match } = faunadb.query;


class DB {
    constructor() {
        this.client = new faunadb.Client({
            secret: process.env.FAUNADB_SECRET_KEY
        });

    }

    async get(collection, id) {
        let result = await this.client.query(
            Get(
                Ref(
                    Collection(collection),
                    id
                )
            )
        );

        let resultId = result['ref'];
        resultId = JSON.stringify(result);
        resultId = JSON.parse(resultId);
        resultId = resultId['ref'];
        resultId = resultId['@ref']['id'];
        result =
        {
            id: resultId,
            data: result.data

        }

        return result;
    };

    async getAll(collection) {
        let result = await this.client.query(Map(
            Paginate(
                Documents(
                    Collection(collection)
                )
            ),
            Lambda("X", Get(Var("X")))
        )
        );

        result = result.data;
        result = result.map((result) => {
            let resultId = result['ref'];
            resultId = JSON.stringify(result);
            resultId = JSON.parse(resultId);
            resultId = resultId['ref'];
            resultId = resultId['@ref']['id'];
            result =
            {
                id: resultId,
                data: result.data

            }
            return result;
        }
        );

        return result;
    }

    async create(collection, data) {
        return this.client.query(
            Create(
                Collection(collection),
                { data }
            )
        )
    };

    async update(collection, id, data) {
        return this.client.query(
            Update(
                Ref(
                    Collection(collection),
                    id
                ),
                { data }
            )

        )
    };

    async getScheduleByDateAndService(date, service) {
        let result = await this.client.query(
            Get(
                Match(
                    Index('schedule_by_service_and_date'),
                    [service, date]
                )
            )
        );

        let resultId = result['ref'];
        resultId = JSON.stringify(result);
        resultId = JSON.parse(resultId);
        resultId = resultId['ref'];
        resultId = resultId['@ref']['id'];
        result =
        {
            id: resultId,
            service: result.data.service,
            date: result.data.date,
            occupied: result.data.occupied
        }

        return result;
    };

}

module.exports = {
    DB
}
