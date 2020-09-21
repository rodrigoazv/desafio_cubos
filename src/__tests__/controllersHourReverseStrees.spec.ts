import app from '../app'
import request from 'supertest'
import {clear} from './utils/clear'

describe('Strees insert', () => {
  beforeAll(async () => {
    await clear()
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

  
  
})

