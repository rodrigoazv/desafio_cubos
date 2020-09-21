import app from '../app'
import request from 'supertest'
import {clear} from './utils/clear'

describe('Strees insert', () => {
  beforeAll(() => {
    return clear()
  })
  afterAll(() => {
    return clear()
  })

  it('Should insert data return true if no conflict', async () => {
    const response = await request(app)
      .post('/onerule')
      .send({
        date: '23-10-2030',
        type: 'day',
        freeHours: [
          {
            start: '10:00',
            end: '10:30'
          },
          {
            start: '11:00',
            end: '11:30'
          }
        ]
      })

    expect(response.status).toBe(201)
  })
  it('Should insert data return 400 for error', async () => {
    const response = await request(app)
      .post('/onerule')
      .send({
        date: '23-10-2030',
        type: 'day',
        freeHours: [
          {
            start: '11:00',
            end: '11:30'
          }
        ]
      })

    expect(response.status).toBe(400)
  })
  it('Should insert data return true if no conflict for update', async () => {
    const response = await request(app)
      .post('/onerule')
      .send({
        date: '23-10-2030',
        type: 'day',
        freeHours: [
          {
            start: '11:40',
            end: '11:50'
          }
        ]
      })

    expect(response.status).toBe(202)
  })
  it('Should insert data return error for conflict with data', async () => {
    const response = await request(app)
      .post('/specialrules')
      .send({
        date: '*',
        type: 'Weekly',
        days: [3],
        freeHours: [
          {
            start: '11:40',
            end: '11:50'
          }
        ]
      })
      expect(response.status).toBe(400)
  })
  it('Should insert data return true if no conflict rules', async () => {
    const response = await request(app)
      .post('/specialrules')
      .send({
        date: '*',
        type: 'Weekly',
        days: [4],
        freeHours: [
          {
            start: '11:40',
            end: '11:50'
          }
        ]
      })
      expect(response.status).toBe(200)
  })
  it('Should be return 400 if there is conflict with any day', async () => {
    const response = await request(app)
      .post('/specialrules')
      .send({
        date: '*',
        type: 'Daily',
        freeHours: [
          {
            start: '11:40',
            end: '11:50'
          }
        ]
      })
      expect(response.status).toBe(400)
  })
  it('Should be return 200 if there is no conflict with any day', async () => {
    const response = await request(app)
      .post('/specialrules')
      .send({
        date: '*',
        type: 'Daily',
        freeHours: [
          {
            start: '11:50',
            end: '11:55'
          }
        ]
      })
      expect(response.status).toBe(200)
  })
  it('Should be return 400 for special day', async () => {
    const response = await request(app)
      .post('/specialrules')
      .send({
        date: '13-10-2030',
        type: 'Day',
        freeHours: [
          {
            start: '11:50',
            end: '11:54'
          }
        ]
      })
      expect(response.status).toBe(400)
  })
  it('Should be return 200 if there is no conflict with any day', async () => {
    const response = await request(app)
      .post('/specialrules')
      .send({
        date: '*',
        type: 'Daily',
        freeHours: [
          {
            start: '11:50',
            end: '11:55'
          }
        ]
      })
      expect(response.status).toBe(400)
  })
  
  
})

describe('Teste delete value of rules', () => {

  beforeAll(() => {
    return clear()
  })
  afterAll(() => {
      return clear()
    })
  it('Should be return 200 for register Day example', async () => {
      const response = await request(app)
        .post('/onerule')
        .send({
          date: '11-10-2020',
          type: 'Day',
          freeHours: [
            {
              start: '11:40',
              end: '11:50'
            }
          ]
        })
        expect(response.status).toBe(201)
    })
    it('Should be return 200 for register Day example', async () => {
      const response = await request(app)
        .post('/onerule')
        .send({
          date: '12-10-2020',
          type: 'Day',
          freeHours: [
            {
              start: '11:40',
              end: '11:50'
            }
          ]
        })
        expect(response.status).toBe(201)
    })
    it('Should be return 200 for register Day example', async () => {
      const response = await request(app)
        .post('/onerule')
        .send({
          date: '13-10-2020',
          type: 'Day',
          freeHours: [
            {
              start: '11:40',
              end: '11:50'
            }
          ]
        })
        expect(response.status).toBe(201)
    })
  it('Should be return interval of query with days', async () => {
      const response = await request(app)
          .get('/see?date1=11-10-2020&date2=13-10-2020')
      const dataResponse = JSON.parse(response.text)
      expect(dataResponse.query.length).toBe(3)
  })

})
describe('Teste delete value of rules', () => {

  beforeAll(() => {
    return clear()
  })
  afterAll(() => {
    return clear()
  })
  it('Should be return 200 for register Daily example', async () => {
    const response = await request(app)
      .post('/specialrules')
      .send({
        date: '*',
        type: 'Daily',
        freeHours: [
          {
            start: '11:40',
            end: '11:50'
          }
        ]
      })
      expect(response.status).toBe(200)
  })
  it('Should be return 200 for exclude Daily rule', async () =>{
    
    const responseGet = await request(app)
      .get('/index')
    const responseDel = await request(app)
      .delete(`/delete/${responseGet.body[0].id}`)

    expect(responseDel.status).toBe(200)
  })

  it('Should be return 400 for not find id', async () =>{
    const responseDel = await request(app)
      .delete(`/delete/1`)

    expect(responseDel.status).toBe(400)
  })

})
