const { ServiceService } = require('../services/service.service');

const service = new ServiceService();

module.exports.getService = async (event) => {
    return service.get(event);
};

module.exports.getAllServices = async (event) => {
    return service.getAll();
};

module.exports.insertService = async (event) => {
    return service.insert(event);
};

