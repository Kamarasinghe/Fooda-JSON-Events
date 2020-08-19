const Database = {};

const TestEvents = [
  {
    action: "new_customer",
    name: "Jessica",
    timestamp: "2020-07-01T00:00:00-05:00"
  },
  {
    action: "new_customer",
    name: "Will",
    timestamp: "2020-07-01T01:00:00-05:00"
  },
  {
    action: "new_customer",
    name: "Elizabeth", 
    timestamp: "2020-07-01T12:00:00-05:00"
  },
  {
    action: "new_order", 
    customer: "Jessica",
    amount: 12.5, 
    timestamp: "2020-07-01T12:15:57-05:00"
  },
  {
    action: "new_order", 
    customer: "Jessica", 
    amount: 16.5, 
    timestamp: "2020-07-01T10:01:00-05:00"
  },
  {
    action: "new_order", 
    customer: "Will", 
    amount: 8.9, 
    timestamp: "2020-07-01T12:20:00-05:00"
  },
  {
    action: "new_order", 
    customer: "Will", 
    amount: 1.5, 
    timestamp: "2020-07-01T12:21:00-05:00"
  }
];

const rewardsReport = {
  handleApiEvents: (events, database) => {
    const Customers = {};

    events.forEach((event) => {
      if (event.action === 'new_customer') {
        Customers[event.name] = { totalRewardPoints: 0, avgPointsPerOrder: 0, totalOrders: 0 };
      } else if (event.action === 'new_order') {
        let customerInfo = database[event.customer] ? database[event.customer] : Customers[event.customer];
        let orderRewardPoints = rewardsReport.calculateRewardPoints(event);

        if (orderRewardPoints === 'discard') {
          return;
        }

        customerInfo.totalOrders += 1;
        customerInfo.totalRewardPoints += orderRewardPoints;
        customerInfo.avgPointsPerOrder = customerInfo.totalRewardPoints / customerInfo.totalOrders;

        Customers[event.customer] = customerInfo;
      }
    });
    
    return Customers;
  },

  calculateRewardPoints: (newOrder) => {
    let rewardPoints;
    let parsedTimeStamp = rewardsReport.parseTimeStamp(newOrder.timestamp);

    if (newOrder.amount < 2 || newOrder.amount > 80) {
      rewardPoints = 'discard';
    } else if (parsedTimeStamp >= 12 && parsedTimeStamp < 13) {
      rewardPoints = Math.ceil(newOrder.amount / 3);
    } else if ((parsedTimeStamp >= 11 && parsedTimeStamp < 12) || (parsedTimeStamp >= 13 && parsedTimeStamp < 14)) {
      rewardPoints = Math.ceil(newOrder.amount / 2);
    } else if ((parsedTimeStamp >= 10 && parsedTimeStamp < 11) || (parsedTimeStamp >= 14 && parsedTimeStamp < 15)) {
      rewardPoints = Math.ceil(newOrder.amount);
    } else {
      rewardPoints = Math.ceil(newOrder.amount * 0.25);
    }

    return rewardPoints < 3 || rewardPoints > 20 || rewardPoints === 'discard' ? 'discard' : rewardPoints;
  },

  parseTimeStamp: (timestamp) => {
    return parseInt(timestamp.substring(11, 13));
  },

  createReport: (customers) => {
    let result = [];
    let collectedCustomers = rewardsReport.collectCustomersIntoArray(customers);
    let sortedCustomers = rewardsReport.sortByTotalRewardPoints(collectedCustomers);

    sortedCustomers.forEach((customer, idx) => {
      let pointOrPoints = rewardsReport.determineIfPointOrPoints(customer.totalRewardPoints);

      if (customer.totalRewardPoints === 0) {
        result.push(`${customer.name}: No orders.`);
      } else if (idx === 0) {
        result.push(`${customer.name}: ${customer.totalRewardPoints} ${pointOrPoints} with ${customer.avgPointsPerOrder} ${pointOrPoints} per order.`);
      } else {
        result.push(`${customer.name}: ${customer.totalRewardPoints} ${pointOrPoints} with ${customer.avgPointsPerOrder} per order.`);
      }
    });

    return result.join('\n');
  },
  
  determineIfPointOrPoints: (val) => {
    return val > 1 ? 'points' : 'point';
  },

  collectCustomersIntoArray: (customers) => {
    let names = Object.keys(customers);
    let collectedCustomers = [];

    names.forEach((name) => {
      collectedCustomers.push({ name, ...customers[name] });
    });

    return collectedCustomers;
  },
  
  sortByTotalRewardPoints: (customers) => {
    return customers.sort((a, b) => {
      return b.totalRewardPoints - a.totalRewardPoints;
    });
  }
};

let customers = rewardsReport.handleApiEvents(TestEvents, Database);
Object.assign(Database, customers);
let report = rewardsReport.createReport(Database);

// console.log(report);

module.exports = rewardsReport;