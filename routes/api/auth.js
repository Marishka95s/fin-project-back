const express = require('express')

const { controllerWrapper, validator, authenticate } = require('../../middelwares')
const { joiSchema } = require('../../schemas/users')
const { auth: ctrl } = require('../../controllers')

const router = express.Router()

// 4. Эндпоинт регистрации POST /api/auth/register
// router.post('/register', validator(joiSchema), controllerWrapper(ctrl.register))
router.post('/signup', validator(joiSchema), controllerWrapper(ctrl.register))

// 5. Эндпоинт аутентификации POST /api/auth/login
router.post('/login', validator(joiSchema), controllerWrapper(ctrl.login))
// router.post('/signin', ctrl.signin)

// 6. Эндпоинт логаута GET /api/auth/logout
router.get('/logout', authenticate, controllerWrapper(ctrl.logout))
// router.get('/signout', ctrl.signout)

// 12. Получение информации о пользователе
router.get('/current', authenticate, controllerWrapper(ctrl.current))

// 13. Эндпоинт получения новой пары токенов
router.patch('/refresh-token', authenticate, controllerWrapper(ctrl.updateSubscription))

module.exports = router
