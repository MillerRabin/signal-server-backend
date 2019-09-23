const Router = require('koa-router');
const koaBody = require('koa-body');
const response = require('../middlewares/response.js');

async function createOffer(connection, offer) {
    const query = `insert into offers (offer, ip) 
                   values ($1, $2)
                   on conflict (ip) 
                   do update set offer = $1`;
    const dbQuery = {
        text: query,
        values: [offer.text, offer.ip],
        rowMode: 'array'
    };
    return await connection.query(dbQuery);
}


exports.getIp = (request) => {
    const str = request.headers['x-real-ip'] || request.ip;
    const rip = new RegExp("\\[([0-9a-f:]+)\\]:([0-9]{1,5})");
    let res = str.match(rip);
    if (res != null) return res[1];

    const ripv4 = new RegExp("([0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3})");
    res = str.match(ripv4);
    if (res != null) return res[1];
    return str;
};


exports.addController = (application, controllerName) => {
    const router = new Router();

    router.post(controllerName, koaBody(), async (ctx) => {
        const data = ctx.request.body;
        const ip = exports.getIp(ctx.request);
        if ((data == null) || (data.offer == null))
            throw new response.Error({ offer: 'Offer field expected'});

        const offer = data.offer;
        const connection = await application.pool.connect();
        try {
            return await createOffer(connection, { text: offer, ip });
        } finally {
            await connection.release();
        }
    });

    application.use(router.routes());
};
