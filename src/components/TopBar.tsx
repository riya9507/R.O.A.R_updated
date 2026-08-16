import { useState } from "react";
import { RunSummary } from "../types";

export default function TopBar({ run, title }: { run: RunSummary; title: string }) {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(true);
  const [username, setUsername] = useState("Field Officer");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function login() {
    if ((username === "officer" && password === "roar2026") || (username === "admin" && password === "roaradmin")) {
      setLoggedIn(true); setOpen(false); setMessage("");
    } else setMessage("Invalid local credentials");
  }

  return (
    <header className="h-14 border-b border-border bg-bg flex items-center justify-between px-6 relative">
      <h1 className="text-[15px] font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-6">
        <div className="hidden xl:flex items-center gap-5">
          <div className="flex items-baseline gap-1.5"><span className="font-mono text-[12px] text-ink">{run.totalImages.toLocaleString()}</span><span className="text-[10px] text-inkFaint">images</span></div>
          <div className="flex items-baseline gap-1.5"><span className="font-mono text-[12px] text-ink">{run.blanksRemoved.toLocaleString()}</span><span className="text-[10px] text-inkFaint">filtered</span></div>
        </div>
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-panelAlt">
          <span className="w-8 h-8 rounded-full border border-border bg-panelAlt flex items-center justify-center text-[11px] font-semibold">{loggedIn ? "FO" : "IN"}</span>
          <span className="text-left hidden sm:block"><span className="block text-[11px] font-medium">{loggedIn ? "Field Officer" : "Officer login"}</span><span className="block text-[9px] text-inkFaint">{loggedIn ? "Local session" : "Sign in"}</span></span>
        </button>
        {open && (
          <div className="absolute right-5 top-12 z-[1000] w-72 panel p-4 shadow-xl">
            <div className="label-eyebrow">Officer access</div>
            {loggedIn ? (
              <>
                <div className="mt-2 text-[13px] font-medium">Field Officer</div>
                <div className="text-[10.5px] text-inkMuted mt-1">Authenticated locally. No cloud account is required.</div>
                <button onClick={() => { setLoggedIn(false); setOpen(false); }} className="mt-4 w-full px-3 py-2 rounded border border-border text-[11px] text-inkMuted hover:text-ink">Sign out</button>
              </>
            ) : (
              <>
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full mt-3 px-3 py-2 rounded bg-panelAlt border border-border text-[11px]" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full mt-2 px-3 py-2 rounded bg-panelAlt border border-border text-[11px]" />
                {message && <div className="text-[10px] text-danger mt-2">{message}</div>}
                <button onClick={login} className="mt-3 w-full px-3 py-2 rounded bg-amber text-bg text-[11px] font-semibold">Login</button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
