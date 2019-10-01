const Router = require('koa-router');
const koaBody = require('koa-body');
const response = require('../middlewares/response.js');
const signals = require('./signals.js');

exports.addController = (application, controllerName) => {
    const router = new Router();
    router.post(controllerName, koaBody(), async (ctx) => {
        const data = ctx.request.body;
        if (data == null)
            throw new response.Error({ body: 'Request body expected'});
        if (data.offer == null)
            throw new response.Error({ offer: 'Offer field expected'});
        if (data.label == null)
            throw new response.Error({ offer: 'label field expected'});
        return await signals.getAnswer(data);
    });

    application.use(router.routes());
};
