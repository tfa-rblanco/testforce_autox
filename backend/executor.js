import { chromium, expect } from '@playwright/test';




class PlaywrightExecutor {
    constructor(workflow, headless = false) { // Accept headless as a constructor parameter
        this.workflow = workflow;
        this.headless = headless; // Store the headless value
    }


    async run() {
      
        console.log("Running in headless mode:", this.headless);
        const results = [];
        const browser = await chromium.launch({ headless: this.headless }); // Use the stored headless value
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