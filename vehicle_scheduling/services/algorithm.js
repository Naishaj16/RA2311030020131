/**
 * Dynamic Programming Algorithm for the 0/1 Knapsack Problem.
 * Solves the Vehicle Maintenance Scheduling challenge efficiently.
 * 
 * Capacity = MechanicHours
 * Weight = Duration
 * Value = Impact
 */

function solveKnapsack(capacity, vehicles) {
    const n = vehicles.length;
    // dp[i][w] represents the max impact using the first i items with weight limit w
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));

    // Build the DP table
    for (let i = 1; i <= n; i++) {
        const item = vehicles[i - 1];
        const weight = item.Duration;
        const value = item.Impact;

        for (let w = 1; w <= capacity; w++) {
            if (weight <= w) {
                // Max of (including the item) OR (not including the item)
                dp[i][w] = Math.max(value + dp[i - 1][w - weight], dp[i - 1][w]);
            } else {
                // Item is too heavy, cannot include
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    // Backtrack to determine exactly which TaskIDs were selected to achieve the max impact
    let res = dp[n][capacity];
    const maxImpact = res;
    let w = capacity;
    const selectedTaskIDs = [];

    for (let i = n; i > 0 && res > 0; i--) {
        // If the value came from the row above, item was NOT included
        if (res !== dp[i - 1][w]) {
            // Item WAS included
            const item = vehicles[i - 1];
            selectedTaskIDs.push(item.TaskID);
            
            // Deduct the value and weight to trace back further
            res -= item.Impact;
            w -= item.Duration;
        }
    }

    return {
        maxImpact: maxImpact,
        selectedTaskIDs: selectedTaskIDs.reverse() // Keep somewhat original order
    };
}

module.exports = {
    solveKnapsack
};
