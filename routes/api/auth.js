const express = require('express')

const { controllerWrapper, validator, authenticate } = require('../../middelwares')
const { joiSchema } = require('../../schemas/users')
const { auth: ctrl } = require('../../controllers')

const router = express.Router()

router.post('/signup', validator(joiSchema), controllerWrapper(ctrl.register))

router.post('/login', validator(joiSchema), controllerWrapper(ctrl.login))

router.get('/logout', authenticate, controllerWrapper(ctrl.logout))

router.get('/current', authenticate, controllerWrapper(ctrl.current))

router.post('/refresh-token', authenticate, controllerWrapper(ctrl.refreshingToken))

module.exports = router
