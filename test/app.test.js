import {describe, expect} from "@jest/globals";
import { getCountries } from "../src/client/js/app";
import { getGeoNameData, getImageLocation, getWeatherInfo } from "../src/client/js/DAL";

describe('Test app functions', () => {

  test('Getting the country names.', async () => {
    const data = await getCountries();
    expect(data.length).toBeGreaterThanOrEqual(0);
  });

  test('Getting GeoName data.', async () => {
    const data = await getGeoNameData('lima');
    expect(data).toBeDefined();
  });

  test('Getting Image data.', async () => {
    const data = await getImageLocation('lima');
    expect(data).toBeDefined();
  });

  test('Getting GeoName data.', async () => {
    const data = await getWeatherInfo("55.75222","37.61556","2020-07-20");
    expect(data).toBeDefined();
  });

});
