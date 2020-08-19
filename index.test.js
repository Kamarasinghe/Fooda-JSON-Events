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
  

describe('Testing the calculateRewardPoints function', () => {

	test('calculateRewardPoints function to be defined', () => {
		expect(rewardsReport.calculateRewardPoints).toBeDefined();
	});

	test('should return the proper reward points - time edge cases', () => {
		let order1 = { amount: 20, timestamp: '2020-07-01T00:00:59-05:00' };
		let order2 = { amount: 14, timestamp: '2020-07-01T12:01:00-05:00' };
		let order3 = { amount: 10, timestamp: '2020-07-01T11:59:59-05:00' };
		let order4 = { amount: 5, timestamp: '2020-07-01T10:00:01-05:00' };
		let order5 = { amount: 17, timestamp: '2020-07-01T01:59:59-05:00' };

		expect(rewardsReport.calculateRewardPoints(order1)).toEqual(5);
		expect(rewardsReport.calculateRewardPoints(order2)).toEqual(5);
		expect(rewardsReport.calculateRewardPoints(order3)).toEqual(5);
		expect(rewardsReport.calculateRewardPoints(order4)).toEqual(5);
		expect(rewardsReport.calculateRewardPoints(order5)).toEqual(5);
	});

	test('should "discard" order edge cases', () => {
		// Between 12 and 13
		let order1 = { amount: 5.99, timestamp: '2020-07-01T12:00:59-05:00' };
		let order2 = { amount: 60.01, timestamp: '2020-07-01T12:59:00-05:00' };

		// Between 11 and 12 OR between 13 and 14
		let order3 = { amount: 3.99, timestamp: '2020-07-01T11:59:59-05:00' };
		let order4 = { amount: 40.01, timestamp: '2020-07-01T13:00:01-05:00' };

		// Between 10 and 11 OR between 14 and 15
		let order5 = { amount: 1.99, timestamp: '2020-07-01T10:59:59-05:00' };
		let order6 = { amount: 20.01, timestamp: '2020-07-01T14:59:59-05:00' };

		// Any other time
		let order7 = { amount: 8, timestamp: '2020-07-01T08:59:59-05:00' };
		let order8 = { amount: 80.01, timestamp: '2020-07-01T23:59:59-05:00' };

		expect(rewardsReport.calculateRewardPoints(order1)).toEqual('discard');
		expect(rewardsReport.calculateRewardPoints(order2)).toEqual('discard');
		expect(rewardsReport.calculateRewardPoints(order3)).toEqual('discard');
		expect(rewardsReport.calculateRewardPoints(order4)).toEqual('discard');
		expect(rewardsReport.calculateRewardPoints(order5)).toEqual('discard');
		expect(rewardsReport.calculateRewardPoints(order6)).toEqual('discard');
		expect(rewardsReport.calculateRewardPoints(order7)).toEqual('discard');
		expect(rewardsReport.calculateRewardPoints(order8)).toEqual('discard');
	});

});


describe('Testing the determineIfPointOrPoints function', () => {

  test('determineIfPointOrPoints function to be defined', () => {
    expect(rewardsReport.determineIfPointOrPoints).toBeDefined();
  });

  test('should return the collect string', () => {
    expect(rewardsReport.determineIfPointOrPoints('1')).toEqual('point');
    expect(rewardsReport.determineIfPointOrPoints('2')).toEqual('points');
  });

});


describe('Testing the collectCustomersIntoArray function', () => {

  let testDatabase = {
    Jessica: { totalRewardPoints: 22, avgPointsPerOrder: 11, totalOrders: 2 },
    Will: { totalRewardPoints: 3, avgPointsPerOrder: 3, totalOrders: 1 },
  };

  let result = rewardsReport.collectCustomersIntoArray(testDatabase);

  test('collectCustomersIntoArray function to be defined', () => {
    expect(rewardsReport.collectCustomersIntoArray).toBeDefined();
  });

  test('should return an array of objects', () => {
    expect(Array.isArray(result)).toBeTruthy();
    expect(result[0].name).toEqual('Jessica');
  });

});


describe('Testing the sortByTotalRewardPoints function', () => {

  let unsorted =  [ 
    { name: 'Will', totalRewardPoints: 3, avgPointsPerOrder: 3, totalOrders: 1 },
    { name: 'Elizabeth', totalRewardPoints: 0, avgPointsPerOrder: 0, totalOrders: 0 },
    { name: 'Kevin', totalRewardPoints: 0, avgPointsPerOrder: 0, totalOrders: 0 },
    { name: 'Jessica', totalRewardPoints: 22, avgPointsPerOrder: 11, totalOrders: 2 }
  ];

  let sorted = [
    { name: 'Jessica', totalRewardPoints: 22, avgPointsPerOrder: 11, totalOrders: 2 },
    { name: 'Will', totalRewardPoints: 3, avgPointsPerOrder: 3, totalOrders: 1 },
    { name: 'Elizabeth', totalRewardPoints: 0, avgPointsPerOrder: 0, totalOrders: 0 },
    { name: 'Kevin', totalRewardPoints: 0, avgPointsPerOrder: 0, totalOrders: 0 }
  ]

  test('sortByTotalRewardPoints function to be defined', () => {
    expect(rewardsReport.sortByTotalRewardPoints).toBeDefined();
  });

  test('properly sorts in descending order an array of objects', () => {
    expect(rewardsReport.sortByTotalRewardPoints(unsorted)).toEqual(sorted);
  });

});


describe('Testing the createReport function', () => {

  test('createReport function to be defined', () => {
    expect(rewardsReport.createReport).toBeDefined();
  });

  test('should return specific string(s)', () => {
    let customers1 = [{ name: 'Kevin', totalRewardPoints: 0, avgPointsPerOrder: 0, totalOrders: 0 }];
    let customers1Results = 'Kevin: No orders.'

    let customers2 = [
      { name: 'Kevin', totalRewardPoints: 0, avgPointsPerOrder: 0, totalOrders: 0 },
      { name: 'Jessica', totalRewardPoints: 22, avgPointsPerOrder: 11, totalOrders: 2 }
    ];
    let customers2Results = `Jessica: 22 points with 11 points per order.\nKevin: No orders.`;

    let customers3 = [
      { name: 'Elizabeth', totalRewardPoints: 0, avgPointsPerOrder: 0, totalOrders: 0 },
      { name: 'Will', totalRewardPoints: 3, avgPointsPerOrder: 3, totalOrders: 1 },
      { name: 'Jessica', totalRewardPoints: 22, avgPointsPerOrder: 11, totalOrders: 2 }
    ];
    let customers3Results = `Jessica: 22 points with 11 points per order.\nWill: 3 points with 3 per order.\nElizabeth: No orders.`;

    expect(rewardsReport.createReport(customers1)).toEqual(customers1Results);
    expect(rewardsReport.createReport(customers2)).toEqual(customers2Results);
    expect(rewardsReport.createReport(customers3)).toEqual(customers3Results);
  });

});