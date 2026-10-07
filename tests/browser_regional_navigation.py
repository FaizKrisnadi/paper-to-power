"""Check regional navigation, country shortcuts, and the place of closing examples."""
import csv
from collections import Counter
from io import StringIO
from pathlib import Path
import os
from playwright.sync_api import sync_playwright, expect

out=Path(os.environ.get('BROWSER_ARTIFACTS','work/design-v3/regional'))
out.mkdir(parents=True,exist_ok=True)
base=os.environ.get('PREVIEW_URL','http://127.0.0.1:4173').rstrip('/')
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
    for width,height in [(1440,1000),(728,724),(390,844)]:
        page_size=10 if width<600 else 50
        page=browser.new_page(viewport={'width':width,'height':height})
        errors=[]
        page.on('pageerror',lambda error: errors.append(str(error)))
        page.goto(base+'/',wait_until='networkidle')
        assert 'Southeast Asia' in page.locator('#chapter-1').inner_text()
        assert 'Sidrap' not in page.locator('#chapter-1').inner_text()
        assert 'Tengeh' not in page.locator('#chapter-1').inner_text()
        assert page.locator('#explorer-section').evaluate('(el)=>!!(el.compareDocumentPosition(document.querySelector("#pilot-studies")) & Node.DOCUMENT_POSITION_FOLLOWING)')
        page.screenshot(path=str(out/f'hero-{width}.png'))
        canvases=[]
        for i in range(1,5):
            page.locator(f'.story-progress a[href="#chapter-{i}"]').click()
            expect(page.locator(f'#chapter-{i}')).to_have_class(__import__('re').compile('is-active'))
            page.wait_for_timeout(2500)
            page.screenshot(path=str(out/f'story-{i}-{width}.png'))
            canvases.append(page.locator('.story-stage__map-canvas canvas').screenshot())
        assert canvases[0]!=canvases[1]!=canvases[2], 'Scroll camera did not change'
        page.get_by_role('combobox',name='Technology',exact=True).select_option('wind')
        page.get_by_text('Review filters',exact=True).click()
        page.get_by_role('combobox',name='Observation status',exact=True).select_option('review_pending')
        response=page.request.get(base+'/downloads/project-evidence.csv')
        assert response.ok
        counts=Counter(row['countryCode'] for row in csv.DictReader(StringIO(response.text())))
        countries=[('Brunei','BRN'),('Indonesia','IDN'),('Cambodia','KHM'),('Laos','LAO'),('Myanmar','MMR'),('Malaysia','MYS'),('Philippines','PHL'),('Singapore','SGP'),('Thailand','THA'),('Vietnam','VNM'),('Timor-Leste','TLS')]
        for name,code in countries:
            page.get_by_role('link',name=f'Explore {name} projects',exact=True).click()
            expect(page.get_by_role('combobox',name='Country',exact=True)).to_have_value(code)
            expect(page.get_by_role('combobox',name='Technology',exact=True)).to_have_value('all')
            expect(page.get_by_role('combobox',name='Observation status',exact=True)).to_have_value('all')
            expect(page.locator('.evidence-table tbody tr')).to_have_count(min(page_size,counts[code]))
            expect(page.get_by_role('heading',name='Explore the regional record')).to_be_in_viewport()
        page.get_by_role('button',name='Clear filters',exact=True).click()
        expect(page.locator('.evidence-table tbody tr')).to_have_count(page_size)
        page.locator('#explorer-section').screenshot(path=str(out/f'explorer-{width}.png'),style='.site-nav{visibility:hidden}')
        page.locator('.country-evidence-section').screenshot(path=str(out/f'countries-{width}.png'),style='.site-nav{visibility:hidden}')
        page.get_by_text('See review coverage by country',exact=True).click()
        expect(page.locator('.country-coverage-details')).to_contain_text('Timor-Leste is included')
        page.get_by_text('See review coverage by country',exact=True).click()
        page.get_by_role('navigation',name='Main navigation').get_by_role('link',name='Case studies',exact=True).click()
        expect(page.get_by_role('heading',name='Inside two project records')).to_be_in_viewport()
        page.locator('#pilot-studies').screenshot(path=str(out/f'closing-examples-{width}.png'),style='.site-nav{visibility:hidden}')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        assert not errors,errors
        print(width,'regional opening, animated camera, 11 country shortcuts, reset filters, closing examples: passed',flush=True)
        page.close()
    browser.close()
