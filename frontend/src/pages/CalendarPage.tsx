import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type { CalendarEvent, ViewMode, EventCategory, NewEventForm, RecurrenceType } from "../types/calendar";
import { events as initialEvents, categoryConfig, calendarAttendees } from "../data/calendarData";
import "./CalendarPage.css";

// ── Constants ─────────────────────────────────────────────────────────────────
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const HOURS  = Array.from({length:24}, (_,i) => i);
const TODAY  = new Date();

// ── Helpers ───────────────────────────────────────────────────────────────────
const isoDate = (d: Date) => d.toISOString().split("T")[0];
const fmtTime = (t: string) => {
  const [h,m] = t.split(":").map(Number);
  return `${h === 0 ? 12 : h > 12 ? h-12 : h}:${String(m).padStart(2,"0")} ${h < 12 ? "AM" : "PM"}`;
};
const fmtDateRange = (ev: CalendarEvent) => {
  if (ev.allDay) {
    const s = new Date(ev.startDate), e = new Date(ev.endDate);
    const sStr = s.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
    if (ev.startDate === ev.endDate) return sStr;
    return `${sStr} – ${e.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}`;
  }
  return `${fmtTime(ev.startTime!)} – ${fmtTime(ev.endTime!)}`;
};
const getEventsForDate = (evs: CalendarEvent[], dateStr: string) =>
  evs.filter(ev => ev.startDate <= dateStr && ev.endDate >= dateStr);

const timeToTop = (time: string) => {
  const [h,m] = time.split(":").map(Number);
  return (h + m/60) * 60;
};
const timeToHeight = (start: string, end: string) => {
  const [sh,sm] = start.split(":").map(Number);
  const [eh,em] = end.split(":").map(Number);
  const mins = (eh*60+em) - (sh*60+sm);
  return Math.max(30, (mins/60)*60);
};

let evCounter = 500;
const uid = () => `EV${++evCounter}`;

// ── Attendee Status icon ──────────────────────────────────────────────────────
const statusIcon = (s: string) => s === "accepted" ? "✓" : s === "declined" ? "✕" : "?";
const statusColor= (s: string) => s === "accepted" ? "#059669" : s === "declined" ? "#DC2626" : "#D97706";

