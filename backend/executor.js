import { chromium, expect } from '@playwright/test';
import fs from 'fs';



class PlaywrightExecutor {
  constructor(workflow) {
    this.workflow = workflow;
  }




  async run() {
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

    const headless = config.headless === true;
    console.log(headless)
    const results = [];
    const browser = await chromium.launch({ headless: headless });  // how to make this dynamically value headless: true
    const page = await browser.newPage();



    for (const step of this.workflow.steps) {
      const result = { ...step, status: 'pending', message: '' };

      try {
        console.log(`Executing: ${step.action} on ${step.selector || step.url}`);
        switch (step.action) {
          case 'Navigate':
            await page.goto(step.url);
            break;

          case 'Click':
            await page.click(step.selector);
            break;

          case 'Type':
            await page.fill(step.selector, step.value);
            break;

          case 'Assert':
            const text = await page.textContent(step.selector);
            try {
              expect(text).toBe(step.expected);
              result.status = 'passed';
            } catch (assertionError) {
              result.status = 'failed';
              result.message = assertionError.message; // detailed playwright error
            }
            break;

          default:
            result.status = 'failed';
            result.message = `Unknown action: ${step.action}`;
        }

        // If passed without throwing (and not set by assertion)
        if (result.status === 'pending') {
          result.status = 'passed';
        }
      } catch (error) {
        result.status = 'failed';
        result.message = error.message;
      }

      results.push(result);
    }

    await browser.close();
    return results;
  }
}

export default PlaywrightExecutor;
