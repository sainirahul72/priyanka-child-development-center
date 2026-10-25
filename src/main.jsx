import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import { Menu, X, Phone, MapPin, Clock, ArrowRight, HeartHandshake, BookOpen, Users, Sparkles, ChevronDown, LogOut, Save, Plus, Trash2, Lock, RefreshCw } from "lucide-react";
import "./style.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const initialContent = {
  name: "Privika Child Development Center",
  tagline: "Develop • Grow • Learn • Thrive",
  headline: "Every child deserves the opportunity to thrive.",
  intro: "Multidisciplinary child development support through special education, occupational therapy, ABA/behavioural support, parent guidance, developmental assessments and individualised home programmes. We partner with parents to understand each child’s strengths, support needs and developmental goals.",
  phone: "8448220644",
  hours: "9:00 AM – 6:00 PM",
  locations: "Online sessions across India • In-person sessions/consultations in Gurgaon",
  about: "We provide multidisciplinary child development support through Special Education, Occupational Therapy, ABA/Behavioural Support, Parent Guidance, Developmental Assessments and Individualised Home Programmes. We work in partnership with parents to understand each child’s strengths, support needs and developmental goals, with personalised, child-centred guidance and progress monitoring.",
  qualifications: "B.Ed. in Autism · B.Ed. in Intellectual and Developmental Disabilities (IDD) · M.Ed. in IDD · M.A. in Literature",
  age: "1 year to 18+ years",
  experience: "15 years of experience",
  services: [
    { title: "Free Parent Guidance Call", text: "A friendly first step to understand your concern and guide you in the right direction." },
    { title: "Initial Parent Consultation", text: "Detailed parent-focused guidance to understand your child’s needs, strengths and priorities." },
    { title: "Initial Child Development Review", text: "Understand your child’s current strengths, participation and areas requiring support." },
    { title: "Focused Developmental Assessment", text: "A structured assessment for specific developmental, learning or functional concerns." },
    { title: "Comprehensive Developmental Assessment", text: "A detailed, multidisciplinary understanding of your child’s needs and goals." },
    { title: "Individual Special Education", text: "Personalised educational support based on your child’s learning profile and goals." },
    { title: "Autism-Focused Educational Support", text: "Support for learning, communication, participation and independence with a focus on individual goals." },
    { title: "Learning & Remedial Support", text: "Structured support for academic and learning skills." },
    { title: "School Readiness Session", text: "Build essential skills for greater participation in a school environment." },
    { title: "Occupational Therapy Consultation", text: "Understand functional needs and identify occupational therapy goals." },
    { title: "Occupational Therapy Assessment", text: "A structured functional assessment based on your child’s individual needs." },
    { title: "Individual Occupational Therapy", text: "Goal-based therapy for functional participation and skill development." },
    { title: "ABA Initial Consultation", text: "Understand skills, behaviour, communication and parent priorities to plan the right support." },
    { title: "Behaviour & Skill Assessment", text: "Structured assessment of identified skills, behaviours and functional impact." },
    { title: "Individual ABA / Behavioural Support", text: "Skill and behaviour support based on defined goals and professional scope." },
    { title: "Parent Behaviour Training", text: "Practical strategies to understand behaviour, support communication and build meaningful daily skills." },
    { title: "Individualised Home Development Plan", text: "A personalised 30-day plan with expert sessions, home activities and progress monitoring." },
    { title: "Parent Coaching Programme", text: "A 4-session programme to build confidence and practical strategies for home and daily life." },
    { title: "School Readiness Programme", text: "An 8-session programme for communication, learning, self-help, social skills and classroom participation." },
    { title: "Multidisciplinary Child Development Review", text: "Coordinated input from Special Educator, OT and ABA/Behavioural Professional where appropriate." },
    { title: "Progress Review", text: "Review of goals, progress, parent feedback and next steps." },
    { title: "School / Teacher Professional Consultation", text: "Strategies, learning support, communication and transition planning with authorisation." }
  ],
  faqs: [
    { q: "What age groups do you support?", a: "We support children and young people from 1 year through 18+ years. The right service and goals are discussed individually." },
    { q: "Where are services available?", a: "Online sessions are available across India. In-person sessions and consultations are available in Gurgaon." },
    { q: "How do we get started?", a: "Call or WhatsApp us to discuss your concerns and arrange an initial conversation about your child's needs and suitable next steps." },
    { q: "Do you offer parent guidance?", a: "Yes. Families can enquire about an initial parent consultation, parent guidance and practical ways to support learning and development at home." }
  ]
};

