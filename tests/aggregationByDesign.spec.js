import express from 'express';
import request from 'supertest';
import { router as titleRouters } from '../routes/title';
import { aggregationByDesign } from '../services/titleService';
import sequelize from '../config/db';

const app = express();
app.use('/api/title', titleRouters);

describe('aggregationByDesign with multiple cases', () => {
  let response;
  let data;
  let volumes;

  beforeAll(async () => {
    response = await request(app).get('/api/title/14');
    data = response.body.data;
    volumes = data.volumes;
  }, 10000);

  afterAll(async () => {
    await sequelize.close();
  });

  test('aggregationByDesign return array', () => {
    expect(aggregationByDesign(volumes)).toEqual([
      {
        id: 141,
        brevis: '7-КМ1',
        full_name:
          'Открытая установка трансформаторов (пристанционный узел). Конструкции металлические',
        volumes: [
          { id: 19, value: 28.86, name: 'М/к', unit: 'тн' },
          { id: 2, value: 1084, name: 'АКЗ', unit: 'м2' },
        ],
      },
    ]);
  });
});
