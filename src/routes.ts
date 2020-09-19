import {Router} from 'express'

import clinicHour from './controllers/clinicHour.controller'

const routes: Router = Router()

routes.post('/perday', clinicHour.storeRulesPerDay)
//routes.post('/all', clinicHour.storeRulesAllDays)
routes.post('/see', clinicHour.seeRulesFree)
routes.post('/week', clinicHour.storeRulesWeek)
routes.get('/index', clinicHour.indexRules)

module.exports = routes