// ── Event Detail Modal ────────────────────────────────────────────────────────
const EventModal: React.FC<{ ev: CalendarEvent; onClose:()=>void; onDelete:(id:string)=>void; onEdit:()=>void }> = ({ ev, onClose, onDelete, onEdit }) => {
  const cfg = categoryConfig[ev.category];
  const handleBg = (e: React.MouseEvent) => { if(e.target === e.currentTarget) onClose(); };
  return (
    <div className="cal-modal-backdrop" onClick={handleBg}>
      <div className="cal-event-modal">
        <div className="cal-event-modal__banner" style={{background: ev.color}} />
        <div className="cal-event-modal__header">
          <h2 className="cal-event-modal__title">{ev.title}</h2>
          <button className="cal-event-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="cal-event-modal__body">
          {/* Category + recurrence */}
          <div style={{display:"flex",gap:6,marginBottom:16}}>
            <span style={{fontSize:11.5,fontWeight:600,padding:"3px 9px",borderRadius:20,background:cfg.bg,color:cfg.color}}>
              {cfg.icon} {cfg.label}
            </span>
            {ev.recurrence !== "none" && (
              <span style={{fontSize:11.5,fontWeight:600,padding:"3px 9px",borderRadius:20,background:"#F3F4F6",color:"#6B7280"}}>
                🔁 {ev.recurrence}
              </span>
            )}
          </div>

          {[
            { icon:"🕐", label:"When",     val: fmtDateRange(ev) },
            ...(ev.location ? [{ icon:"📍", label:"Location", val: ev.location }] : []),
            ...(ev.description ? [{ icon:"📝", label:"Notes", val: ev.description }] : []),
            ...(ev.reminder ? [{ icon:"🔔", label:"Reminder", val:`${ev.reminder} minutes before`}] : []),
          ].map(row => (
            <div key={row.label} className="cal-modal-row">
              <span className="cal-modal-row__icon">{row.icon}</span>
              <span className="cal-modal-row__label">{row.label}</span>
              <span className="cal-modal-row__val">{row.val}</span>
            </div>
          ))}

          {ev.attendees.length > 0 && (
            <div className="cal-modal-row">
              <span className="cal-modal-row__icon">👥</span>
              <span className="cal-modal-row__label">Guests</span>
              <div className="cal-modal-attendees">
                {ev.attendees.map(a => (
                  <div key={a.id} className="cal-modal-attendee">
                    <div className="cal-modal-attendee__av" style={{background:a.avatarColor}}>{a.avatar}</div>
                    <span className="cal-modal-attendee__name">{a.name}</span>
                    <span className="cal-modal-attendee__status" style={{color:statusColor(a.status)}}>{statusIcon(a.status)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {ev.tags && ev.tags.length > 0 && (
            <div className="cal-modal-row">
              <span className="cal-modal-row__icon">🏷</span>
              <span className="cal-modal-row__label">Tags</span>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {ev.tags.map(t => <span key={t} style={{fontSize:11,padding:"2px 8px",borderRadius:6,background:"#F3F4F6",color:"#6B7280"}}>#{t}</span>)}
              </div>
            </div>
          )}
        </div>
        <div className="cal-modal__footer">
          <button className="cal-btn cal-btn--danger cal-btn--sm" onClick={()=>{onDelete(ev.id);onClose();}}>🗑 Delete</button>
          <button className="cal-btn cal-btn--sm" onClick={onEdit}>✎ Edit</button>
          <button className="cal-btn cal-btn--sm cal-btn--primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// ── New Event Modal ───────────────────────────────────────────────────────────
const defaultForm: NewEventForm = {
  title:"", description:"", category:"meeting",
  startDate: isoDate(TODAY), endDate: isoDate(TODAY),
  startTime:"09:00", endTime:"10:00", allDay:false,
  location:"", attendeeIds:[], recurrence:"none", reminder:30, tags:"",
};
const NewEventModal: React.FC<{initial?:Partial<NewEventForm>; ev?:CalendarEvent; onClose:()=>void; onSave:(f:NewEventForm)=>void}> = ({ initial, ev, onClose, onSave }) => {
  const [f, setF] = useState<NewEventForm>(ev ? {
    title:ev.title, description:ev.description??"", category:ev.category,
    startDate:ev.startDate, endDate:ev.endDate, startTime:ev.startTime??"09:00",
    endTime:ev.endTime??"10:00", allDay:ev.allDay, location:ev.location??"",
    attendeeIds:ev.attendees.map(a=>a.id), recurrence:ev.recurrence,
    reminder:ev.reminder??30, tags:(ev.tags??[]).join(", "),
  } : {...defaultForm, ...initial});
  const valid = f.title.trim().length > 0;
  const cats: EventCategory[] = ["meeting","deadline","leave","holiday","review","deploy","training","personal"];
  const recs: RecurrenceType[] = ["none","daily","weekly","monthly"];
  const handleBg = (e: React.MouseEvent) => { if(e.target===e.currentTarget) onClose(); };
  return (
    <div className="cal-modal-backdrop" onClick={handleBg}>
      <div className="cal-new-modal">
        <div className="cal-new-modal__header">
          <h2 className="cal-new-modal__title">{ev ? "Edit Event" : "New Event"}</h2>
          <button className="cal-event-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="cal-new-modal__body">
          {/* Title */}
          <div className="cal-form-row">
            <label className="cal-label">Event Title *</label>
            <input className="cal-input" placeholder="Add title…" value={f.title} onChange={e=>setF(p=>({...p,title:e.target.value}))} autoFocus />
          </div>
          {/* Category */}
          <div className="cal-form-row">
            <label className="cal-label">Category</label>
            <div className="cal-cat-grid">
              {cats.map(c => {
                const cfg=categoryConfig[c];
                return (
                  <div key={c} className={`cal-cat-opt ${f.category===c?"selected":""}`}
                    style={f.category===c?{borderColor:cfg.color,background:cfg.bg}:{}}
                    onClick={()=>setF(p=>({...p,category:c}))}>
                    <span className="cal-cat-opt__icon">{cfg.icon}</span>
                    <span className="cal-cat-opt__label" style={{color:f.category===c?cfg.color:undefined}}>{cfg.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* All day toggle */}
          <div className="cal-form-row">
            <label className="cal-allday-toggle" onClick={()=>setF(p=>({...p,allDay:!p.allDay}))}>
              <div className={`cal-toggle ${f.allDay?"on":""}`} />
              All day event
            </label>
          </div>
          {/* Dates */}
          <div className="cal-form-row cal-form-row--2">
            <div>
              <label className="cal-label">Start Date</label>
              <input type="date" className="cal-input" value={f.startDate} onChange={e=>setF(p=>({...p,startDate:e.target.value,endDate:p.endDate<e.target.value?e.target.value:p.endDate}))} />
            </div>
            <div>
              <label className="cal-label">End Date</label>
              <input type="date" className="cal-input" value={f.endDate} min={f.startDate} onChange={e=>setF(p=>({...p,endDate:e.target.value}))} />
            </div>
          </div>
          {!f.allDay && (
            <div className="cal-form-row cal-form-row--2">
              <div>
                <label className="cal-label">Start Time</label>
                <input type="time" className="cal-input" value={f.startTime} onChange={e=>setF(p=>({...p,startTime:e.target.value}))} />
              </div>
              <div>
                <label className="cal-label">End Time</label>
                <input type="time" className="cal-input" value={f.endTime} onChange={e=>setF(p=>({...p,endTime:e.target.value}))} />
              </div>
            </div>
          )}
          {/* Location */}
          <div className="cal-form-row">
            <label className="cal-label">Location</label>
            <input className="cal-input" placeholder="Add location or video link…" value={f.location} onChange={e=>setF(p=>({...p,location:e.target.value}))} />
          </div>
          {/* Description */}
          <div className="cal-form-row">
            <label className="cal-label">Description</label>
            <textarea className="cal-textarea" placeholder="Add details…" value={f.description} onChange={e=>setF(p=>({...p,description:e.target.value}))} />
          </div>
          {/* Recurrence + Reminder */}
          <div className="cal-form-row cal-form-row--2">
            <div>
              <label className="cal-label">Recurrence</label>
              <select className="cal-select" value={f.recurrence} onChange={e=>setF(p=>({...p,recurrence:e.target.value as RecurrenceType}))}>
                {recs.map(r=><option key={r} value={r}>{r==="none"?"Does not repeat":r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="cal-label">Reminder</label>
              <select className="cal-select" value={f.reminder} onChange={e=>setF(p=>({...p,reminder:Number(e.target.value)}))}>
                {[0,5,10,15,30,60,120,1440].map(m=><option key={m} value={m}>{m===0?"None":m<60?`${m} min`:`${m/60}h`}</option>)}
              </select>
            </div>
          </div>
          {/* Attendees */}
          <div className="cal-form-row">
            <label className="cal-label">Attendees</label>
            <select className="cal-select" multiple value={f.attendeeIds}
              onChange={e=>setF(p=>({...p,attendeeIds:Array.from(e.target.selectedOptions,o=>o.value)}))}>
              {Object.values(calendarAttendees).map(a=>(
                <option key={a.id} value={a.id}>{a.name} — {a.avatar}</option>
              ))}
            </select>
            <div style={{fontSize:11,color:"#9CA3AF",marginTop:4}}>Ctrl/Cmd+click to select multiple</div>
          </div>
          {/* Tags */}
          <div className="cal-form-row">
            <label className="cal-label">Tags</label>
            <input className="cal-input" placeholder="sprint, deadline, client (comma-separated)" value={f.tags} onChange={e=>setF(p=>({...p,tags:e.target.value}))} />
          </div>
          <div className="cal-new-modal__footer">
            <button className="cal-btn" onClick={onClose}>Cancel</button>
            <button className="cal-btn cal-btn--primary" onClick={()=>onSave(f)} disabled={!valid} style={{opacity:valid?1:0.5}}>
              {ev?"Save Changes":"Create Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const CalendarPageComponent: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [view, setView] = useState<ViewMode>("month");
  const [cursor, setCursor] = useState(new Date(TODAY));  // month/week anchor
  const [selectedDate, setSelectedDate] = useState(isoDate(TODAY));
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent|null>(null);
  const [showNew, setShowNew] = useState(false);
  const [editEvent, setEditEvent] = useState<CalendarEvent|null>(null);
  const [newInitial, setNewInitial] = useState<Partial<NewEventForm>>({});
  const [enabledCats, setEnabledCats] = useState<EventCategory[]>(
    ["meeting","deadline","leave","holiday","review","deploy","training","personal"]
  );
  const [toast, setToast] = useState<string|null>(null);
  const [miniCursor, setMiniCursor] = useState(new Date(TODAY));
  const weekBodyRef = useRef<HTMLDivElement>(null);

  // scroll week view to 8am on mount
  useEffect(() => {
    if (view === "week" || view === "day") {
      weekBodyRef.current?.scrollTo({ top: 8 * 60, behavior: "smooth" });
    }
  }, [view]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(()=>setToast(null), 3000);
  }, []);

  // filtered events
  const filteredEvents = useMemo(()=>events.filter(ev=>enabledCats.includes(ev.category)), [events,enabledCats]);

  // ── Navigation ─────────────────────────────────────────────────────────
  const goToday   = () => { setCursor(new Date(TODAY)); setSelectedDate(isoDate(TODAY)); };
  const goPrev    = () => {
    const d = new Date(cursor);
    if(view==="month")  d.setMonth(d.getMonth()-1);
    if(view==="week")   d.setDate(d.getDate()-7);
    if(view==="day")    d.setDate(d.getDate()-1);
    if(view==="agenda") d.setDate(d.getDate()-30);
    setCursor(d);
  };
  const goNext    = () => {
    const d = new Date(cursor);
    if(view==="month")  d.setMonth(d.getMonth()+1);
    if(view==="week")   d.setDate(d.getDate()+7);
    if(view==="day")    d.setDate(d.getDate()-(-1));
    if(view==="agenda") d.setDate(d.getDate()+30);
    setCursor(d);
  };

  // ── Title ──────────────────────────────────────────────────────────────
  const headerTitle = useMemo(() => {
    if(view==="month")  return `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`;
    if(view==="week")   { const s=new Date(cursor); s.setDate(s.getDate()-s.getDay()); const e=new Date(s); e.setDate(e.getDate()+6); return `${s.toLocaleDateString("en-US",{month:"short",day:"numeric"})} – ${e.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}`; }
    if(view==="day")    return cursor.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});
    return "Upcoming Events";
  }, [view, cursor]);

  // ── Month grid cells ────────────────────────────────────────────────────
  const monthCells = useMemo(() => {
    const y = cursor.getFullYear(), m = cursor.getMonth();
    const first = new Date(y,m,1);
    const cells: Date[] = [];
    for(let i=0;i<first.getDay();i++) { const d=new Date(first); d.setDate(d.getDate()-first.getDay()+i); cells.push(d); }
    for(let d=1;d<=new Date(y,m+1,0).getDate();d++) cells.push(new Date(y,m,d));
    while(cells.length<42) { const d=new Date(cells[cells.length-1]); d.setDate(d.getDate()+1); cells.push(d); }
    return cells;
  }, [cursor]);

  // ── Week days ───────────────────────────────────────────────────────────
  const weekDays = useMemo(() => {
    const sun = new Date(cursor); sun.setDate(sun.getDate()-sun.getDay());
    return Array.from({length:7},(_,i)=>{ const d=new Date(sun); d.setDate(d.getDate()+i); return d; });
  }, [cursor]);

  // ── Agenda groups ───────────────────────────────────────────────────────
  const agendaGroups = useMemo(() => {
    const start = new Date(cursor); start.setDate(1);
    const days: string[] = [];
    for(let i=0;i<60;i++) { const d=new Date(start); d.setDate(d.getDate()+i); days.push(isoDate(d)); }
    return days.map(day=>({ day, events: getEventsForDate(filteredEvents,day).sort((a,b)=>(a.allDay?-1:1)-(b.allDay?-1:1)) }))
      .filter(g=>g.events.length>0);
  }, [cursor, filteredEvents]);

  // ── Upcoming (sidebar) ──────────────────────────────────────────────────
  const upcoming = useMemo(() => {
    const td = isoDate(TODAY);
    return filteredEvents.filter(ev=>ev.startDate>=td).sort((a,b)=>a.startDate.localeCompare(b.startDate)).slice(0,6);
  }, [filteredEvents]);

  // ── Event CRUD ──────────────────────────────────────────────────────────
  const handleSave = useCallback((f: NewEventForm) => {
    if(editEvent) {
      setEvents(prev=>prev.map(ev=>ev.id!==editEvent.id?ev:{
        ...ev, title:f.title, description:f.description, category:f.category,
        startDate:f.startDate, endDate:f.endDate, startTime:f.allDay?undefined:f.startTime,
        endTime:f.allDay?undefined:f.endTime, allDay:f.allDay,
        location:f.location, recurrence:f.recurrence, reminder:f.reminder,
        color:categoryConfig[f.category].color, bg:categoryConfig[f.category].bg,
        tags:f.tags?f.tags.split(",").map(t=>t.trim()).filter(Boolean):undefined,
        attendees:f.attendeeIds.map(id=>{const a=Object.values(calendarAttendees).find(x=>x.id===id); return a?{...a,status:"accepted" as const}:null}).filter(Boolean) as typeof ev.attendees,
      }));
      showToast("✓ Event updated");
      setEditEvent(null);
    } else {
      const cfg = categoryConfig[f.category];
      const newEv: CalendarEvent = {
        id:uid(), title:f.title, description:f.description, category:f.category,
        startDate:f.startDate, endDate:f.endDate,
        startTime:f.allDay?undefined:f.startTime, endTime:f.allDay?undefined:f.endTime,
        allDay:f.allDay, location:f.location,
        attendees:f.attendeeIds.map(id=>{const a=Object.values(calendarAttendees).find(x=>x.id===id); return a?{...a,status:"accepted" as const}:null}).filter(Boolean) as CalendarEvent["attendees"],
        color:cfg.color, bg:cfg.bg, recurrence:f.recurrence,
        createdBy:"JD", reminder:f.reminder,
        tags:f.tags?f.tags.split(",").map(t=>t.trim()).filter(Boolean):undefined,
      };
      setEvents(prev=>[...prev,newEv]);
      showToast("✓ Event created");
      setShowNew(false);
    }
  }, [editEvent, showToast]);

  const handleDelete = useCallback((id:string) => {
    setEvents(prev=>prev.filter(ev=>ev.id!==id));
    showToast("Event deleted");
  }, [showToast]);

  const openNew = (dateStr?: string) => {
    setNewInitial(dateStr?{startDate:dateStr,endDate:dateStr}:{});
    setShowNew(true);
  };

  const toggleCat = (cat: EventCategory) => {
    setEnabledCats(prev=>prev.includes(cat)?prev.filter(c=>c!==cat):[...prev,cat]);
  };

  // mini calendar nav
  const miniPrev = () => setMiniCursor(p=>{ const d=new Date(p); d.setMonth(d.getMonth()-1); return d; });
  const miniNext = () => setMiniCursor(p=>{ const d=new Date(p); d.setMonth(d.getMonth()+1); return d; });
  const miniCells = useMemo(() => {
    const y=miniCursor.getFullYear(), m=miniCursor.getMonth();
    const first=new Date(y,m,1); const cells:Date[]=[];
    for(let i=0;i<first.getDay();i++){const d=new Date(first);d.setDate(d.getDate()-first.getDay()+i);cells.push(d);}
    for(let d=1;d<=new Date(y,m+1,0).getDate();d++) cells.push(new Date(y,m,d));
    while(cells.length<42){const d=new Date(cells[cells.length-1]);d.setDate(d.getDate()+1);cells.push(d);}
    return cells;
  }, [miniCursor]);

  const catCounts = useMemo(()=>{
    const counts: Record<string,number>={};
    events.forEach(ev=>{counts[ev.category]=(counts[ev.category]||0)+1;});
    return counts;
  },[events]);

  // Now indicator position
  const nowTop = useMemo(() => {
    const h=TODAY.getHours(), m=TODAY.getMinutes();
    return (h + m/60)*60;
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="cal-page">
      {/* ── Sidebar ── */}
      <div className="cal-sidebar">
        <button className="cal-sidebar__new-btn" onClick={()=>openNew()}>+ New Event</button>

        {/* Mini calendar */}
        <div className="cal-mini">
          <div className="cal-mini__header">
            <span className="cal-mini__title">{MONTHS[miniCursor.getMonth()].slice(0,3)} {miniCursor.getFullYear()}</span>
            <div className="cal-mini__nav">
              <button className="cal-mini__nav-btn" onClick={miniPrev}>‹</button>
              <button className="cal-mini__nav-btn" onClick={miniNext}>›</button>
            </div>
          </div>
          <div className="cal-mini__grid">
            {["S","M","T","W","T","F","S"].map((d,i)=><div key={i} className="cal-mini__day-header">{d}</div>)}
            {miniCells.map((cell,i) => {
              const ds = isoDate(cell);
              const hasEv = filteredEvents.some(ev=>ev.startDate<=ds&&ev.endDate>=ds);
              const isTd = ds===isoDate(TODAY);
              const isSel = ds===selectedDate;
              const isOther = cell.getMonth()!==miniCursor.getMonth();
              const isWe = cell.getDay()===0||cell.getDay()===6;
              return (
                <div key={i} className={["cal-mini__cell",isTd?"today":"",isSel&&!isTd?"selected":"",isOther?"other-month":"",isWe&&!isTd?"weekend":"",hasEv&&!isTd?"has-events":""].filter(Boolean).join(" ")}
                  onClick={()=>{setSelectedDate(ds);setCursor(new Date(cell));}}>
                  {cell.getDate()}
                </div>
              );
            })}
          </div>
        </div>

        {/* Category filters */}
        <div className="cal-filters">
          <div className="cal-filters__title">Calendars</div>
          {(Object.entries(categoryConfig) as [EventCategory, typeof categoryConfig[keyof typeof categoryConfig]][]).map(([cat,cfg])=>{
            const enabled = enabledCats.includes(cat);
            return (
              <div key={cat} className="cal-filter-item" onClick={()=>toggleCat(cat)}>
                <div className="cal-filter-check" style={{borderColor:cfg.color,background:enabled?cfg.color:"transparent"}}>
                  {enabled && "✓"}
                </div>
                <span className="cal-filter-label">{cfg.icon} {cfg.label}</span>
                <span className="cal-filter-count">{catCounts[cat]||0}</span>
              </div>
            );
          })}
        </div>

        {/* Upcoming */}
        <div className="cal-upcoming">
          <div className="cal-upcoming__title">Upcoming</div>
          {upcoming.map(ev=>(
            <div key={ev.id} className="cal-upcoming-item" onClick={()=>setSelectedEvent(ev)}>
              <div className="cal-upcoming-accent" style={{background:ev.color}} />
              <div className="cal-upcoming-body">
                <div className="cal-upcoming-title">{ev.title}</div>
                <div className="cal-upcoming-meta">
                  {ev.allDay ? new Date(ev.startDate).toLocaleDateString("en-US",{month:"short",day:"numeric"})
                    : `${new Date(ev.startDate).toLocaleDateString("en-US",{month:"short",day:"numeric"})} ${ev.startTime?fmtTime(ev.startTime):""}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main ── */}
      <div className="cal-main">
        {/* Topbar */}
        <div className="cal-topbar">
          <div className="cal-topbar__left">
            <button className="cal-today-btn" onClick={goToday}>Today</button>
            <button className="cal-nav-btn" onClick={goPrev}>‹</button>
            <button className="cal-nav-btn" onClick={goNext}>›</button>
            <span className="cal-topbar__title">{headerTitle}</span>
          </div>
          <div className="cal-topbar__right">
            <div className="cal-view-toggle">
              {(["month","week","day","agenda"] as ViewMode[]).map(v=>(
                <button key={v} className={`cal-view-btn ${view===v?"active":""}`} onClick={()=>setView(v)}>
                  {v.charAt(0).toUpperCase()+v.slice(1)}
                </button>
              ))}
            </div>
            <button className="cal-icon-btn" title="Search events">⌕</button>
            <button className="cal-icon-btn" title="Settings">⚙</button>
          </div>
        </div>

        {/* ══ MONTH VIEW ══ */}
        {view==="month" && (
          <div className="cal-month">
            <div className="cal-month__header">
              {DAYS.map((d,i)=><div key={d} className={`cal-month__day-label ${i===0||i===6?"weekend":""}`}>{d}</div>)}
            </div>
            <div className="cal-month__grid">
              {Array.from({length:6},(_,wi)=>(
                <div key={wi} className="cal-month__week">
                  {monthCells.slice(wi*7,wi*7+7).map((cell,di)=>{
                    const ds = isoDate(cell);
                    const dayEvs = getEventsForDate(filteredEvents,ds).sort((a,b)=>(a.allDay?-1:1)-(b.allDay?-1:1));
                    const isTd = ds===isoDate(TODAY);
                    const isCurMonth = cell.getMonth()===cursor.getMonth();
                    const isWeekend = cell.getDay()===0||cell.getDay()===6;
                    const isSel = ds===selectedDate;
                    const MAX_SHOW = 3;
                    const shown = dayEvs.slice(0,MAX_SHOW);
                    const more = dayEvs.length-MAX_SHOW;
                    return (
                      <div key={di} className={["cal-month__cell",!isCurMonth?"other-month":"",isTd?"today":"",isSel?"selected":"",isWeekend?"weekend":""].filter(Boolean).join(" ")}
                        onClick={()=>{setSelectedDate(ds);setCursor(new Date(cell));}}>
                        <div className="cal-date-num" style={{cursor:"pointer"}}
                          onClick={e=>{e.stopPropagation();setSelectedDate(ds);setView("day");setCursor(new Date(cell));}}>
                          {cell.getDate()}
                        </div>
                        <div className="cal-month__events">
                          {shown.map(ev=>(
                            <div key={ev.id} className={`cal-event-pill ${ev.allDay?"all-day":""}`}
                              style={{background:ev.bg,color:ev.color}}
                              onClick={e=>{e.stopPropagation();setSelectedEvent(ev);}}>
                              {!ev.allDay && <span className="cal-event-time">{fmtTime(ev.startTime!)}</span>}
                              {ev.title}
                            </div>
                          ))}
                          {more>0 && <div className="cal-more-btn" onClick={e=>{e.stopPropagation();setSelectedDate(ds);setView("day");setCursor(new Date(cell));}}>{more} more</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ WEEK VIEW ══ */}
        {view==="week" && (
          <div className="cal-week">
            <div className="cal-week__header">
              <div/>
              {weekDays.map((d,i)=>{
                const isToday=isoDate(d)===isoDate(TODAY);
                return (
                  <div key={i} className={`cal-week__header-day ${isToday?"today":""}`}>
                    <div className="cal-week__header-daynum">{d.getDate()}</div>
                    <div className="cal-week__header-dayname">{DAYS[d.getDay()]}</div>
                  </div>
                );
              })}
            </div>
            <div className="cal-week__body" ref={weekBodyRef}>
              {/* Time labels */}
              <div className="cal-week__time-col">
                {HOURS.map(h=><div key={h} className="cal-week__time-label">{h===0?"":h<12?`${h}am`:h===12?"12pm":`${h-12}pm`}</div>)}
              </div>
              {/* Day columns */}
              {weekDays.map((d,di)=>{
                const ds=isoDate(d);
                const dayEvs=filteredEvents.filter(ev=>!ev.allDay&&ev.startDate<=ds&&ev.endDate>=ds&&ev.startTime);
                const isToday=ds===isoDate(TODAY);
                return (
                  <div key={di} className="cal-week__day-col">
                    {HOURS.map(h=><div key={h} className="cal-week__hour-line" onClick={()=>openNew(ds)} />)}
                    {isToday && <div className="cal-now-line" style={{top:nowTop}} />}
                    {dayEvs.map(ev=>{
                      const top=timeToTop(ev.startTime!);
                      const height=timeToHeight(ev.startTime!,ev.endTime||ev.startTime!);
                      return (
                        <div key={ev.id} className="cal-week__event"
                          style={{top,height,background:ev.bg,color:ev.color}}
                          onClick={e=>{e.stopPropagation();setSelectedEvent(ev);}}>
                          <div className="cal-week__event-title">{ev.title}</div>
                          <div className="cal-week__event-time">{fmtTime(ev.startTime!)}–{fmtTime(ev.endTime!)}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ DAY VIEW ══ */}
        {view==="day" && (
          <div className="cal-day">
            <div className={`cal-day__header ${isoDate(cursor)===isoDate(TODAY)?"today":""}`}>
              <div className="cal-day__header-num">{cursor.getDate()}</div>
              <div className="cal-day__header-name">{DAYS[cursor.getDay()]} · {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}</div>
            </div>
            <div className="cal-day__body" ref={weekBodyRef as any}>
              <div className="cal-day__time-col">
                {HOURS.map(h=><div key={h} className="cal-day__time-label">{h===0?"":h<12?`${h}am`:h===12?"12pm":`${h-12}pm`}</div>)}
              </div>
              <div className="cal-day__events-col">
                {HOURS.map(h=><div key={h} className="cal-day__hour-line" onClick={()=>openNew(isoDate(cursor))} />)}
                {isoDate(cursor)===isoDate(TODAY) && <div className="cal-now-line" style={{top:nowTop}} />}
                {filteredEvents.filter(ev=>!ev.allDay&&ev.startDate<=isoDate(cursor)&&ev.endDate>=isoDate(cursor)&&ev.startTime).map(ev=>{
                  const top=timeToTop(ev.startTime!);
                  const height=timeToHeight(ev.startTime!,ev.endTime||ev.startTime!);
                  return (
                    <div key={ev.id} className="cal-day__event"
                      style={{top,height,background:ev.bg,color:ev.color}}
                      onClick={()=>setSelectedEvent(ev)}>
                      <div className="cal-day__event-title">{ev.title}</div>
                      <div className="cal-day__event-time">{fmtTime(ev.startTime!)} – {fmtTime(ev.endTime!)}</div>
                      {ev.location&&<div className="cal-day__event-loc">📍{ev.location}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══ AGENDA VIEW ══ */}
        {view==="agenda" && (
          <div className="cal-agenda">
            {agendaGroups.length===0 && (
              <div style={{textAlign:"center",padding:"60px 0",color:"#9CA3AF"}}>
                <div style={{fontSize:40,opacity:0.3,marginBottom:12}}>📅</div>
                <div style={{fontSize:15,fontWeight:600,color:"#374151"}}>No upcoming events</div>
              </div>
            )}
            {agendaGroups.map(({day,events:dayEvs})=>{
              const d=new Date(day);
              const isToday=day===isoDate(TODAY);
              return (
                <div key={day} className={`cal-agenda__day-group ${isToday?"is-today":""}`}>
                  <div className="cal-agenda__day-header">
                    <div className="cal-agenda__day-num">{d.getDate()}</div>
                    <div className="cal-agenda__day-info">
                      <div className="cal-agenda__day-name">{DAYS[d.getDay()]} {isToday&&<span style={{fontSize:10,fontWeight:700,color:"#2563EB",background:"#DBEAFE",padding:"1px 6px",borderRadius:20,marginLeft:4}}>Today</span>}</div>
                      <div className="cal-agenda__day-date">{MONTHS[d.getMonth()]} {d.getFullYear()}</div>
                    </div>
                    <div className="cal-agenda__divider" />
                  </div>
                  <div className="cal-agenda__events">
                    {dayEvs.map(ev=>{
                      const cfg=categoryConfig[ev.category];
                      return (
                        <div key={ev.id} className="cal-agenda-event" onClick={()=>setSelectedEvent(ev)}>
                          <div className="cal-agenda-event__accent" style={{background:ev.color}} />
                          <div className="cal-agenda-event__time">
                            {ev.allDay?"All day":ev.startTime?`${fmtTime(ev.startTime)}${ev.endTime?`\n${fmtTime(ev.endTime)}`:""}`:"-"}
                          </div>
                          <div className="cal-agenda-event__body">
                            <div className="cal-agenda-event__title">{ev.title}</div>
                            <div className="cal-agenda-event__meta">
                              {ev.location&&<span>📍{ev.location}</span>}
                              {ev.attendees.length>0&&<span>👥{ev.attendees.length} guests</span>}
                            </div>
                            <div className="cal-agenda-event__badges">
                              <span className="cal-agenda-event__badge" style={{background:cfg.bg,color:cfg.color}}>{cfg.icon}{cfg.label}</span>
                              {ev.recurrence!=="none"&&<span className="cal-agenda-event__badge" style={{background:"#F3F4F6",color:"#6B7280"}}>🔁{ev.recurrence}</span>}
                            </div>
                          </div>
                          {ev.attendees.length>0&&(
                            <div className="cal-agenda-event__avatars">
                              {ev.attendees.slice(0,4).map(a=>(
                                <div key={a.id} className="cal-agenda-event__avatar" style={{background:a.avatarColor}} title={a.name}>{a.avatar}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {selectedEvent && !editEvent && (
        <EventModal ev={selectedEvent} onClose={()=>setSelectedEvent(null)}
          onDelete={handleDelete}
          onEdit={()=>{setEditEvent(selectedEvent);setSelectedEvent(null);}} />
      )}
      {(showNew||editEvent) && (
        <NewEventModal
          initial={newInitial}
          ev={editEvent||undefined}
          onClose={()=>{setShowNew(false);setEditEvent(null);}}
          onSave={handleSave} />
      )}
      {toast && <div className="cal-toast success">{toast}</div>}
    </div>
  );
};

export default CalendarPageComponent;