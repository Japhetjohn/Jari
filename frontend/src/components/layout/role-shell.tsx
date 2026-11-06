"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Bell, ChevronDown, LogOut, Menu, X } from "lucide-react";
import { getSavedSession, logoutSimulation, restoreSession, type ActiveSession } from "@/lib/auth";
import { JariLogo } from "@/components/brand/jari-logo";
import { DashboardTour } from "@/components/layout/dashboard-tour";
import { getFarmNotifications, type FarmNotification } from "@/lib/notifications";

type NavigationItem = { href: string; label: string };
type NavigationGroup = { label: string; items: NavigationItem[]; collapsible?: boolean };

type RoleShellProps = {
  children: React.ReactNode;
  workspace: string;
  eyebrow: string;
  navigation: NavigationGroup[];
  allowedRoles: Array<"farmer" | "admin" | "verification_agent" | "institutional_user">;
};

function homeForRole(role: string) {
  if (role === "farmer") return "/dashboard";
  if (role === "institutional_user") return "/institution";
  return "/admin";
}

function isActivePath(pathname: string, item: NavigationItem, homePath: string) {
  return pathname === item.href || (item.href !== homePath && pathname.startsWith(`${item.href}/`));
}

function WorkspaceNavigation({
  navigation,
  pathname,
  homePath,
  label,
  onNavigate,
}: {
  navigation: NavigationGroup[];
  pathname: string;
  homePath: string;
  label: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label={label} className="workspace-navigation space-y-1.5">
      {navigation.map((group) => {
        const groupIsActive = group.items.some((item) => isActivePath(pathname, item, homePath));
        if (group.collapsible === false && group.items.length === 1) {
          const item = group.items[0];
          const active = isActivePath(pathname, item, homePath);
          return <Link key={group.label} href={item.href} aria-current={active ? "page" : undefined} onClick={onNavigate} className={`workspace-nav-link flex min-h-11 items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-colors ${active ? "bg-[#244b35] font-semibold text-white" : "font-medium text-[#566256] hover:bg-white/80 hover:text-[#294430]"}`}><span>{item.label}</span>{active && <span className="h-1.5 w-1.5 rounded-full bg-[#cbd9c3]" />}</Link>;
        }

        return (
          <details key={group.label} open={groupIsActive} className="workspace-nav-group group rounded-xl">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#526052] transition-colors hover:bg-white/75 hover:text-[#294430] [&::-webkit-details-marker]:hidden">
              <span>{group.label}</span><ChevronDown size={15} className="shrink-0 text-[#879182] transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="space-y-1 pb-1 pl-2 pt-1">
              {group.items.map((item) => {
                const active = isActivePath(pathname, item, homePath);
                return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} onClick={onNavigate} className={`workspace-nav-link flex min-h-10 items-center justify-between rounded-lg px-3 py-2 text-[13px] transition-colors ${active ? "bg-[#e1eadb] font-semibold text-[#294b32]" : "font-medium text-[#667064] hover:bg-white/75 hover:text-[#294430]"}`}><span>{item.label}</span>{active && <span className="h-1.5 w-1.5 rounded-full bg-[#547253]" />}</Link>;
              })}
            </div>
          </details>
        );
      })}
    </nav>
  );
}

