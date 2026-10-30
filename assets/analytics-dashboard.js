import { ANALYTICS_CONFIG as cfg } from "./analytics-config.js";
const $=s=>document.querySelector(s);
const setup=$("#setup"),login=$("#login"),reports=$("#reports"),message=$("#message");
const endpoint=()=>cfg.supabaseUrl.replace(/\/$/,"")+"/functions/v1/"+cfg.functionName;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let client=null;
function table(title,rows){return '<div class="panel"><h2>'+escape(title)+'</h2><table><thead><tr><th>Öğe</th><th>Sayı</th></tr></thead><tbody>'+
  (rows||[]).map(r=>'<tr><td>'+escape(r.name)+'</td><td>'+Number(r.count||0)+'</td></tr>').join('')+'</tbody></table></div>'}
async function report(){
  const {data:{session}}=await client.auth.getSession();
  if(!session){reports.hidden=true;login.hidden=false;return;}
  const res=await fetch(endpoint(),{method:"POST",headers:{"Authorization":"Bearer "+session.access_token,"Content-Type":"application/json","apikey":cfg.publishableKey},body:JSON.stringify({action:"report",days:Number($("#days").value)})});
  if(!res.ok)throw new Error("Bu hesap için rapor erişimi doğrulanamadı.");
  const data=await res.json();
  login.hidden=true;reports.hidden=false;
  const metrics=[["Görüntüleme",data.overview.views],["Tekil ziyaretçi",data.overview.visitors],["Oturum",data.overview.sessions],["Tıklama",data.overview.clicks]];
  $("#metrics").innerHTML=metrics.map(([name,n])=>'<div class="panel metric"><span>'+escape(name)+'</span><b>'+Number(n||0)+'</b></div>').join('');
  $("#report-info").textContent=data.limitReached?"Rapor son 5.000 olayla sınırlandırıldı.":"Son "+data.days+" günün toplu istatistikleri";
  $("#tables").innerHTML=table("Sayfalar",data.pages)+table("Ülkeler",data.countries)+table("Yaklaşık bölgeler",data.regions)+
    table("Trafik kaynakları",data.referrers)+table("Cihazlar",data.devices)+table("Tıklanan bağlantılar",data.clicks)+table("Kampanyalar",data.campaigns);
}
async function init(){
  if(!cfg.enabled||!cfg.supabaseUrl||!cfg.publishableKey)return;
  try{
    const {createClient}=await import("https://esm.sh/@supabase/supabase-js@2.49.8");
    client=createClient(cfg.supabaseUrl,cfg.publishableKey);
    setup.hidden=true;login.hidden=false;
    const {data:{session}}=await client.auth.getSession();
    if(session)await report();
  }catch(e){message.textContent=e.message;login.hidden=false;setup.hidden=true;}
}
$("#login-form").addEventListener("submit",async e=>{
  e.preventDefault();
  try{const f=new FormData(e.target);const {error}=await client.auth.signInWithPassword({email:f.get("email"),password:f.get("password")});
  if(error)throw error;await report();}catch(err){message.textContent=err.message;}
});
$("#refresh").addEventListener("click",()=>report().catch(e=>$("#report-info").textContent=e.message));
$("#days").addEventListener("change",()=>report().catch(e=>$("#report-info").textContent=e.message));
$("#logout").addEventListener("click",async()=>{await client.auth.signOut();reports.hidden=true;login.hidden=false;});
init();
