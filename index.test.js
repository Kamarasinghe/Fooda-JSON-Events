const rewardsReport = require('./index');


describe('Testing the handleApiEvents function', () => {

  test('handleApiEvents function to be defined', () => {
    expect(rewardsReport.handleApiEvents).toBeDefined();
  });

  test('returns an object', () => {
    expect(rewardsReport.handleApiEvents([], {})).toEqual({});
  });

  test('should return customer object with correct info for "new_customer" event', () => {
    let testEvent = [{
      action: "new_customer",
      name: "Kevin", 
      timestamp: "2020-07-01T12:00:00-05:00"
    }];

    expect(rewardsReport.handleApiEvents(testEvent, {})).toEqual({
      'Kevin': { 
        totalRewardPoints: 0, avgPointsPerOrder: 0, totalOrders: 0
      }
    });
  });

  test('should only return 1 customer object for "new_order" event', () => {
    let testEvent = [{
      action: "new_order",
      customer: "Kevin", 
      amount: 4,
      timestamp: "2020-07-01T10:00:00-05:00"
    }];

    let testDb = { Kevin: { totalRewardPoints: 0, avgPointsPerOrder: 0, totalOrders: 0 }};

    expect(rewardsReport.handleApiEvents(testEvent, testDb)).toEqual({
      'Kevin': { totalRewardPoints: 4, avgPointsPerOrder: 4, totalOrders: 1 }
    });
  });

});