const { solveKnapsack } = require('../services/algorithm');

const AFFORDMED_API_BASE = 'http://20.207.122.201/evaluation-service';


const getOptimizedSchedules = async (req, res) => {
    try {

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Missing Authorization header. Please pass your Bearer token." });
        }

        const fetchOptions = {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        };


        const [depotsResponse, vehiclesResponse] = await Promise.all([
            fetch(`${AFFORDMED_API_BASE}/depots`, fetchOptions),
            fetch(`${AFFORDMED_API_BASE}/vehicles`, fetchOptions)
        ]);

        if (!depotsResponse.ok || !vehiclesResponse.ok) {
            return res.status(500).json({ 
                error: "Failed to fetch data from Affordmed API. Ensure your token is valid." 
            });
        }

        const depotsData = await depotsResponse.json();
        const vehiclesData = await vehiclesResponse.json();

        const depots = depotsData.depots || [];
        const vehicles = vehiclesData.vehicles || [];


        const results = depots.map(depot => {
            const capacity = depot.MechanicHours;
            const optimizationResult = solveKnapsack(capacity, vehicles);

            return {
                depotID: depot.ID,
                mechanicHoursAvailable: capacity,
                maxImpactAchieved: optimizationResult.maxImpact,
                scheduledTasks: optimizationResult.selectedTaskIDs
            };
        });


        return res.status(200).json({
            success: true,
            optimizedSchedules: results
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal Server Error: " + error.message
        });
    }
};

module.exports = {
    getOptimizedSchedules
};
