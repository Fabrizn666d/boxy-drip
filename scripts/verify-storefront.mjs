// Browser checks using Chrome's debugging protocol; no testing dependency required.
// Start a headless Chrome on port 9223 and the storefront on port 3000 first.
import { mkdir, writeFile } from "node:fs/promises";

const origin = process.env.BOXY_TEST_ORIGIN ?? "http://localhost:3000";
const tabs = await fetch("http://127.0.0.1:9223/json").then((response) => response.json());
const tab = tabs.find((entry) => entry.type === "page");
if (!tab) throw new Error("No Chrome page available on debugging port 9223");
const socket = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve) => socket.addEventListener("open", resolve, { once: true }));
let id = 0;
const pending = new Map();
const browserErrors = [];
socket.addEventListener("message", ({ data }) => {
  const packet = JSON.parse(data);
  if (packet.id) {
    const handlers = pending.get(packet.id);
    pending.delete(packet.id);
    if (packet.error) handlers.reject(new Error(JSON.stringify(packet.error)));
    else handlers.resolve(packet.result);
  } else if (packet.method === "Runtime.exceptionThrown") browserErrors.push(packet.params.exceptionDetails.text + ": " + (packet.params.exceptionDetails.exception?.description ?? ""));
  else if (packet.method === "Runtime.consoleAPICalled" && packet.params.type === "error") browserErrors.push(packet.params.args.map((arg) => arg.value ?? arg.description).join(" "));
});
const call = (method, params = {}) => new Promise((resolve, reject) => { const requestId = ++id; pending.set(requestId, { resolve, reject }); socket.send(JSON.stringify({ id: requestId, method, params })); });
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const evaluate = async (expression) => {
  const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  return result.result.value;
};
const waitFor = async (expression, message) => {
  for (let attempt = 0; attempt < 40; attempt++) {
    if (await evaluate(expression)) return;
    await delay(100);
  }
  throw new Error(message);
};
const navigate = async (route, width = 1440, height = 1000) => {
  await call("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 768 });
  await call("Page.navigate", { url: origin + route });
  const expectedPath = JSON.stringify(new URL(origin + route).pathname);
  let loaded = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    await delay(200);
    if (await evaluate(`location.pathname===${expectedPath} && document.readyState==='complete' && Boolean(document.title) && Boolean(document.querySelector('main'))`)) { loaded = true; break; }
  }
  if (!loaded) throw new Error(`Page did not become ready: ${route}`);
  await evaluate("document.fonts.ready.then(() => true)");
  await evaluate(`Promise.all([...document.querySelectorAll('main img')].filter(i=>i.getClientRects().length>0&&i.getBoundingClientRect().top<innerHeight).map(i=>i.decode().catch(()=>{})))`);
  await delay(1800);
};
const checks = [];
const links = new Set();
await call("Page.enable"); await call("Page.navigate", { url:"about:blank" }); await delay(200);
await call("Runtime.enable"); await call("Network.enable"); await call("Network.setCacheDisabled", { cacheDisabled: true });
await mkdir(".visual-check", { recursive: true });
const screenshot = async (name, full = false) => {
  if (full) {
    await evaluate(`(async()=>{ const root=document.documentElement; const behavior=root.style.scrollBehavior; root.style.scrollBehavior='auto'; for(let y=0;y<root.scrollHeight;y+=innerHeight){window.scrollTo({top:y,behavior:'instant'}); await new Promise(r=>setTimeout(r,100));} await new Promise(r=>setTimeout(r,700)); await Promise.all([...document.querySelectorAll('main img')].filter(i=>i.getClientRects().length>0&&i.complete).map(i=>i.decode().catch(()=>{}))); window.scrollTo({top:0,behavior:'instant'}); root.style.scrollBehavior=behavior; })()`);
    await delay(700);
  }
  const metrics = await call("Page.getLayoutMetrics");
  const size = metrics.cssContentSize;
  const result = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: full, ...(full ? { clip: { x: 0, y: 0, width: size.width, height: size.height, scale: 1 } } : {}) });
  await writeFile(`.visual-check/${name}.png`, Buffer.from(result.data, "base64"));
  if (full && name.startsWith('home')) {
    const top = await call("Page.captureScreenshot", { format:"png",captureBeyondViewport:false });
    await writeFile(`.visual-check/${name}-top.png`, Buffer.from(top.data,"base64"));
  }
};
const inspect = async (label) => {
  const state = await evaluate(`(() => ({ title:document.title, width:innerWidth, scrollWidth:document.documentElement.scrollWidth, images:[...document.querySelectorAll('main img')].filter(i=>i.getClientRects().length>0&&i.getBoundingClientRect().top<innerHeight&&(!i.complete||i.naturalWidth===0)).map(i=>i.src), links:[...document.querySelectorAll('a[href^="/"]')].map(a=>a.getAttribute('href')), whatsapp:[...document.querySelectorAll('a[href*="wa.me"]')].map(a=>a.href) }))()`);
  state.links.forEach((href) => links.add(href.split("#")[0]));
  checks.push({ label, title: state.title, width: state.width, overflow: state.scrollWidth > state.width, unloadedImages: state.images.length, whatsappNumberCorrect: state.whatsapp.every((href) => new URL(href).pathname === "/51986176298") });
};
if (process.argv.includes("--responsive")) {
  const sizes=[[360,800],[375,812],[390,844],[393,873],[412,915],[430,932],[768,1024],[1024,768],[1280,800],[1440,900],[1920,1080]];
  const captureSection=async(selector,name)=>{
    await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'start',behavior:'instant'})`); await delay(900);
    const clip=await evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:0,y:r.top+scrollY,width:innerWidth,height:r.height,scale:1}})()`);
    await evaluate(`document.querySelector('.main-header').style.visibility='hidden';document.querySelector('.whatsapp-float')?.style.setProperty('visibility','hidden')`);
    const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip});
    await writeFile(`.visual-check/${name}.png`,Buffer.from(shot.data,'base64'));
    await evaluate(`document.querySelector('.main-header').style.removeProperty('visibility');document.querySelector('.whatsapp-float')?.style.removeProperty('visibility')`);
  };
  for(const [width,height] of sizes){
    await call('Emulation.setTouchEmulationEnabled',{enabled:width<=768,maxTouchPoints:1});
    await navigate('/',width,height);
    const state=await evaluate(`(()=>{
      const rect=s=>document.querySelector(s).getBoundingClientRect();const art=rect('.bd-hero-art img');const img=document.querySelector('.bd-hero-art img');const scale=Math.min(art.width/img.naturalWidth,art.height/img.naturalHeight);const artHeight=img.naturalHeight*scale;const artWidth=img.naturalWidth*scale;const top=art.bottom-artHeight;
      const benefits=rect('.bd-hero-benefits');const actions=rect('.bd-hero-actions');
      const offenders=[...document.querySelectorAll('main *,#footer *,.main-header')].filter(el=>{
        const r=el.getBoundingClientRect();if(!el.checkVisibility()||r.width===0||r.left>=-1&&r.right<=innerWidth+1)return false;
        let parent=el.parentElement;while(parent&&parent!==document.body){const o=getComputedStyle(parent).overflowX;if(['hidden','clip','auto','scroll'].includes(o))return false;parent=parent.parentElement;}return true;
      }).map(el=>({tag:el.tagName,class:el.className,left:Math.round(el.getBoundingClientRect().left),right:Math.round(el.getBoundingClientRect().right)}));
      return {title:document.title,width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,bodyOverflow:getComputedStyle(document.body).overflowX,offenders,assets:[...document.querySelectorAll('.bd-hero img')].map(img=>({src:img.getAttribute('src'),complete:img.complete&&img.naturalWidth>0,fit:getComputedStyle(img).objectFit})),heroHeight:rect('.bd-hero').height,foregroundTop:top,buttonsBottom:actions.bottom,foregroundBottom:art.bottom,benefitsTop:benefits.top,foregroundWidth:artWidth,productsDisplay:getComputedStyle(document.querySelector('.bd-products-grid')).display,cardWidth:rect('.drop-card').width,trustColumns:getComputedStyle(document.querySelector('.trust-inner')).gridTemplateColumns,footerColumns:getComputedStyle(document.querySelector('.footer-inner')).gridTemplateColumns,footerClosed:[...document.querySelectorAll('.footer-link-group details')].every(d=>!d.open)};
    })()`);
    if(state.overflow||state.offenders.length||state.assets.some(a=>!a.complete))throw Error(`Responsive layout failed ${width}: ${JSON.stringify(state)}`);
    if(width<=760&&(state.productsDisplay!=='flex'||state.cardWidth>321||state.foregroundTop<state.buttonsBottom-3||state.foregroundBottom>state.benefitsTop+3||!state.footerClosed||state.trustColumns.split(' ').length!==2))throw Error(`Mobile composition failed ${width}: ${JSON.stringify(state)}`);
    if(width===768&&(state.productsDisplay!=='grid'||state.footerColumns.split(' ').length!==2))throw Error(`Tablet composition failed: ${JSON.stringify(state)}`);
    await screenshot(`responsive-hero-${width}`);
    for(const [selector,name] of [['#inicio','hero-full'],['#productos','products'],['#tienda','location'],['#footer','footer']])await captureSection(selector,`responsive-${name}-${width}`);
    if(width<=760){
      await evaluate(`document.querySelector('.footer-link-group summary').click()`);await delay(200);
      if(!(await evaluate(`document.querySelector('.footer-link-group details').open&&document.querySelector('.footer-link-group a').checkVisibility()`)))throw Error('Footer accordion failed');
      await evaluate(`document.querySelector('.menu-button').click()`);await delay(400);
      if(!(await evaluate(`document.querySelectorAll('.mobile-navigation>a').length===6&&document.querySelector('.mobile-menu-whatsapp').href.includes('51986176298')&&document.querySelector('.mobile-navigation').getBoundingClientRect().right<=innerWidth`)))throw Error('Mobile menu failed');
      await screenshot(`responsive-menu-${width}`);
      await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await waitFor(`!document.querySelector('.mobile-menu-layer')&&document.body.style.overflow!=='hidden'`,'Menu close failed');
    }
    await evaluate(`document.querySelectorAll('.product-card-open')[1].click()`);await delay(450);
    const modal=await evaluate(`(()=>{const el=document.querySelector('.product-modal');const r=el.getBoundingClientRect();return {left:r.left,right:r.right,viewport:innerWidth,price:el.querySelector('.product-modal-price').textContent,cta:el.querySelector('.product-modal-add').getBoundingClientRect().width,info:el.querySelector('.product-modal-info').getBoundingClientRect().width}})()`);
    if(modal.left<0||modal.right>width+1||modal.price!=='Precio al privado'||width<=760&&modal.cta<modal.info-55)throw Error(`Modal responsive failed: ${JSON.stringify(modal)}`);
    await screenshot(`responsive-modal-${width}`);
    if(width<=760){
      const previous=await evaluate(`document.querySelector('.product-modal-image img').src`);
      await evaluate(`(()=>{const el=document.querySelector('.product-modal-image');el.dispatchEvent(new PointerEvent('pointerdown',{clientX:250,bubbles:true}));el.dispatchEvent(new PointerEvent('pointerup',{clientX:120,bubbles:true}));})()`);await delay(150);
      if(await evaluate(`document.querySelector('.product-modal-image img').src`)===previous)throw Error('Gallery swipe failed');
      await evaluate(`document.querySelector('.product-modal').scrollTop=document.querySelector('.product-modal').scrollHeight`);await screenshot(`responsive-modal-cta-${width}`);
    }
    await evaluate(`document.querySelector('.product-modal-add').click()`);await delay(550);
    const cart=await evaluate(`(()=>{const el=document.querySelector('.cart-drawer');const r=el.getBoundingClientRect();return {left:r.left,right:r.right,viewport:innerWidth,wa:el.querySelector('.drawer-footer>a').href,overflow:el.scrollWidth>el.clientWidth}})()`);
    if(cart.left<0||cart.right>width+1||cart.overflow||!cart.wa.includes('51986176298')||decodeURIComponent(cart.wa).includes('S/'))throw Error(`Cart failed ${width}: ${JSON.stringify(cart)}`);
    await screenshot(`responsive-cart-${width}`);
    await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await waitFor(`!document.querySelector('.cart-layer')&&document.body.style.overflow!=='hidden'`,'Cart close failed');
    checks.push({label:`responsive-${width}x${height}`,...state,modal,cart});console.log(`Responsive ${width}x${height}: checked`);
  }
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await navigate('/',390,844);await screenshot('responsive-reduced-motion-390');
  if(!(await evaluate(`getComputedStyle(document.querySelector('.bd-hero-art')).opacity==='1'&&getComputedStyle(document.querySelector('.bd-hero-art-parallax')).transform==='none'`)))throw Error('Reduced motion failed');
  await call('Emulation.setEmulatedMedia',{features:[]});
} else if (process.argv.includes("--footer")) {
  for (const width of [1920, 1440, 1200, 1024, 768, 430, 390, 360]) {
    await navigate("/", width, width < 768 ? 844 : 1000);
    await evaluate(`document.querySelector('#footer').scrollIntoView({block:'start',behavior:'instant'})`);
    await delay(650);
    const state = await evaluate(`(async () => {
      const footer=document.querySelector('#footer');
      await Promise.all([...footer.querySelectorAll('img')].map(img=>img.decode()));
      const inner=footer.querySelector('.footer-inner');
      const rect=footer.getBoundingClientRect();
      const outside=[...footer.querySelectorAll('a,input,button,svg,strong')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&(r.left<0||r.right>innerWidth+1)}).map(el=>el.textContent||el.tagName);
      const email=footer.querySelector('#newsletter-email');
      email.value='not-an-email'; const rejectsInvalid=!email.checkValidity(); email.value='';
      return {title:document.title,width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,outside,columns:getComputedStyle(inner).gridTemplateColumns,columnCount:inner.children.length,mobileBrandFullWidth:innerWidth>760||footer.querySelector('.footer-brand-block').getBoundingClientRect().width>=inner.getBoundingClientRect().width-1,mobileNewsletterFullWidth:innerWidth>760||footer.querySelector('.footer-newsletter').getBoundingClientRect().width>=inner.getBoundingClientRect().width-1,trustCount:footer.querySelectorAll('.trust-point').length,logoComplete:footer.querySelector('.footer-brand img').naturalWidth>0,logoFit:getComputedStyle(footer.querySelector('.footer-brand img')).objectFit,rejectsInvalid,newsletter:footer.querySelector('form').action,clip:{x:0,y:rect.top+scrollY,width:innerWidth,height:rect.height,scale:1}};
    })()`);
    if (state.overflow || state.outside.length || state.columnCount!==6 || !state.mobileBrandFullWidth || !state.mobileNewsletterFullWidth || state.trustCount!==4 || !state.logoComplete || state.logoFit!=='contain' || !state.rejectsInvalid || !state.newsletter.includes('51986176298')) throw new Error(`Footer failed at ${width}: ${JSON.stringify(state)}`);
    await evaluate(`document.querySelector('.main-header').style.visibility='hidden'; document.querySelector('.whatsapp-float').style.visibility='hidden'`);
    const result=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:state.clip});
    await writeFile(`.visual-check/footer-reference-${width}.png`,Buffer.from(result.data,'base64'));
    delete state.clip; checks.push({label:`footer-${width}`,...state});
    console.log(`Footer ${width}: checked`);
  }
} else if (process.argv.includes("--location-footer")) {
  for (const [width, height] of [[1920,1080],[1440,900],[768,1024],[430,932],[390,844]]) {
    await navigate("/", width, height);
    await evaluate(`document.querySelector('#tienda').scrollIntoView({block:'start',behavior:'instant'})`); await delay(650);
    const locationState = await evaluate(`(() => { const section=document.querySelector('#tienda'); const map=document.querySelector('.bd-location-map'); const iframe=map.querySelector('iframe'); const text=section.innerText; const mapRect=map.getBoundingClientRect(); return {path:location.pathname,sectionWidth:section.getBoundingClientRect().width,mapHeight:Math.round(mapRect.height),mapRight:Math.round(mapRect.right),viewport:innerWidth,iframe:iframe.src,whatsapp:section.querySelector('a[href*="wa.me"]')?.href,maps:section.querySelector('a[href*="google.com/maps"]')?.href,forbidden:/Encuéntranos en la calle|Horario por confirmar|Dirección pendiente/i.test(text)} })()`);
    if (locationState.path !== "/" || locationState.mapRight > locationState.viewport + 1 || locationState.forbidden || !locationState.iframe.includes("-14.0171901") || !locationState.iframe.includes("-75.7569767") || !locationState.whatsapp.includes("51986176298") || !locationState.maps.includes("-14.0171901")) throw new Error(`Location check failed at ${width}: ${JSON.stringify(locationState)}`);
    await screenshot(`location-${width}`);
    await evaluate(`document.querySelector('#footer').scrollIntoView({block:'start',behavior:'instant'})`); await delay(500);
    const footerState = await evaluate(`(() => { const footer=document.querySelector('#footer'); const rect=footer.getBoundingClientRect(); return {right:Math.round(rect.right),viewport:innerWidth,columns:getComputedStyle(footer.querySelector('.footer-inner')).gridTemplateColumns,wa:[...footer.querySelectorAll('a[href*="wa.me"]')].every(a=>a.href.includes('51986176298')),hasNewsletter:Boolean(footer.querySelector('#newsletter-email')),text:footer.innerText} })()`);
    if (footerState.right > footerState.viewport + 1 || !footerState.wa || !footerState.hasNewsletter || !footerState.text.includes("DRIP TODAY. MOVE DIFFERENT.")) throw new Error(`Footer check failed at ${width}: ${JSON.stringify(footerState)}`);
    await screenshot(`footer-${width}`);
    checks.push({ label:`location-footer-${width}`, location:locationState, footer:footerState, overflow:false });
  }
} else if (process.argv.includes("--landing")) {
  await navigate("/", 1440, 1000);
  await evaluate(`localStorage.setItem("boxy-drip-cart-v2",JSON.stringify([{product:{id:"BD-006-02"},colorId:"ice-white",size:"M",quantity:1},{product:{id:"BD-006-04"},colorId:"ice",size:"M",quantity:1},{product:{id:"BD-006-02"},colorId:"optical-white",size:"S",quantity:1,unitPrice:99}]))`);
  await navigate("/", 1440, 1000);
  await evaluate(`document.querySelector('.bag-button').click()`); await delay(350);
  if (!(await evaluate(`document.querySelectorAll('.drawer-item').length===1 && document.querySelector('.drawer-item').innerText.includes('Blanco óptico') && !localStorage.getItem('boxy-drip-cart-v2').includes('unitPrice') && !document.querySelector('.cart-drawer').innerText.includes('S/')`))) throw new Error("Stale Ice variants/prices were not removed from restored cart");
  await call("Input.dispatchKeyEvent", { type:"keyDown",key:"Escape",code:"Escape",windowsVirtualKeyCode:27 }); await delay(350);
  await evaluate(`localStorage.removeItem("boxy-drip-cart-v2")`);
  await navigate("/", 1440, 1000);
  if (!(await evaluate(`document.querySelectorAll('.product-card-open').length===4 && [...document.querySelectorAll('.drop-card-bottom strong')].every(el=>el.textContent==='Precio al privado') && !document.querySelector('#productos').innerText.includes('S/')`))) throw new Error("Product cards/private prices failed");
  await evaluate(`document.querySelectorAll('.product-card-open')[1].scrollIntoView({block:'center',behavior:'instant'})`);
  await delay(300);
  await evaluate(`document.querySelectorAll('.product-card-open')[1].click()`);
  await delay(500);
  const modal = await evaluate(`(() => { const el=document.querySelector('.product-modal'); const rect=el.getBoundingClientRect(); return {exists:Boolean(el),title:document.querySelector('#product-modal-title')?.textContent,pathname:location.pathname,width:rect.width,right:rect.right,viewport:innerWidth,whatsapp:document.querySelector('.product-modal-whatsapp')?.href,locked:document.body.style.overflow==='hidden'} })()`);
  if (!modal.exists || modal.title !== "Polo Stride" || modal.pathname !== "/" || modal.right > modal.viewport || !modal.whatsapp.includes("wa.me/51986176298") || !modal.locked) throw new Error(`Desktop modal failed: ${JSON.stringify(modal)}`);
  if (!(await evaluate(`document.querySelectorAll('.product-color-list button').length===1 && document.querySelector('.product-modal-price').textContent==='Precio al privado' && !document.querySelector('.product-modal').innerText.includes('Blanco ice') && !decodeURIComponent(document.querySelector('.product-modal-whatsapp').href).includes('S/')`))) throw new Error("Stride variant/private price state failed");
  await evaluate(`document.querySelectorAll('.product-size-list button')[1].click(); document.querySelector('.product-modal-quantity button:last-child').click()`);
  await waitFor(`document.querySelector('.product-size-list button.is-active').textContent==='M' && document.querySelector('.product-modal-quantity span').textContent==='2'`, "Size/quantity selection failed");
  await screenshot("landing-product-modal-1440");
  await evaluate(`document.querySelector('.product-modal-add').click()`); await delay(500);
  if (!(await evaluate(`document.querySelector('.drawer-item')?.innerText.includes('Blanco óptico') && document.querySelector('.drawer-item')?.innerText.includes('Talla M') && document.querySelector('.drawer-quantity span').textContent==='2' && document.querySelector('.drawer-item-copy strong').textContent==='Precio al privado' && !document.querySelector('.cart-drawer').innerText.includes('S/') && !decodeURIComponent(document.querySelector('.drawer-footer>a').href).includes('S/') && location.pathname==='/'`))) throw new Error("Modal add-to-cart handoff failed");
  await call("Input.dispatchKeyEvent", { type:"keyDown",key:"Escape",code:"Escape",windowsVirtualKeyCode:27 }); await delay(350);
  await waitFor(`!document.querySelector('.cart-layer') && document.body.style.overflow!=='hidden'`, "Cart did not close cleanly");
  await navigate("/", 390, 844);
  await evaluate(`document.querySelectorAll('.product-card-open')[1].scrollIntoView({block:'center',behavior:'instant'}); document.querySelectorAll('.product-card-open')[1].click()`); await delay(500);
  const mobileModal = await evaluate(`(() => { const el=document.querySelector('.product-modal'); const rect=el.getBoundingClientRect(); return {exists:Boolean(el),left:rect.left,right:rect.right,viewport:innerWidth,scrollable:el.scrollHeight>el.clientHeight} })()`);
  if (!mobileModal.exists || mobileModal.left < 0 || mobileModal.right > mobileModal.viewport) throw new Error(`Mobile modal failed: ${JSON.stringify(mobileModal)}`);
  await screenshot("landing-product-modal-390");
  await call("Input.dispatchKeyEvent", { type:"keyDown",key:"Escape",code:"Escape",windowsVirtualKeyCode:27 }); await delay(350);
  await waitFor(`!document.querySelector('.product-modal') && document.body.style.overflow!=='hidden'`, "Mobile modal did not close cleanly");
  await evaluate(`document.querySelector('.header-tools>button:first-child').click()`); await delay(350);
  if (!(await evaluate(`document.querySelectorAll('.search-results>button').length===4 && [...document.querySelectorAll('.search-results b')].every(el=>el.textContent==='Precio al privado') && !document.querySelector('.search-results').innerText.includes('Ice') && document.documentElement.scrollWidth===innerWidth`))) throw new Error("Search/private price state failed");
  await evaluate(`document.querySelector('.search-results>button').click()`); await delay(500);
  if (!(await evaluate(`Boolean(document.querySelector('.product-modal')) && location.pathname==='/'`))) throw new Error("Search-to-modal flow failed");
  await call("Input.dispatchKeyEvent", { type:"keyDown",key:"Escape",code:"Escape",windowsVirtualKeyCode:27 }); await delay(350);
  await waitFor(`!document.querySelector('.product-modal') && document.body.style.overflow!=='hidden'`, "Search modal did not close cleanly");
  checks.push({ label:"single-page-product-flow", desktop:modal, mobile:mobileModal, passed:true });
} else if (process.argv.includes("--hero")) {
  for (const [width, height] of [[1920,1080],[1440,900],[1280,800],[1024,768],[768,1024],[430,932],[390,844]]) {
    await navigate("/", width, height);
    await inspect(`hero-${width}`);
    await screenshot(`hero-${width}`);
    console.log(`Hero ${width}x${height}: checked`);
  }
} else if (process.argv.includes("--quick")) {
  for (const width of [1440, 390]) { await navigate("/", width, width < 768 ? 844 : 1000); await inspect(`home-${width}`); await screenshot(`home-${width}`, true); }
} else {
  for (const width of [1920, 1440, 1280, 1024, 768, 430, 390, 360]) {
    await navigate("/", width, width < 768 ? 844 : 1000); await inspect(`home-${width}`); await screenshot(`home-${width}`, true);
    console.log(`Home ${width}: checked`);
  }
  for (const route of ["/catalogo", "/producto/polo-emotion-angel", "/producto/polo-stride-white", "/producto/short-baggy-drip", "/carrito", "/nuevos", "/drops", "/nosotros", "/guia-de-tallas", "/contacto"]) {
    for (const width of [1440, 390]) {
      await navigate(route, width, width < 768 ? 844 : 1000); await inspect(`${route}-${width}`); await screenshot(`${route.replaceAll("/", "-").slice(1)}-${width}`, true);
    }
    console.log(`${route}: checked`);
  }
  // Real purchase interaction, quantities, keyboard closing, encoded order and persistence.
  await navigate("/producto/polo-stride-white", 390, 844);
  const firstImage = await evaluate(`document.querySelector('.product-main-image img').getAttribute('src')`);
  await evaluate(`document.querySelector('.gallery-arrow-right').click()`); await delay(200);
  if (await evaluate(`document.querySelector('.product-main-image img').getAttribute('src')`) === firstImage) throw new Error("Gallery arrow failed");
  await evaluate(`document.querySelector('.product-thumbs button').click()`); await delay(200);
  await evaluate(`(() => {const gallery=document.querySelector('.product-main-image');gallery.dispatchEvent(new PointerEvent('pointerdown',{clientX:250,bubbles:true,pointerType:'touch'}));gallery.dispatchEvent(new PointerEvent('pointerup',{clientX:120,bubbles:true,pointerType:'touch'}));})()`); await delay(200);
  if (await evaluate(`document.querySelector('.product-main-image img').getAttribute('src')`) === firstImage) throw new Error("Gallery swipe failed");
  await evaluate(`document.querySelector('.size-guide-link').click()`); await delay(200);
  await call("Input.dispatchKeyEvent", { type:"keyDown",key:"Escape",code:"Escape",windowsVirtualKeyCode:27 }); await delay(200);
  if (await evaluate(`Boolean(document.querySelector('.size-guide-modal'))`)) throw new Error("Size guide Escape failed");
  await evaluate('localStorage.removeItem("boxy-drip-cart-v2")');
  await call("Page.reload"); await delay(2000);
  await evaluate(`document.querySelector('.variant-block button[aria-label="Blanco ice"]').click()`); await delay(200);
  await evaluate(`[...document.querySelectorAll('.size-block>div button')].find(b=>b.textContent==='L').click()`); await delay(200);
  await evaluate(`document.querySelector('.cart-buy').click()`); await delay(500);
  await evaluate(`document.querySelector('.drawer-quantity button[aria-label="Sumar unidad"]').click()`); await delay(300);
  await screenshot("cart-drawer-390");
  const drawer = await evaluate(`({ text:document.querySelector('.drawer-item').innerText, order:new URL(document.querySelector('.drawer-footer>a:last-child').href).searchParams.get('text'), cart:JSON.parse(localStorage.getItem('boxy-drip-cart-v2')) })`);
  if (drawer.cart[0]?.size !== "L" || drawer.cart[0]?.colorId !== "ice-white" || drawer.cart[0]?.quantity !== 2 || !drawer.order.includes("218.00")) throw new Error("Cart variant/quantity/order check failed");
  await call("Input.dispatchKeyEvent", { type:"keyDown", key:"Escape", code:"Escape", windowsVirtualKeyCode:27 }); await delay(500);
  if (await evaluate(`Boolean(document.querySelector('.cart-layer')) || document.body.style.overflow==='hidden'`)) throw new Error("Cart did not release scroll on Escape");
  await navigate("/carrito", 390, 844);
  if (!(await evaluate(`document.querySelector('.cart-page-copy').innerText.includes('Blanco ice') && document.querySelector('.cart-page-quantity span').textContent==='2'`))) throw new Error("Cart persistence failed");
  await screenshot("cart-populated-390", true);
  await navigate("/carrito", 1440, 1000); await screenshot("cart-populated-1440", true);
  await navigate("/catalogo", 390, 844);
  await evaluate(`document.querySelector('.catalog-mobile-filter').click()`); await delay(500);
  await evaluate(`[...document.querySelectorAll('.catalog-filter-layer fieldset:first-child button')].find(b=>b.textContent==='Shorts').click()`); await delay(300);
  await evaluate(`document.querySelector('.catalog-filter-layer footer button:last-child').click()`); await delay(500);
  if (await evaluate(`document.querySelectorAll('.catalog-product-grid>.drop-card').length`) !== 1) throw new Error("Category filtering failed");
  await navigate("/", 390, 844);
  await evaluate(`document.querySelector('.menu-button').click()`); await delay(300);
  await call("Input.dispatchKeyEvent", { type:"keyDown",key:"Escape",code:"Escape",windowsVirtualKeyCode:27 }); await delay(400);
  if (await evaluate(`Boolean(document.querySelector('.mobile-menu-layer')) || document.body.style.overflow==='hidden'`)) throw new Error("Mobile menu Escape failed");
  await evaluate(`document.querySelector('.header-tools>button:first-child').click()`); await delay(500);
  await evaluate(`(() => {const input=document.querySelector('#site-search'); const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; setter.call(input,'Stride'); input.dispatchEvent(new Event('input',{bubbles:true}));})()`); await delay(300);
  const searchMatches = await evaluate(`document.querySelectorAll('.search-results>a:not(.search-all-results)').length`);
  if (searchMatches < 1 || !(await evaluate(`[...document.querySelectorAll('.search-results>a:not(.search-all-results) strong')].every(e=>e.textContent.toLowerCase().includes('stride'))`))) throw new Error("Instant search failed");
  await evaluate(`[...document.querySelectorAll('.search-results a')].at(-1).focus()`);
  await call("Input.dispatchKeyEvent", { type:"keyDown",key:"Tab",code:"Tab",windowsVirtualKeyCode:9 });
  if (!(await evaluate(`document.querySelector('.search-overlay').contains(document.activeElement)`))) throw new Error("Search focus trap failed");
  await evaluate(`document.querySelector('.search-input-wrap').requestSubmit()`); await delay(2000);
  if (await evaluate(`document.querySelectorAll('.catalog-product-grid>.drop-card').length`) !== searchMatches) throw new Error("Search/catalog handoff failed");
  await call("Emulation.setEmulatedMedia", { features: [{ name:"prefers-reduced-motion",value:"reduce" }] });
  await navigate("/", 390, 844); await screenshot("home-reduced-motion-390", true);
  await call("Emulation.setEmulatedMedia", { features: [] });
  console.log("Purchase, persistence, gallery, modal keyboard, filters, search, reduced motion: checked");
  const linkStatus = await Promise.all([...links].map(async (href) => ({ href, status:(await fetch(origin+href)).status })));
  checks.push({ label:"internal-links", tested:linkStatus.length, broken:linkStatus.filter(({status})=>status!==200) });
}
const report = { checks, browserErrors };
await writeFile(".visual-check/report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
socket.close();
if (checks.some((entry)=>entry.overflow || entry.unloadedImages>0 || (entry.width&&!entry.title) || entry.broken?.length || entry.whatsappNumberCorrect===false) || browserErrors.length) process.exitCode=1;
