import express, { json } from 'express';
import cors from 'cors';
import PlaywrightExecutor from './executor.js';
import { launchInspectableBrowser } from './inspectorLauncher.js';
import fs from 'fs';
import path from 'path'; // Import the 'path' module

const app = express();
app.use(cors());
app.use(json());



// Middleware to handle headless parameter validation
const validateHeadlessParam = (req, res, next) => {
    const headlessParam = req.query.headless;
    if (headlessParam !== undefined && headlessParam !== 'true' && headlessParam !== 'false') {
        console.log("Invalid value for 'headless' parameter. Use headless=true or headless=false");
        return res.status(400).json({ error: "Invalid value for 'headless' parameter. Use headless=true or headless=false" });
    }
    req.headless = headlessParam === 'true'; // Store the boolean value in the request object
    next();
};



// ENDPOINT: /execute
// This endpoint executes a workflow using PlaywrightExecutor
app.post('/execute', validateHeadlessParam, async (req, res) => {
    try {
        const workflow = req.body;
        console.log('Received workflow:', workflow);

       
        const executor = new PlaywrightExecutor(workflow, req.headless); // Pass headless to the executor
        const results = await executor.run();
        res.json({ status: 'Workflow executed successfully', results });
    } catch (error) {
        console.error("Execution error:", error);
        res.status(500).json({ error: error.message });
    }
});

// ENDPOINT:: /launch-browser
// This endpoint launches the browser with inspector enabled
app.post('/launch-browser', async (req, res) => {
    const { url } = req.body;

    try {
        await launchInspectableBrowser(url || 'https://example.com');
        res.json({ status: 'Browser launched with inspector' });
    } catch (error) {
        console.error("Failed to launch browser:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(4000, () => console.log('Server running on port 4000'));