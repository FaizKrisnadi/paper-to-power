"""Verify expanded technology coverage, pagination and full filtered downloads."""
import os,csv
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
out=Path('work/phase-2-refresh/browser');out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
    for width,height in [(1440,1000),(390,844)]:
        page_size=10 if width<600 else 50
        page=browser.new_page(viewport={'width':width,'height':height})
        page.goto('http://127.0.0.1:4173/#explorer-section',wait_until='networkidle')
        expect(page.locator('.filter-bar__count')).to_have_text('Showing 5,136 records')
        page.get_by_role('button',name='Next',exact=True).click()
        expect(page.get_by_role('navigation',name='Project table pages')).to_contain_text(f'{page_size+1}–{page_size*2}')
        page.get_by_role('combobox',name='Technology',exact=True).select_option('geothermal')
        expect(page.locator('.filter-bar__count')).to_have_text('Showing 191 records')
        expect(page.get_by_role('navigation',name='Project table pages')).to_contain_text(f'1–{page_size}')
        with page.expect_download() as d:page.get_by_role('button',name='Export 191 records (CSV)',exact=True).click()
        target=out/f'geothermal-{width}.csv';d.value.save_as(str(target))
        rows=list(csv.DictReader(target.open()));assert len(rows)==191
        assert all(r['observationStatus'] in {'method_not_applicable','coverage_unavailable'} for r in rows)
        page.get_by_role('combobox',name='Technology',exact=True).select_option('pumped_storage')
        expect(page.locator('.filter-bar__count')).to_have_text('Showing 36 records')
        page.get_by_role('combobox',name='Technology',exact=True).select_option('hydro')
        expect(page.locator('.filter-bar__count')).to_have_text('Showing 461 records')
        page.get_by_role('combobox',name='Technology',exact=True).select_option('bioenergy')
        expect(page.locator('.filter-bar__count')).to_have_text('Showing 247 records')
        page.get_by_role('combobox',name='Country',exact=True).select_option('TLS')
        page.get_by_role('combobox',name='Technology',exact=True).select_option('all')
        expect(page.locator('.filter-bar__count')).to_have_text('Showing 2 records')
        page.get_by_role('button',name='Clear filters',exact=True).click()
        page.locator('#explorer-section').screenshot(path=str(out/f'updated-regional-map-{width}.png'),style='.site-nav{visibility:hidden}')
        if width==1440:
            canvas=page.locator('.explorer-map-shell canvas')
            page.wait_for_timeout(1000)
            before=canvas.screenshot()
            canvas.click(position={'x':306,'y':324})
            page.wait_for_timeout(1500)
            assert canvas.screenshot()!=before, 'Cluster click did not expand the map'
        print(width,'new technologies, 11th country, page reset, full export: passed',flush=True)
        page.close()
    browser.close()