export function RoleShell({ children, workspace, eyebrow, navigation, allowedRoles }: RoleShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const notificationPanelRef = useRef<HTMLDivElement>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [expandedNotification, setExpandedNotification] = useState<string | null>(null);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const signOutConfirmRef = useRef<HTMLButtonElement>(null);
  const [notifications, setNotifications] = useState<FarmNotification[]>([]);
  const homePath = session ? homeForRole(session.role) : "/dashboard";

  useEffect(() => {
    let active = true;
    setMounted(true);
    const currentSession = getSavedSession();
    if (!currentSession) {
      router.replace("/login");
      return;
    }
    if (!allowedRoles.includes(currentSession.role)) {
      router.replace(homeForRole(currentSession.role));
      return;
    }
    setSession(currentSession);

    // Verify session against real backend if token exists
    restoreSession().then((verified) => {
      if (!active) return;
      if (!verified) {
        router.replace("/login");
      } else {
        setSession(verified);
      }
    });

    const handleAuthExpired = () => {
      router.replace("/login");
    };
    window.addEventListener("jari:auth-expired", handleAuthExpired);

    return () => {
      active = false;
      window.removeEventListener("jari:auth-expired", handleAuthExpired);
    };
  }, [allowedRoles, router]);

  useEffect(() => {
    setMobileNavigationOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!notificationsOpen) return;
    const closeOutside = (event: MouseEvent) => {
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target as Node)) setNotificationsOpen(false);
    };
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, [notificationsOpen]);

  useEffect(() => {
    if (session?.role !== "farmer") return;
    const sync = () => setNotifications(getFarmNotifications());
    sync(); window.addEventListener("jari:mock-data-changed", sync);
    return () => window.removeEventListener("jari:mock-data-changed", sync);
  }, [session?.role]);

  useEffect(() => {
    const syncOtherTab = (event: StorageEvent) => {
      if (event.key?.startsWith("jari-demo:v1:") || event.key?.startsWith("jari-simulated-")) {
        window.dispatchEvent(new CustomEvent("jari:mock-data-changed", { detail: { key: event.key || "*" } }));
      }
      if (event.key === "jari-simulated-session" && !event.newValue) router.replace("/login");
    };
    window.addEventListener("storage", syncOtherTab);
    return () => window.removeEventListener("storage", syncOtherTab);
  }, [router]);

  useEffect(() => {
    if (mobileNavigationOpen) {
      setDrawerMounted(true);
      requestAnimationFrame(() => setDrawerVisible(true));
      return;
    }
    setDrawerVisible(false);
    const timer = window.setTimeout(() => setDrawerMounted(false), 300);
    return () => window.clearTimeout(timer);
  }, [mobileNavigationOpen]);

  useEffect(() => {
    if (!mobileNavigationOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavigationOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };
    const closeOnDesktop = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setMobileNavigationOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [mobileNavigationOpen]);

  useEffect(() => {
    if (!signOutOpen) return;
    signOutConfirmRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSignOutOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [signOutOpen]);

  if (!mounted || !session || !allowedRoles.includes(session.role)) return null;

  const confirmSignOut = () => {
    logoutSimulation();
    router.push("/login");
  };

  const closeMobileNavigation = () => setMobileNavigationOpen(false);

  return (
    <div className="workspace-shell min-h-screen bg-[#f7f7f2] text-[#20261f]">
      <div className="mx-auto flex min-h-screen max-w-[1680px] gap-5 px-3 py-3 sm:gap-7 sm:px-6 sm:py-6 lg:px-8">
        <aside className="hidden w-[264px] shrink-0 flex-col rounded-[1.5rem] bg-[#eef1e8] p-4 lg:sticky lg:top-6 lg:flex lg:h-[calc(100svh-3rem)] lg:overflow-y-auto">
          <Link href={homePath} className="flex items-center px-2 py-2"><JariLogo size={28} subtitle={workspace} /></Link>
          <div className="mb-3 mt-7 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#859080]">Workspace</div>
          <div data-tour="workspace-navigation"><WorkspaceNavigation navigation={navigation} pathname={pathname} homePath={homePath} label={`${workspace} navigation`} /></div>
          <div className="mt-auto pt-6"><div className="rounded-[1.2rem] bg-white/75 p-4">
            <p className="text-xs font-semibold text-[#354537]">Need a hand?</p>
            <p className="mt-1 text-xs leading-5 text-[#72796f]">Contact the JARI team if you need help with your workspace.</p>
            <a href="mailto:info@jari.com" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#496b50] hover:text-[#244a35]">Get support <ArrowUpRight size={13} /></a>
            <button onClick={() => setSignOutOpen(true)} className="mt-3 block text-xs font-semibold text-[#667064] transition-colors hover:text-[#294430]">Sign out</button>
          </div></div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 -mx-3 -mt-3 bg-[#eef1e8]/95 px-4 pb-3 pt-3 backdrop-blur-md sm:-mx-6 sm:-mt-6 sm:px-8 lg:-mx-8 lg:-mt-6 lg:mb-4 lg:px-8 lg:py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3 lg:block"><Link href={homePath} aria-label="JARI home" className="lg:hidden"><JariLogo size={23} /></Link><div className="hidden min-w-0 lg:block"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#71806f]">{eyebrow}</p><h1 className="mt-0.5 truncate font-serif text-2xl tracking-tight">{workspace}</h1></div></div>
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                {session.role === "farmer" && <div ref={notificationPanelRef} className="relative"><button type="button" aria-label="Notifications" aria-expanded={notificationsOpen} aria-controls={notificationsOpen ? "notification-preview" : undefined} onClick={() => setNotificationsOpen((open) => !open)} className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#e9eee4] text-[#526052] transition-colors hover:bg-[#dfe8d9]"><Bell size={17} strokeWidth={1.7} />{notifications.length > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#76916a] ring-2 ring-[#e9eee4]" />}</button>{notificationsOpen && <div id="notification-preview" className="absolute right-0 top-full z-[60] mt-3 w-[min(360px,calc(100vw-24px))] rounded-[1.25rem] bg-white p-3 shadow-[0_18px_55px_-25px_rgba(25,42,28,.42)]"><div className="flex items-center justify-between px-2 pb-2"><h2 className="text-sm font-semibold text-[#354237]">Notifications</h2><span className="text-[10px] text-[#899184]">Latest {Math.min(4, notifications.length)}</span></div><div className="space-y-1">{notifications.slice(0, 4).map((notification) => <div key={notification.id} className="rounded-xl bg-[#f7f8f4]"><button type="button" aria-expanded={expandedNotification === notification.id} onClick={() => setExpandedNotification((id) => id === notification.id ? null : notification.id)} className="w-full rounded-xl p-3 text-left hover:bg-[#eef2e9]"><span className="flex items-start justify-between gap-2"><span className="text-xs font-semibold text-[#354237]">{notification.title}</span><span className="shrink-0 text-[9px] text-[#899184]">{notification.time}</span></span><span className="mt-1 block text-[11px] leading-4 text-[#788174]">{notification.detail}</span>{expandedNotification === notification.id && <span className="mt-2 block border-t border-[#e8ece3] pt-2 text-[11px] leading-5 text-[#59645a]">{notification.fullText}</span>}</button></div>)}</div>{notifications.length === 0 && <p className="px-3 py-4 text-xs text-[#788174]">No farm updates yet.</p>}<Link href="/notifications" onClick={() => setNotificationsOpen(false)} className="mt-2 flex min-h-10 items-center justify-center rounded-full bg-[#244b35] text-xs font-semibold text-white hover:bg-[#193d2b]">View all notifications</Link></div>}</div>}
                {session.role === "farmer" ? <Link href="/farm" data-tour="farm-profile" aria-label="View your farm profile" title="View farm profile" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dfe8d9] text-sm font-semibold text-[#37533b] transition-colors hover:bg-[#cdddc4]">{session.fullName.charAt(0).toUpperCase()}</Link> : <span className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#dfe8d9] text-sm font-semibold text-[#37533b] sm:flex" aria-label={session.fullName}>{session.fullName.charAt(0).toUpperCase()}</span>}
                <button ref={mobileMenuButtonRef} data-tour="workspace-menu" type="button" aria-label={mobileNavigationOpen ? "Close workspace menu" : "Open workspace menu"} aria-expanded={mobileNavigationOpen} aria-controls={mobileNavigationOpen ? "mobile-workspace-navigation" : undefined} onClick={() => setMobileNavigationOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#244b35] text-white transition-colors hover:bg-[#193d2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#76916a] lg:hidden">{mobileNavigationOpen ? <X size={19} /> : <Menu size={19} />}</button>
              </div>
            </div>
          </header>

          <main data-tour="workspace-content" className="min-w-0 flex-1 py-5 sm:py-7">{children}</main>
        </div>
      </div>

      {drawerMounted && <>
        <button type="button" aria-hidden="true" tabIndex={-1} onClick={closeMobileNavigation} className={`fixed inset-0 z-40 bg-[#17231a]/45 transition-opacity duration-300 lg:hidden ${drawerVisible ? "opacity-100" : "opacity-0"}`} />
        <aside id="mobile-workspace-navigation" aria-label={`${workspace} menu`} aria-hidden={!mobileNavigationOpen} className={`fixed inset-0 z-50 flex h-[100dvh] w-screen flex-col bg-[#f7f8f3] p-4 transition-transform duration-300 ease-out motion-reduce:transition-none lg:hidden sm:p-6 ${drawerVisible ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between gap-3 border-b border-[#e6ebe1] pb-4">
            <Link href={homePath} onClick={closeMobileNavigation} aria-label="JARI home"><JariLogo size={25} /></Link>
            <button type="button" onClick={closeMobileNavigation} aria-label="Close workspace menu" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9eee4] text-[#405742] transition-colors hover:bg-[#dfe8d9]"><X size={18} /></button>
          </div>
          <p className="px-2 pb-2 pt-5 text-[10px] font-bold uppercase tracking-[.16em] text-[#859080]">Menu</p>
          <div className="min-h-0 flex-1 overflow-y-auto pb-3">
            <WorkspaceNavigation navigation={navigation} pathname={pathname} homePath={homePath} label={`${workspace} navigation`} onNavigate={closeMobileNavigation} />
          </div>
          <div className="border-t border-[#e6ebe1] pt-3"><button onClick={() => setSignOutOpen(true)} className="flex min-h-11 w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#59645a] transition-colors hover:bg-[#edf1e8] hover:text-[#2d573a]">Sign out <ArrowUpRight size={15} /></button></div>
        </aside>
      </>}
      {signOutOpen && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#17231a]/45 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) setSignOutOpen(false); }}>
        <section role="alertdialog" aria-modal="true" aria-labelledby="sign-out-title" aria-describedby="sign-out-description" className="w-full max-w-sm rounded-[1.5rem] bg-[#f9faf6] p-6 shadow-[0_24px_80px_-24px_rgba(20,34,23,.45)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8eee2] text-[#3f5e42]"><LogOut size={19} /></div>
          <h2 id="sign-out-title" className="mt-4 font-serif text-xl font-medium tracking-tight text-[#263328]">Sign out of JARI?</h2>
          <p id="sign-out-description" className="mt-2 text-sm leading-6 text-[#6f796e]">You can sign back in any time with your account details.</p>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setSignOutOpen(false)} className="min-h-11 rounded-full bg-[#e9eee4] px-5 text-sm font-semibold text-[#405742] transition-colors hover:bg-[#dfe8d9]">Stay signed in</button>
            <button ref={signOutConfirmRef} type="button" onClick={confirmSignOut} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#244b35] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#193d2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#76916a]"><LogOut size={15} />Sign out</button>
          </div>
        </section>
      </div>}
      <DashboardTour enabled={session.role === "farmer"} userId={session.id} />
    </div>
  );
}
