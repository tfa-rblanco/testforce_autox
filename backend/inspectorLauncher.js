import { chromium } from 'playwright';

export async function launchInspectableBrowser(url = 'https://example.com') {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Inject script to send mouseover data to ws://localhost:8000
  await page.addInitScript(() => {
    const ws = new WebSocket('ws://localhost:8000');

    ws.onopen = () => {
      const addClickListener = () => {
        if (!document.body) return; // Ensure document.body exists
        document.body.addEventListener('click', (e) => {
          const el = e.target;
          const attrs = {
            tag: el.tagName.toLowerCase(),
            text: el.innerText || el.textContent,
            id: el.id,
            class: el.className,
            name: el.getAttribute('name'),
            alt: el.getAttribute('alt'),
            title: el.getAttribute('title'),
            role: el.getAttribute('role'),
            placeholder: el.getAttribute('placeholder'),
            label: el.getAttribute('aria-label'),
            testid: el.getAttribute('data-testid'),
          };
          ws.send(JSON.stringify(attrs));
        });
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addClickListener);
      } else {
        addClickListener();
      }
    };
  });

  await page.goto(url);
  return browser;
}
