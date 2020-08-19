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


describe('Testing the parseTimeStamp function', () => {

    test('parseTimeStamp function to be defined', () => {
      expect(rewardsReport.parseTimeStamp).toBeDefined();
    });
  
    test('should be less than 24', () => {
      expect(rewardsReport.parseTimeStamp('2020-07-01T23:59:59-05:00')).toBeLessThan(24);
    });
  
    test('should be greater than or equal to 0', () => {
      expect(rewardsReport.parseTimeStamp('2020-07-01T00:01:59-05:00')).toBeGreaterThanOrEqual(0);
    });
    
  });
  