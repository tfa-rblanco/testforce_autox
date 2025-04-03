import express, { json } from 'express';
import cors from 'cors';
import PlaywrightExecutor from './executor.js';
import { launchInspectableBrowser } from './inspectorLauncher.js';
import fs from 'fs';
const app = express();
app.use(cors());
app.use(json());

const configPath = './config.json';

app.post('/execute', async (req, res) => {
  try {


    const headlessParam = req.query.headless; // Extract param value
    if (headlessParam !== 'true' && headlessParam !== 'false') {
        console.log("Invalid value. Use headless=true or headless=false");
        return res.status(400).json({ error: "Invalid value. Use headless=true or headless=false" });
    }

     console.log("Headless:",headlessParam)
     const newConfig = { headless:headlessParam === 'true' }; // Convert string to boolean
     fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), 'utf-8');

    const workflow = req.body;

    console.log('Received workflow:', workflow);
    const executor = new PlaywrightExecutor(workflow);
    const results = await executor.run();
    res.json({ status: 'Workflow executed successfully', results }); 
  } catch (error) {
    console.error("Execution error:", error);
    res.status(500).json({ error: error.message });
  }
});

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

app.listen(4000, () => console.log('Server running on port 3000'));
