import { Request, Response } from 'express'
import { rulesHour } from '../entities/rules.entity'
import { readFile, writeFile } from '../services/clinicHour.service';

class clinicHour {
  public storeRules(req: Request, res: Response) {
    const {type, day, start, end} = req.body;
    const cContent = readFile();
    const id = Math.random().toString(32).substr(2,9)
    cContent.push({ id, type, day, start, end})
    writeFile(cContent)
    
    res.status(200).json({status: "ok"})
  }
  public indexRules(req: Request, res: Response) {}
  public seeRulesFree(req: Request, res: Response) {}
  public deleteRules(req: Request, res: Response) {}
}

export default new clinicHour()
