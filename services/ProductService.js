import altogic from "../helpers/altogic";

const modelName = 'products';

export const productService = {
    getAll,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await altogic.db.model(modelName).get();
}

async function create(values) {
    return await altogic.db.model(modelName).object().create({
        ...values
    });
}

async function update(id, values) {
    return await altogic.db
        .model(modelName)
        .object(id)
        .update({
            ...values
        });
}

async function _delete(id) {
    return await altogic.db
        .model(modelName)
        .object(id)
        .delete({"returnTop": true});
}
