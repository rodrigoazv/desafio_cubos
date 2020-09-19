import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

class App{
    public express: express.Application

    public constructor(){
        this.express = express()
        this.middlewares()
        this.routes()
    }

    private middlewares ():void{
        this.express.use(bodyParser.urlencoded({
            extended: true
        }))
        this.express.use(bodyParser.json())
        this.express.use(cors())
    }

    private routes (): void{
        this.express.use(require('./routes'))
    }

}

export default new App().express