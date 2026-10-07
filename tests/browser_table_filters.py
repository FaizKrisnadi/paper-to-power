"""Table header controls filter the same map and export population."""
import csv,json,os
from collections import Counter
from io import StringIO
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
out=Path('work/stage-reconciliation/table-filters');out.mkdir(parents=True,exist_ok=True)
base=os.environ.get('PREVIEW_URL','http://127.0.0.1:4173').rstrip('/')
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
 for width,height in [(1440,1000),(390,844)]:
  page=browser.new_page(viewport={'width':width,'height':height});errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(base+'/#explorer-section',wait_until='networkidle')
  data=list(csv.DictReader(StringIO(page.request.get(base+'/downloads/project-evidence.csv').text())))
  table=page.locator('.evidence-table')
  expect(table.locator('thead select')).to_have_count(5)
  page.get_by_role('combobox',name='Table country',exact=True).select_option('SGP')
  expect(page.get_by_role('combobox',name='Country',exact=True)).to_have_value('SGP')
  expect(page.locator('.filter-bar__count')).to_have_text('Showing 104 records')
  page.get_by_role('combobox',name='Table technology',exact=True).select_option('solar')
  page.get_by_role('combobox',name='Table reported stage',exact=True).select_option('operating')
  page.get_by_role('combobox',name='Table physical evidence',exact=True).select_option('observed_footprint')
  expect(page.locator('.filter-bar__count')).to_have_text('Showing 1 records')
  expect(table.locator('tbody tr')).to_have_count(1)
  page.get_by_role('combobox',name='Table claim review',exact=True).select_option('reviewed')
  with page.expect_download() as download:page.get_by_role('button',name='Export 1 records (CSV)',exact=True).click()
  target=out/f'filtered-{width}.csv';download.value.save_as(str(target))
  rows=list(csv.DictReader(target.open()));assert len(rows)==1 and rows[0]['countryCode']=='SGP' and rows[0]['claimReviewStatus']=='reviewed'
  page.get_by_role('button',name='Clear filters',exact=True).click()
  assert all(x=='all' for x in table.locator('thead select').evaluate_all('(els)=>els.map(e=>e.value)'))
  page.get_by_role('combobox',name='Table claim review',exact=True).select_option('provider')
  n=sum(r['registryOrigin']=='gem_map' and r['claimReviewStatus']!='reviewed' for r in data)
  expect(page.locator('.filter-bar__count')).to_have_text(f'Showing {n:,} records')
  if width>600:
   page.get_by_role('button',name='Next',exact=True).click()
   page.get_by_role('combobox',name='Table claim review',exact=True).select_option('reviewed')
   expect(page.locator('.filter-bar__count')).to_have_text('Showing 14 records')
   expect(table.locator('tbody tr')).to_have_count(14)
  page.get_by_role('combobox',name='Table claim review',exact=True).select_option('pending')
  n=sum(r['registryOrigin']!='gem_map' and r['claimReviewStatus']!='reviewed' for r in data)
  expect(page.locator('.filter-bar__count')).to_have_text(f'Showing {n:,} records')
  page.get_by_role('link',name='Explore Singapore projects',exact=True).click()
  expect(page.get_by_role('combobox',name='Table claim review',exact=True)).to_have_value('all')
  expect(page.locator('.filter-bar__count')).to_have_text('Showing 104 records')
  page.get_by_role('button',name='Clear filters',exact=True).click()
  page.get_by_role('combobox',name='Technology',exact=True).select_option('wind')
  expect(page.get_by_role('combobox',name='Table technology',exact=True)).to_have_value('wind')
  page.get_by_role('combobox',name='Table country',exact=True).select_option('BRN')
  expect(page.locator('.filter-bar__count')).to_have_text('Showing 0 records')
  expect(table).to_contain_text('No projects match these filters.')
  page.get_by_role('button',name='Clear filters',exact=True).click()
  table.locator('thead').screenshot(path=str(out/f'headers-{width}.png'))
  page.locator('.data-table').screenshot(path=str(out/f'table-{width}.png'))
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert not errors,errors
  print(width,'table filters, combinations, CSV, resets, empty state and responsive layout passed',flush=True)
  page.close()
 browser.close()
