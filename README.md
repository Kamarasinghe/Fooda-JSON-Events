# Fooda-JSON-Events
Tests can be executed by running: 'npm run test'
Uncomment line 140 to see results printed on console

************************************************************************************* 

- Create "Database" object

<----------------------- Handling JSON from API ----------------------->

- Create "Customers" object
- Given a JSON object containing a collection of events
- Iterate through data
- Check if "new_order" or "new_customer" - assuming can't place order before becoming customer

  - "new_customer"
    - Create object in "Customers" with "name" as key and { "totalRewardPoints": 0, "avgPointsPerOrder": 0, "totalOrders": 0 } as value

  - "new_order" 
    - If "name" does NOT exist in "Customers"
      - Query "Database" for customer info
      - Combine query result with "Customers"

    - Create var "orderRewardPoints"
    - Convert "timestamp" to local timestamp (assuming timestamp in 24hours)

    - If order "amount" is <= $2 OR "amount" is > than $80
        - Next event

    - Else if "timestamp" between 12PM-12:59:59PM 
        - "orderRewardPoints" = "amount" divided by 3 and rounded up

    - Else if "timestamp" between 11AM - 11:59:59AM OR between 1PM - 1:59:59PM
        - "orderRewardPoints" = "amount" divided by 2 and rounded up

    - Else if "timestamp" between 10AM - 10:59:59AM OR between 2PM - 2:59:59PM
        - "orderRewardPoints" = "amount" rounded up

    - Else
        - "orderRewardPoints" = "amount" divided by 0.25 and rounded up

    - Add "orderRewardPoints" to "totalRewardPoints" value in corresponding customer object of "Customers"
    
    - Add 1 to "totalOrders" in corresponding customer object of "Customers"

    - Set value of "totalRewardPoints" divided by "totalOrders" to "avgPointsPerOrder" in corresponding customer object of "Customers"

- Save "Customers" to "Database" (combine the two using spread operator)


<----------------------- Sorting by total rewards (desc) ----------------------->

- Takes in array of objects
- Create empty array var "result"
- Use native Javascript "sort" method - sort by "totalRewardPoints"
- Iterate through sorted with index count
  - Assign result of "determineIfPointOrPoints" to var "pointOrPoints"

  - If "totalRewardPoints" = 0
    - Append "${customerName}: No orders."
  - Else if index count = 0
    - Append "${customerName}: ${totalPoints} ${pointOrPoints} with ${avgPointsPerOrder} ${pointOrPoints} per order."
  - Else
    - Append "${customerName}: ${totalPoints} ${pointOrPoints} with ${avgPointsPerOrder} per order."

- Join with line break and return "result"


<----------------------- Helper "determineIfPointOrPoints" ----------------------->

- Takes in int
- If int is greater than 1
  - Return "points"
- Else
  - Return "point"
  
***************************************************************************************