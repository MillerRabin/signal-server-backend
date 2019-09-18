const Router = require('koa-router');
const koaBody = require('koa-body');

async function createOffer(connection, offer) {
    const query = 'insert into offers (offer, ip) values ($1, $2)';
    const dbQuery = {
        text: query,
        values: [offer.text, offer.ip],
        rowMode: 'array'
    };
    return await connection.query(dbQuery);

}

exports.addController = (application, controllerName) => {
    const router = new Router();

    router.post('/' + controllerName, koaBody(), async (ctx) => {
        const offer = ctx.request.body;
        const connection = await application.pool.connect();
        try {
            return await createOffer(connection, offer);
        } finally {
            await connection.release();
        }
    });

    application.use(router.routes());
};
