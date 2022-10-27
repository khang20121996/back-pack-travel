// Test API
import travelApi from './api/backPackTravelApi';

async function main() {
  try {
    // const queryParams = {
    //   _page: 1,
    //   _limit: 4,
    // };

    const data = await travelApi.getById(3);
    console.log(data);
  } catch (error) {
    console.log('Get all fail ', data);
  }
}

main();
