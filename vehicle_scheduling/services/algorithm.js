

function solveKnapsack(capacity, vehicles) {
    const n = vehicles.length;

    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));


    for (let i = 1; i <= n; i++) {
        const item = vehicles[i - 1];
        const weight = item.Duration;
        const value = item.Impact;

        for (let w = 1; w <= capacity; w++) {
            if (weight <= w) {

                dp[i][w] = Math.max(value + dp[i - 1][w - weight], dp[i - 1][w]);
            } else {

                dp[i][w] = dp[i - 1][w];
            }
        }
    }


    let res = dp[n][capacity];
    const maxImpact = res;
    let w = capacity;
    const selectedTaskIDs = [];

    for (let i = n; i > 0 && res > 0; i--) {

        if (res !== dp[i - 1][w]) {

            const item = vehicles[i - 1];
            selectedTaskIDs.push(item.TaskID);

            res -= item.Impact;
            w -= item.Duration;
        }
    }

    return {
        maxImpact: maxImpact,
        selectedTaskIDs: selectedTaskIDs.reverse()
    };
}

module.exports = {
    solveKnapsack
};
