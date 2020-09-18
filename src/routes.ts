import {Router} from 'express'

import clinicHour from './controllers/clinicHour.controller'

const routes: Router = Router()

routes.post('/', clinicHour.storeRules)

module.exports = routes