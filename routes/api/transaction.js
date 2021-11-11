const express = require('express')

const { controllerWrapper, validator, authenticate } = require('../../middelwares')
const { transactions: ctrl } = require('../../controllers')
const { joiSchema } = require('../../schemas/transaction')

const router = express.Router()

router.get('/', authenticate, controllerWrapper(ctrl.listTransactions))

router.get('/:transactionId', authenticate, controllerWrapper(ctrl.getById))

router.post('/', authenticate, validator(joiSchema), controllerWrapper(ctrl.add))

router.delete('/:transactionId', authenticate, controllerWrapper(ctrl.removeById))

router.put('/:transactionId', authenticate, validator(joiSchema), controllerWrapper(ctrl.updateById))

router.patch('/:transactionId/favorite', authenticate, controllerWrapper(ctrl.updateTransactionStatusById))

module.exports = router
