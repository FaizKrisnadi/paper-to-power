"""Stage filters remain independent of review status and research-wide phase scopes."""
import csv,json,os
from collections import Counter
from io import StringIO
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
out=Path('work/stage-reconciliation/browser');out.mkdir(parents=True,exist_ok=True)
base=os.environ.get('PREVIEW_URL','http://127.0.0.1:4173').rstrip('/')
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
    results=[]
    for width,height in [(1440,1000),(728,724),(390,844)]:
        page=browser.new_page(viewport={'width':width,'height':height});errors=[];console=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('console',lambda m:console.append(m.text) if m.type=='error' else None)
        page.goto(base+'/#explorer-section',wait_until='networkidle')
        data=list(csv.DictReader(StringIO(page.request.get(base+'/downloads/project-evidence.csv').text())))
        counts=Counter(r['projectStage'] for r in data)
        assert len(data)==5136
        stage=page.get_by_role('combobox',name='Project stage',exact=True)
        expect(stage).to_be_visible()
        expect(page.get_by_role('combobox',name='Observation status',exact=True)).not_to_be_visible()
        for value,n in counts.items():
            stage.select_option(value)
            expect(page.locator('.filter-bar__count')).to_have_text(f'Showing {n:,} records')
            expect(page.locator('.evidence-table tbody tr')).to_have_count(min(n,10 if width<600 else 50))
        stage.select_option('operating')
        with page.expect_download() as download:page.get_by_role('button',name=f'Export {counts["operating"]} records (CSV)',exact=True).click()
        target=out/f'operating-{width}.csv';download.value.save_as(str(target))
        exported=list(csv.DictReader(target.open()));assert len(exported)==counts['operating'] and all(r['projectStage']=='operating' for r in exported)
        page.get_by_role('searchbox').fill('Minut')
        expect(page.locator('.evidence-table tbody tr')).to_have_count(1)
        expect(page.get_by_role('button',name='Likupang Solar Power',exact=True)).to_be_visible()
        page.get_by_role('button',name='Clear filters',exact=True).click()
        expect(page.get_by_role('searchbox')).to_have_value('')
        stage.select_option('mixed_stage');page.get_by_role('searchbox').fill('Truong')
        page.get_by_role('button',name='Truong Son Wind Farm',exact=True).click()
        expect(page.locator('.project-drawer')).to_contain_text('Multiple stages')
        expect(page.get_by_role('region',name='Related project phases')).to_be_visible()
        page.locator('.project-drawer').screenshot(path=str(out/f'phase-overview-{width}.png'))
        page.get_by_role('region',name='Related project phases').get_by_role('button',name='Truong Son wind farm · 1',exact=False).click()
        expect(page.locator('#project-detail-title')).to_have_text('Truong Son wind farm · 1')
        expect(stage).to_have_value('all');expect(page.get_by_role('searchbox')).to_have_value('')
        page.get_by_role('button',name='Close project details',exact=True).click()
        page.get_by_role('searchbox').fill('no project name matches this phrase')
        page.get_by_role('link',name='Explore Singapore projects',exact=True).click()
        expect(page.get_by_role('searchbox')).to_have_value('')
        expect(page.locator('.filter-bar__count')).to_have_text('Showing 104 records')
        page.get_by_role('button',name='Clear filters',exact=True).click()
        page.get_by_text('Review filters',exact=True).click()
        page.get_by_role('combobox',name='Observation status',exact=True).select_option('observed_footprint')
        expect(page.locator('.filter-bar__count')).to_have_text('Showing 2 records')
        stage.select_option('operating');expect(page.locator('.filter-bar__count')).to_have_text('Showing 2 records')
        page.get_by_role('button',name='Clear filters',exact=True).click()
        page.get_by_text('Review filters',exact=True).click()
        expect(page.get_by_role('combobox',name='Observation status',exact=True)).not_to_be_visible()
        page.reload(wait_until='networkidle')
        expect(page.locator('.filter-bar__count')).to_have_text('Showing 5,136 records')
        page.locator('#explorer-section').screenshot(path=str(out/f'stage-explorer-{width}.png'),style='.site-nav{visibility:hidden}')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        assert not errors and not console,(errors,console)
        results.append({'viewport':[width,height],'passed':['all stage populations','secondary review filter','full stage CSV export','provider alias search','clear search','phase overview navigation','country reset','independent stage and observation filters','no errors or overflow']})
        print(width,'stage filters and reconciliation navigation: passed',flush=True);page.close()
    browser.close();(out/'results.json').write_text(json.dumps(results,indent=2))
