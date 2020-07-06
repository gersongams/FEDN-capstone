import {describe, expect} from "@jest/globals";
import axios from 'axios'

describe('The page should be running', () => {
  test('Page response successfully.', async () => {
    const response = await axios.get('http://localhost:4000/');
    expect(response.status).toBe(200);
  });

  test('Data dummy loaded successfully.', async () => {
    const response = await axios.get('http://localhost:4000/trips');
    expect(response.data.length).toBe(2);
  });
});