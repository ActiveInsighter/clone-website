// Re-run with Playwright available to capture the same-origin font and canvas textures.
const {chromium}=require('playwright');const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');const key='www-anthropic-com-b19f62ae/claude-opus-5-5-ad96d446';
const assets=path.join(root,'public/sites',key);const research=path.join(root,'docs/research',key);const shots=path.join(root,'docs/design-references',key);
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox'],proxy:process.env.HTTPS_PROXY?{server:process.env.HTTPS_PROXY}:undefined});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const jobs=[];const manifest=[];let texture=0;
 page.on('response',response=>{
  const url=response.url();let rel;
  if(url.includes('.woff2')) rel='fonts/'+url.split('/').pop().split('_Web')[0].split('_VF')[0]+'.woff2';
  else if(url.includes('.webp?'))rel='images/hero-'+texture+++'.webp';
  else if(url.includes('favicon-32x32'))rel='favicon.png';
  if(!rel||response.status()!==200)return;
  jobs.push((async()=>{const body=await response.body();const dest=path.join(assets,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,body);manifest.push({url,path:path.relative(root,dest),bytes:body.length});})());
 });
 await page.goto('https://www.anthropic.com/claude-opus-5-5',{waitUntil:'networkidle',timeout:60000});await Promise.all(jobs);
 for(const y of [0,300,900]){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(600);await page.screenshot({path:path.join(shots,'hero-scroll-'+y+'.png')});}
 fs.writeFileSync(path.join(research,'asset-manifest.json'),JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest,null,2));await browser.close();
})();
