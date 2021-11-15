const express = require('express')

const { controllerWrapper, validator, authenticate } = require('../../middelwares')
const { transactions: ctrl } = require('../../controllers')
const { joiSchema } = require('../../schemas/transactions')

const router = express.Router()

router.get('/', authenticate, controllerWrapper(ctrl.listTransactions))

router.get('/statistics', authenticate, controllerWrapper(ctrl.getStatistics))

router.get('/categories', controllerWrapper(ctrl.getCategories))

router.post('/', authenticate, validator(joiSchema), controllerWrapper(ctrl.add))

module.exports = router