async function loadContent() {
  if (supabase) {
    const { data, error } = await supabase.from("site_content").select("content").eq("id", 1).maybeSingle();
    if (!error && data?.content && Object.keys(data.content).length) { const saved = data.content; const mergedServices = [...initialContent.services, ...(Array.isArray(saved.services) ? saved.services.filter(s => !initialContent.services.some(base => base.title.trim().toLowerCase() === String(s.title || "").trim().toLowerCase())) : [])]; return { ...initialContent, ...saved, locations: initialContent.locations, faqs: (Array.isArray(saved.faqs) ? saved.faqs : initialContent.faqs).map(f => f.q === "Where are services available?" ? { ...f, a: "Online sessions are available across India. In-person sessions and consultations are available in Gurgaon." } : f), services: mergedServices }; }
  }
  try {
    const saved = localStorage.getItem("pcdc-content");
    if (saved) { const parsed = JSON.parse(saved); return { ...initialContent, ...parsed, locations: initialContent.locations, faqs: (Array.isArray(parsed.faqs) ? parsed.faqs : initialContent.faqs).map(f => f.q === "Where are services available?" ? { ...f, a: "Online sessions are available across India. In-person sessions and consultations are available in Gurgaon." } : f) }; }
  } catch {}
  return initialContent;
}

