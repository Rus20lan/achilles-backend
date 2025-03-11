import express from 'express';
import request from 'supertest';
import { aggregationByVolume } from '../services/titleService';
import { router as titleRouters } from '../routes/title';

const testData = [
  {
    volumes: [
      { Resource: { name: 'М/к' }, resourceId: 1, value: 1 },
      { Resource: { name: 'М/к' }, resourceId: 1, value: 2 },
    ],
    expected: [
      {
        name: 'М/к',
        sum: 3,
        aggVolume: [
          { Resource: { name: 'М/к' }, resourceId: 1, value: 1 },
          { Resource: { name: 'М/к' }, resourceId: 1, value: 2 },
        ],
      },
    ],
  },
  { volumes: [], expected: [] },
];

describe.skip('aggregationByVolume with multiple cases', () => {
  testData.forEach(({ volumes, expected }) => {
    test(`returns ${JSON.stringify(
      expected
    )} when volumes equal to ${JSON.stringify(volumes)}`, () => {
      expect(aggregationByVolume(volumes)).toEqual(expected);
    });
  });
});

const app = express();
app.use('/api/title', titleRouters);

describe.skip('Database tests', () => {
  let response;
  let data;
  let volumes;

  beforeAll(async () => {
    try {
      response = await request(app).get('/api/title/4');
      console.log('Response:', response.body);
      data = response.body.data;
      volumes = data.volumes;
    } catch (error) {
      console.error('Error in beforeAll:', error);
      throw error;
    }
  });

  test('response status should be 200', () => {
    expect(response.statusCode).toBe(200);
  });

  test.skip('response should have the correct structure', () => {
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('data');
  });

  test.skip('data should have the correct structure', () => {
    expect(typeof data).toBe('object');
    expect(data).toHaveProperty('brevis');
  });

  test.skip('checking a function aggregationByVolume on data from a database field sum', () => {
    expect(aggregationByVolume(volumes)[0].sum).toBeCloseTo(968.3, 1);
  });

  test.skip('checking a function aggregationByVolume on data from a database field name', () => {
    expect(aggregationByVolume(volumes)[0].name).toBe('М/к');
  });
});

// describe('Database tests', () => {
//   let result;

//   beforeAll(async () => {
//     result = await titleRouters.get('/4', getTitleById);
//   });

//   test(`result ${result} is an object type`, () => {
//     expect(typeof result).toBe('object');
//   });
// });
