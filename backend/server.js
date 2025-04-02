import express, { json } from 'express';
import cors from 'cors';
import PlaywrightExecutor from './executor.js';
import { launchInspectableBrowser } from './inspectorLauncher.js';

const app = express();
app.use(cors());
app.use(json());

app.post('/execute', async (req, res) => {
  try {
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

app.listen(3000, () => console.log('Server running on port 3000'));