function App() {
  const [content, setContent] = useState(initialContent);
  const [loadingContent, setLoadingContent] = useState(true);
  const [menu, setMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [admin, setAdmin] = useState(location.pathname.replace(/\/+$/, "") === "/admin");
  const [session, setSession] = useState(null);
  const [draft, setDraft] = useState(initialContent);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadContent().then(c => { setContent(c); setDraft(c); }).finally(() => setLoadingContent(false));
    const onPop = () => setAdmin(location.pathname.replace(/\/+$/, "") === "/admin");
    window.addEventListener("popstate", onPop);
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => setSession(data.session));
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
      return () => { window.removeEventListener("popstate", onPop); listener.subscription.unsubscribe(); };
    }
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    let alive = true;
    async function checkAdmin() {
      setIsAdmin(false);
      if (!supabase || !session?.user?.id) return;
      const { data, error } = await supabase.from("admin_users").select("user_id").eq("user_id", session.user.id).maybeSingle();
      if (alive) setIsAdmin(!error && !!data);
    }
    checkAdmin();
    return () => { alive = false; };
  }, [session]);

  const goAdmin = () => { history.pushState({}, "", "/admin"); setAdmin(true); setNotice(""); window.scrollTo(0,0); };
  const goHome = () => { history.pushState({}, "", "/"); setAdmin(false); setNotice(""); window.scrollTo(0,0); };
  const setField = (key, value) => setDraft(prev => ({ ...prev, [key]: value }));
  const login = async (e) => {
    e.preventDefault(); setLoginError(""); setBusy(true);
    if (!supabase) { setLoginError("Supabase is not configured. Add the VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY environment variables in Netlify, then redeploy."); setBusy(false); return; }
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) setLoginError(error.message);
    setBusy(false);
  };
  const logout = async () => { if (supabase) await supabase.auth.signOut(); setIsAdmin(false); setNotice(""); };
  const save = async () => {
    if (!supabase || !session || !isAdmin) return;
    setBusy(true); setNotice("");
    const { error } = await supabase.from("site_content").update({ content: draft, updated_at: new Date().toISOString() }).eq("id", 1);
    if (error) setNotice("Save failed: " + error.message);
    else { setContent(draft); setNotice("Saved successfully. The public website will now use the updated content."); }
    setBusy(false);
  };
  const makeWhatsAppLink = (service = "services") => `https://wa.me/91${content.phone.replace(/\D/g,"")}?text=${encodeURIComponent(`Hello, I would like to enquire about ${service} at Privika Child Development Center.`)}`;
  const whatsapp = makeWhatsAppLink();

  if (admin) {
    if (!supabase) return <main className="admin-page"><div className="login-card"><img className="login-logo" src="/privika-logo.png"/><Lock size={28}/><h1>Admin setup required</h1><p>Secure login is included, but the Supabase project settings have not been configured in this deployment yet.</p><ol><li>In Netlify, open Site configuration → Environment variables.</li><li>Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>.</li><li>Trigger a new deploy.</li></ol><button className="btn" onClick={goHome}>Back to website</button></div></main>;
    if (!session) return <main className="admin-page"><form className="login-card" onSubmit={login}><img className="login-logo" src="/privika-logo.png"/><span className="eyebrow">SECURE CONTENT MANAGEMENT</span><h1>Admin sign in</h1><p>Sign in with the administrator account created in Supabase.</p><label>Email<input type="email" autoComplete="username" required value={loginEmail} onChange={e=>setLoginEmail(e.target.value)}/></label><label>Password<input type="password" autoComplete="current-password" required value={loginPassword} onChange={e=>setLoginPassword(e.target.value)}/></label>{loginError&&<div className="error-box">{loginError}</div>}<button className="btn" type="submit" disabled={busy}>{busy?"Signing in…":"Sign in"}</button><button className="text-button" type="button" onClick={goHome}>Return to website</button></form></main>;
    if (!isAdmin) return <main className="admin-page"><div className="login-card"><Lock size={28}/><h1>Admin access not authorized</h1><p>This signed-in account is not listed as an authorized administrator. Check the user UID in the Supabase <code>admin_users</code> table.</p><button className="btn" onClick={logout}>Sign out</button></div></main>;
    return <main className="admin-page"><div className="admin-head"><img src="/privika-logo.png"/><div><span className="eyebrow">SECURE CONTENT EDITOR</span><h1>Website content</h1><p>Signed in as {session.user.email}</p></div><button className="btn btn-outline" onClick={goHome}>View website</button><button className="btn btn-outline" onClick={logout}><LogOut size={16}/> Sign out</button></div>
      <div className="admin-warning">Changes saved here are stored in Supabase and are shared with public visitors. Please verify professional qualifications and service availability before publishing.</div>
      <div className="editor-grid">
        <section className="editor-card"><h2>Practice details</h2>
          <label>Centre name<input value={draft.name||""} onChange={e=>setField("name",e.target.value)}/></label><label>Tagline<input value={draft.tagline||""} onChange={e=>setField("tagline",e.target.value)}/></label><label>Phone / WhatsApp<input value={draft.phone||""} onChange={e=>setField("phone",e.target.value)}/></label><label>Opening hours<input value={draft.hours||""} onChange={e=>setField("hours",e.target.value)}/></label><label>Locations<input value={draft.locations||""} onChange={e=>setField("locations",e.target.value)}/></label><label>Age group<input value={draft.age||""} onChange={e=>setField("age",e.target.value)}/></label><label>Qualifications<textarea rows="3" value={draft.qualifications||""} onChange={e=>setField("qualifications",e.target.value)}/></label>
        </section>
        <section className="editor-card"><h2>Homepage & about</h2><label>Hero headline<input value={draft.headline||""} onChange={e=>setField("headline",e.target.value)}/></label><label>Intro<textarea rows="4" value={draft.intro||""} onChange={e=>setField("intro",e.target.value)}/></label><label>About text<textarea rows="5" value={draft.about||""} onChange={e=>setField("about",e.target.value)}/></label><h2>Services</h2>{(draft.services||[]).map((s,i)=><div className="service-editor" key={i}><label>Service {i+1} title<input value={s.title} onChange={e=>setField("services",draft.services.map((x,j)=>i===j?{...x,title:e.target.value}:x))}/></label><label>Description<textarea rows="2" value={s.text} onChange={e=>setField("services",draft.services.map((x,j)=>i===j?{...x,text:e.target.value}:x))}/></label><button className="text-button danger" onClick={()=>setField("services",draft.services.filter((_,j)=>j!==i))}><Trash2 size={14}/> Remove service</button></div>)}<button className="btn btn-outline" onClick={()=>setField("services",[...(draft.services||[]),{title:"New service",text:"Add a short description."}])}><Plus size={15}/> Add service</button></section>
        <section className="editor-card"><h2>FAQs</h2>{(draft.faqs||[]).map((f,i)=><div className="service-editor" key={i}><label>Question<input value={f.q} onChange={e=>setField("faqs",draft.faqs.map((x,j)=>i===j?{...x,q:e.target.value}:x))}/></label><label>Answer<textarea rows="3" value={f.a} onChange={e=>setField("faqs",draft.faqs.map((x,j)=>i===j?{...x,a:e.target.value}:x))}/></label><button className="text-button danger" onClick={()=>setField("faqs",draft.faqs.filter((_,j)=>j!==i))}>Remove FAQ</button></div>)}<button className="btn btn-outline" onClick={()=>setField("faqs",[...(draft.faqs||[]),{q:"New question",a:"Add your answer here."}])}><Plus size={15}/> Add FAQ</button></section>
      </div><div className="admin-actions"><button className="btn" disabled={busy} onClick={save}><Save size={16}/>{busy?"Saving…":"Save changes"}</button><button className="btn btn-outline" disabled={busy} onClick={async()=>{setBusy(true);const c=await loadContent();setDraft(c);setBusy(false);setNotice("Reloaded the latest saved content.");}}><RefreshCw size={15}/> Reload saved content</button>{notice&&<p>{notice}</p>}</div>
    </main>;
  }

  return <div>
    <div className="top-strip"><span><MapPin size={14}/> {content.locations}</span><span><Clock size={14}/> {content.hours}</span><a href={`tel:${content.phone}`}><Phone size={14}/> {content.phone}</a></div>
    <header className="header"><a className="brand" href="#home"><img src="/privika-logo.png" alt="Privika Child Development Center logo"/></a><button className="menu-toggle" aria-label="Toggle menu" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button><nav className={menu?"nav open":"nav"}>{[["Services","services"],["Our approach","approach"],["FAQs","faqs"],["About","about"]].map(([t,id])=><a key={id} href={`#${id}`} onClick={()=>setMenu(false)}>{t}</a>)}<a className="nav-cta" href={whatsapp} target="_blank" rel="noreferrer">Free parent guidance <ArrowRight size={15}/></a></nav></header>
    <main>
      <section className="hero" id="home"><div className="hero-copy"><span className="eyebrow"><Sparkles size={15}/> CHILD DEVELOPMENT & LEARNING</span><h1>{content.headline}</h1><p>{content.intro}</p><div className="hero-meta"><span><Users size={17}/> Ages {content.age}</span><span><MapPin size={17}/> Online across India · In-person in Gurgaon</span></div></div></section>
      
      <section className="section services-section" id="services"><div className="section-label">HOW WE CAN HELP</div><div className="section-heading"><h2>Support for every step forward.</h2><p>Services are discussed with families to understand individual needs and suitable goals.</p></div><div className="service-grid">{content.services.map((s,i)=><article className="service-card" key={s.title+i}><img className="service-photo" src={`/services/service-${String(i+1).padStart(2,"0")}.jpg`} alt="" loading="lazy"/><h3>{s.title}</h3><p>{s.text}</p><a href={makeWhatsAppLink(s.title)} target="_blank" rel="noreferrer">Ask about this service <ArrowRight size={15}/></a></article>)}</div></section>
      <section className="approach-section" id="approach"><div className="approach-copy"><div className="section-label">OUR APPROACH</div><h2>Small steps. Meaningful progress.</h2><p>We believe the best support starts by listening to families, understanding each learner's strengths and agreeing on practical goals together.</p><div className="approach-list"><div><span>01</span><div><h3>Start with a conversation</h3><p>Share your questions and what you would like support with.</p></div></div><div><span>02</span><div><h3>Discuss individual goals</h3><p>Explore suitable services and learning priorities for your child.</p></div></div><div><span>03</span><div><h3>Work together</h3><p>Keep family communication central as support progresses.</p></div></div></div></div><aside className="approach-aside"><div className="aside-mark"><HeartHandshake size={34}/></div><h3>Families are part of the journey.</h3><p>Parent guidance and practical collaboration can help connect learning across sessions and everyday routines.</p><a className="btn" href={whatsapp} target="_blank" rel="noreferrer">Talk to our team <ArrowRight size={16}/></a></aside></section>
      <section className="section faq-section" id="faqs"><div className="section-label">GOOD TO KNOW</div><div className="section-heading"><h2>Frequently asked questions</h2><p>Have another question? Reach out and we'll help you understand the next step.</p></div><div className="faq-list">{content.faqs.map((f,i)=><div className="faq-item" key={f.q}><button onClick={()=>setOpenFaq(openFaq===i?-1:i)}>{f.q}<ChevronDown className={openFaq===i?"rotated":""}/></button>{openFaq===i&&<p>{f.a}</p>}</div>)}</div></section>

      <section className="section about-section" id="about"><div className="section-label">A PARTNER FOR YOUR FAMILY</div><div className="section-heading"><h2>Every child has their own way of learning.</h2><p>{content.about}</p></div><div className="credential-card"><div className="credential-icon"><BookOpen/></div><div><span className="eyebrow">EDUCATIONAL QUALIFICATIONS</span><h3>{content.experience || "15 years of experience"}</h3><p>{content.qualifications}</p></div></div></section>
    </main>
    <footer className="footer"><img src="/privika-logo.png" alt="Privika logo"/><p>{content.tagline}</p><span>Information on this website is general and does not replace individualized professional assessment or advice.</span><button className="footer-admin" onClick={goAdmin}>Admin</button><small>© {new Date().getFullYear()} {content.name}. All rights reserved.</small></footer>
  </div>;
}
createRoot(document.getElementById("root")).render(<App/>);
