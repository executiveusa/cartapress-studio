"""Run: python tests/browser_smoke.py -- verifies portable HTML without remote services."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

ROOT=Path(__file__).resolve().parents[1]
async def main():
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
        for label,width,height in [('desktop',1320,880),('mobile',390,844)]:
            page=await browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
            await page.set_content((ROOT/'demo-menu.html').read_text(encoding='utf-8'),wait_until='load')
            await page.locator('.dish').first.wait_for()
            assert await page.locator('.dish').count()==8
            assert await page.locator('.dish:visible').count()==8
            assert await page.locator('html').evaluate('(el)=>el.scrollWidth<=window.innerWidth'), f'{label}: horizontal overflow'
            await page.screenshot(path=str(ROOT/f'demo-digital-{label}.png'),full_page=True)
            await page.get_by_role('button',name='MAINS').click()
            assert await page.locator('.dish:visible').count()==3
            await page.get_by_role('button',name='All',exact=True).click()
            await page.locator('#search').fill('artichokes')
            assert await page.locator('.dish:visible').count()==1
            await page.locator('#search').fill('definitelymissing')
            assert await page.locator('#empty').is_visible()
            print(f'{label}: PASS 8 dishes, category filter, search, empty state, no horizontal overflow')
            await page.close()
        await browser.close()
if __name__=='__main__': asyncio.run(main())
