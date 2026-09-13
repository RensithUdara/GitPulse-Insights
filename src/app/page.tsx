'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, BarChart3, Boxes, Check, Code2, Compass, Copy, CreditCard,
  ExternalLink, FileCode, Flame, Home as HomeIcon, History, Layers, LayoutTemplate,
  LineChart, MessageSquare, Monitor, Moon, Palette, RefreshCw, Search,
  Share2, SlidersHorizontal, Sparkles, Star, Sun, Terminal, Trophy, User, X,
} from 'lucide-react';
import { BsFiletypeJpg, BsFiletypePng, BsFiletypeSvg } from 'react-icons/bs';
import { SiGithub, SiHtml5, SiMarkdown } from 'react-icons/si';

type SiteTheme = 'light' | 'dark' | 'system';

interface CardThemeOption {
  id: string;
  name: string;
  bgColor: string;
  cardColor: string;
  accentColor: string;
}

const CARD_THEMES: CardThemeOption[] = [
  { id: 'ink_dark', name: 'Ink Dark', bgColor: '#10100e', cardColor: '#1b1916', accentColor: '#f39a4d' },
  { id: 'paper_light', name: 'Paper Light', bgColor: '#f4f1ea', cardColor: '#fffaf0', accentColor: '#0f7b77' },
  { id: 'graphite', name: 'Graphite', bgColor: '#171717', cardColor: '#222222', accentColor: '#d0a85c' },
  { id: 'copper', name: 'Copper', bgColor: '#211710', cardColor: '#2e2119', accentColor: '#d88945' },
  { id: 'moss', name: 'Moss', bgColor: '#151a14', cardColor: '#20271d', accentColor: '#98b56a' },
  { id: 'harbor', name: 'Harbor', bgColor: '#0f1a1c', cardColor: '#172629', accentColor: '#61b8aa' },
  { id: 'plum', name: 'Plum', bgColor: '#1d1720', cardColor: '#2a2230', accentColor: '#b995d6' },
  { id: 'stone', name: 'Stone', bgColor: '#e8e2d8', cardColor: '#f9f5ed', accentColor: '#6b6258' },
];

const DEMO_USERNAMES = ['mojombo', 'torvalds', 'karpathy', 'sindresorhus', 'gaearon', 'shadcn'];
const QUICK_EXCLUDE_LANGS = ['HTML', 'CSS', 'Jupyter Notebook', 'SCSS', 'Makefile'];
const VALID_THEMES = new Set(CARD_THEMES.map((theme) => theme.id));
const MODULE_PRESETS = [
  { id: 'full', label: 'Full', modules: ['profile', 'summary', 'header', 'stats', 'languages', 'streak', 'graph'] },
  { id: 'compact', label: 'Compact', modules: ['profile', 'stats', 'languages'] },
  { id: 'activity', label: 'Activity', modules: ['profile', 'summary', 'header', 'streak', 'graph'] },
  { id: 'stats', label: 'Stats', modules: ['profile', 'stats'] },
  { id: 'languages', label: 'Languages', modules: ['profile', 'languages'] },
] as const;

export default function Home() {
  const [username, setUsername] = useState('');
  const [generatedUsername, setGeneratedUsername] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('ink_dark');
  const [showGraph, setShowGraph] = useState(true);
  const [showLanguages, setShowLanguages] = useState(true);
  const [showStreak, setShowStreak] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [showSummary, setShowSummary] = useState(true);
  const [showProfile, setShowProfile] = useState(true);
  const [hiddenLangs, setHiddenLangs] = useState<string[]>([]);
  const [langInput, setLangInput] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'markdown' | 'html' | 'url'>('markdown');
  const [baseUrl, setBaseUrl] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [generatedConfigKey, setGeneratedConfigKey] = useState('');
  const [siteTheme, setSiteTheme] = useState<SiteTheme>('dark');
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const resolvedTheme = siteTheme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : siteTheme;
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    setIsMounted(true);
    setBaseUrl(window.location.origin);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('site-theme') as SiteTheme | null;
    const activeTheme = savedTheme && ['light', 'dark', 'system'].includes(savedTheme) ? savedTheme : 'dark';
    const urlParams = new URLSearchParams(window.location.search);
    const urlUsername = urlParams.get('username')?.trim();
    const urlTheme = urlParams.get('theme');
    const defaultCardTheme = activeTheme === 'light' || (activeTheme === 'system' && !mediaQuery.matches) ? 'paper_light' : 'ink_dark';

    setSiteTheme(activeTheme);
    setSystemPrefersDark(mediaQuery.matches);
    setSelectedTheme(urlTheme && VALID_THEMES.has(urlTheme) ? urlTheme : defaultCardTheme);
    if (urlUsername) setUsername(urlUsername);

    const readBoolParam = (key: string) => {
      const value = urlParams.get(key);
      return value === null ? null : value !== 'false';
    };
    const params = {
      graph: readBoolParam('graph'),
      languages: readBoolParam('languages'),
      streak: readBoolParam('streak'),
      stats: readBoolParam('stats'),
      header: readBoolParam('header'),
      summary: readBoolParam('summary'),
      profile: readBoolParam('profile'),
    };
    if (params.graph !== null) setShowGraph(params.graph);
    if (params.languages !== null) setShowLanguages(params.languages);
    if (params.streak !== null) setShowStreak(params.streak);
    if (params.stats !== null) setShowStats(params.stats);
    if (params.header !== null) setShowHeader(params.header);
    if (params.summary !== null) setShowSummary(params.summary);
    if (params.profile !== null) setShowProfile(params.profile);
    const urlHiddenLangs = urlParams.get('hide_langs');
    if (urlHiddenLangs) setHiddenLangs(urlHiddenLangs.split(',').map((lang) => lang.trim()).filter(Boolean));

    const handleSystemTheme = (event: MediaQueryListEvent) => {
      setSystemPrefersDark(event.matches);
      const currentTheme = (localStorage.getItem('site-theme') as SiteTheme | null) || 'system';
      if (currentTheme === 'system') setSelectedTheme(event.matches ? 'ink_dark' : 'paper_light');
    };

    try {
      const savedSearches = localStorage.getItem('github_insights_recent_searches');
      const parsed = savedSearches ? JSON.parse(savedSearches) : [];
      if (Array.isArray(parsed)) setRecentSearches(parsed.slice(0, 10));
    } catch { }

    mediaQuery.addEventListener('change', handleSystemTheme);
    return () => {
      mediaQuery.removeEventListener('change', handleSystemTheme);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('site-theme', siteTheme);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, [isMounted, isDark, siteTheme]);

  const activeModulesCount = Number(showProfile) + Number(showSummary) + Number(showHeader) + Number(showStats) + Number(showLanguages) + Number(showStreak) + Number(showGraph);
  const hideLangsParam = hiddenLangs.length > 0 ? `&hide_langs=${encodeURIComponent(hiddenLangs.join(','))}` : '';
  const previewUrl = `/api/insight?username=${generatedUsername}&theme=${selectedTheme}&graph=${showGraph}&languages=${showLanguages}&streak=${showStreak}&stats=${showStats}&header=${showHeader}&summary=${showSummary}&profile=${showProfile}${hideLangsParam}`;
  const currentConfigKey = `${username.trim().toLowerCase()}|${selectedTheme}|${showGraph}|${showLanguages}|${showStreak}|${showStats}|${showHeader}|${showSummary}|${showProfile}|${hiddenLangs.join(',').toLowerCase()}`;
  const hasPendingChanges = Boolean(generatedUsername && hasLoaded && !hasError && generatedConfigKey && currentConfigKey !== generatedConfigKey);

  const modules = useMemo(() => [
    { id: 'profile', label: 'Profile', checked: showProfile, setter: setShowProfile, icon: User },
    { id: 'summary', label: 'Summary', checked: showSummary, setter: setShowSummary, icon: Flame },
    { id: 'header', label: 'Monthly', checked: showHeader, setter: setShowHeader, icon: BarChart3 },
    { id: 'stats', label: 'Stats', checked: showStats, setter: setShowStats, icon: Activity },
    { id: 'languages', label: 'Languages', checked: showLanguages, setter: setShowLanguages, icon: Code2 },
    { id: 'streak', label: 'Streak', checked: showStreak, setter: setShowStreak, icon: Trophy },
    { id: 'graph', label: 'Activity', checked: showGraph, setter: setShowGraph, icon: LineChart },
  ], [showGraph, showHeader, showLanguages, showProfile, showStats, showStreak, showSummary]);

  const triggerGenerate = useCallback((targetUser: string) => {
    const trimmed = targetUser.trim();
    if (!trimmed) return;
    setIsGenerating(true);
    setHasError(false);
    setHasLoaded(false);
    setGeneratedUsername(trimmed);
    setRefreshKey(Date.now());
    setGeneratedConfigKey(`${trimmed.toLowerCase()}|${selectedTheme}|${showGraph}|${showLanguages}|${showStreak}|${showStats}|${showHeader}|${showSummary}|${showProfile}|${hiddenLangs.join(',').toLowerCase()}`);

    const checkUrl = `/api/insight?username=${trimmed}&theme=${selectedTheme}&graph=${showGraph}&languages=${showLanguages}&streak=${showStreak}&stats=${showStats}&header=${showHeader}&summary=${showSummary}&profile=${showProfile}${hideLangsParam}&_t=${Date.now()}`;
    fetch(checkUrl)
      .then((response) => {
        if (!response.ok) {
          setHasError(true);
          return;
        }
        setHasLoaded(true);
        setRecentSearches((prev) => {
          const updated = [trimmed, ...prev.filter((user) => user.toLowerCase() !== trimmed.toLowerCase())].slice(0, 10);
          try { localStorage.setItem('github_insights_recent_searches', JSON.stringify(updated)); } catch { }
          return updated;
        });
      })
      .catch(() => setHasError(true))
      .finally(() => setIsGenerating(false));
  }, [hiddenLangs, hideLangsParam, selectedTheme, showGraph, showHeader, showLanguages, showProfile, showStats, showStreak, showSummary]);

  const copyToClipboard = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    setCopiedType(type);
    copyTimeoutRef.current = setTimeout(() => {
      setCopiedType(null);
      copyTimeoutRef.current = null;
    }, 2000);
  }, []);

  const getMarkdownCode = () => `<p align="center">\n  <img src="${baseUrl}${previewUrl}" alt="${generatedUsername}'s GitPulse card" />\n</p>`;
  const getHtmlCode = () => `<div align="center">\n  <img src="${baseUrl}${previewUrl}" alt="${generatedUsername}'s GitPulse card" />\n</div>`;
  const getDirectUrl = () => `${baseUrl}${previewUrl}`;
  const getEmbedCode = () => {
    if (activeCodeTab === 'html') return getHtmlCode();
    if (activeCodeTab === 'url') return getDirectUrl();
    return getMarkdownCode();
  };
  const getStudioUrl = () => {
    const params = new URLSearchParams({
      username: username.trim(),
      theme: selectedTheme,
      graph: String(showGraph),
      languages: String(showLanguages),
      streak: String(showStreak),
      stats: String(showStats),
      header: String(showHeader),
      summary: String(showSummary),
      profile: String(showProfile),
    });
    if (hiddenLangs.length > 0) params.set('hide_langs', hiddenLangs.join(','));
    return `${baseUrl}/?${params.toString()}`;
  };

  const applyModulePreset = (presetId: string) => {
    const preset = MODULE_PRESETS.find((item) => item.id === presetId);
    if (!preset) return;
    const activeModules = new Set<string>(preset.modules);
    setShowProfile(activeModules.has('profile'));
    setShowSummary(activeModules.has('summary'));
    setShowHeader(activeModules.has('header'));
    setShowStats(activeModules.has('stats'));
    setShowLanguages(activeModules.has('languages'));
    setShowStreak(activeModules.has('streak'));
    setShowGraph(activeModules.has('graph'));
  };

  const openSvg = () => {
    if (!generatedUsername || !baseUrl) return;
    window.open(`${getDirectUrl()}&_t=${Date.now()}`, '_blank', 'noopener,noreferrer');
  };

  const handleToggleModule = (checked: boolean, setter: (value: boolean) => void) => {
    if (!checked && activeModulesCount <= 1) return;
    setter(checked);
  };

  const handleSiteThemeChange = (mode: SiteTheme) => {
    setSiteTheme(mode);
    const willBeDark = mode === 'system' ? systemPrefersDark : mode === 'dark';
    setSelectedTheme((currentTheme) => {
      if (currentTheme === 'ink_dark' && !willBeDark) return 'paper_light';
      if (currentTheme === 'paper_light' && willBeDark) return 'ink_dark';
      return currentTheme;
    });
  };

  const resetCardSettings = () => {
    setSelectedTheme(isDark ? 'ink_dark' : 'paper_light');
    setShowGraph(true);
    setShowLanguages(true);
    setShowStreak(true);
    setShowStats(true);
    setShowHeader(true);
    setShowSummary(true);
    setShowProfile(true);
    setHiddenLangs([]);
    setLangInput('');
  };

  const addLanguage = () => {
    const cleaned = langInput.trim().replace(/,/g, '');
    if (!cleaned || hiddenLangs.some((lang) => lang.toLowerCase() === cleaned.toLowerCase())) return;
    setHiddenLangs((prev) => [...prev, cleaned]);
    setLangInput('');
  };

  const downloadImage = useCallback(async (format: 'png' | 'jpg' | 'svg') => {
    if (!generatedUsername || hasError) return;
    try {
      const response = await fetch(`${previewUrl}&_t=${refreshKey}`);
      const svgText = await response.text();
      if (format === 'svg') {
        const blob = new Blob([svgText], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `gitpulse-${generatedUsername}.svg`;
        link.click();
        URL.revokeObjectURL(url);
        return;
      }
      const image = new Image();
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width * 2;
        canvas.height = image.height * 2;
        const context = canvas.getContext('2d');
        if (context) {
          context.scale(2, 2);
          if (format === 'jpg') {
            context.fillStyle = isDark ? '#10100e' : '#f4f1ea';
            context.fillRect(0, 0, image.width, image.height);
          }
          context.drawImage(image, 0, 0);
          canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `gitpulse-${generatedUsername}.${format}`;
            link.click();
            URL.revokeObjectURL(url);
          }, format === 'png' ? 'image/png' : 'image/jpeg', 0.95);
        }
        URL.revokeObjectURL(svgUrl);
      };
      image.src = svgUrl;
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, [generatedUsername, hasError, isDark, previewUrl, refreshKey]);

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <div className="brand-emblem"><SiGithub size={22} /></div>
          <div>
            <div className="brand-title">GitPulse</div>
            <div className="brand-subtitle">Profile card studio</div>
          </div>
        </div>
        <nav className="sidebar-nav" aria-label="Primary navigation">
          <a className="active" href="#"><HomeIcon size={17} />Home</a>
          <a href="#themes"><LayoutTemplate size={17} />Templates</a>
          <a href="#preview"><CreditCard size={17} />My Cards</a>
          <a href="#preview"><BarChart3 size={17} />Analytics</a>
          <a href="#modules"><SlidersHorizontal size={17} />Settings</a>
        </nav>
        <div className="sidebar-card">
          <div className="sidebar-card-title"><Star size={17} />Open Source</div>
          <p>Love this project? Give it a star on GitHub.</p>
          <a href="https://github.com/RensithUdara/GitPulse-Insights" target="_blank" rel="noreferrer">
            <SiGithub size={16} />Star on GitHub<ExternalLink size={14} />
          </a>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <nav className="topnav" aria-label="Builder navigation">
            <a className="active" href="#"><CreditCard size={16} />Card Builder</a>
            <a href="#themes"><Boxes size={16} />Templates</a>
            <a href="#preview"><Compass size={16} />Explore</a>
          </nav>
          <div className="topbar-actions">
            <div className="theme-segment" aria-label="Site theme">
              {(['light', 'dark', 'system'] as SiteTheme[]).map((mode) => {
                const Icon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor;
                return (
                  <button key={mode} type="button" className={siteTheme === mode ? 'theme-segment-btn active' : 'theme-segment-btn'} onClick={() => handleSiteThemeChange(mode)} title={`Use ${mode} mode`}>
                    <Icon size={15} />
                  </button>
                );
              })}
            </div>
            <button className="quiet-link" type="button" disabled={!username.trim()} onClick={() => copyToClipboard(getStudioUrl(), 'studio-url')} title="Copy shareable studio link">
              {copiedType === 'studio-url' ? <Check size={15} /> : <Share2 size={15} />}
              <span>{copiedType === 'studio-url' ? 'Copied' : 'Share'}</span>
            </button>
            <a className="quiet-link icon-only" href="https://github.com/RensithUdara/GitPulse-Insights" target="_blank" rel="noreferrer" title="Open GitHub repository"><SiGithub size={18} /></a>
          </div>
        </header>

        <main className="studio-layout">
          <section className="studio-overview">
            <div>
              <div className="overview-kicker">README card builder</div>
              <h1>Design a clean GitHub stats card in seconds.</h1>
              <p>Choose a theme, tune the modules, filter noisy languages, then export or embed the live SVG.</p>
            </div>
            <div className="feature-strip" aria-label="Builder features">
              <div><span><MessageSquare size={22} /></span><strong>Fully customizable</strong><p>Choose only what you need</p></div>
              <div><span><Code2 size={22} /></span><strong>Live preview</strong><p>See changes instantly</p></div>
              <div><span><ExternalLink size={22} /></span><strong>Export anywhere</strong><p>SVG, PNG, JPG, or URL</p></div>
            </div>
          </section>

          <div className="builder-grid">
            <aside className="control-rail">
              <section className="workspace-panel account-panel">
                <div className="section-heading"><User size={17} /><span>Account</span></div>
                <p className="panel-note">Search any public GitHub profile and render a live card from the API.</p>
                <div className="search-field">
                  <Search size={17} />
                  <input ref={usernameInputRef} value={username} onChange={(event) => setUsername(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') triggerGenerate(username); }} placeholder="GitHub username" />
                  {username && <button type="button" onClick={() => setUsername('')} title="Clear username"><X size={15} /></button>}
                </div>
                <button className="primary-action" type="button" disabled={!username.trim() || isGenerating} onClick={() => triggerGenerate(username)}>
                  {isGenerating ? <RefreshCw size={17} className="animate-spin" /> : <Sparkles size={17} />}
                  <span>{isGenerating ? 'Generating' : 'Generate card'}</span>
                </button>
                <div className="quick-label">Quick picks</div>
                <div className="preset-row">
                  {DEMO_USERNAMES.map((demoUser) => <button key={demoUser} type="button" onClick={() => setUsername(demoUser)}>@{demoUser}</button>)}
                </div>
                {recentSearches.length > 0 && (
                  <div className="recent-block">
                    <div className="recent-head">
                      <span><History size={13} />Recent</span>
                      <button type="button" onClick={() => { setRecentSearches([]); localStorage.removeItem('github_insights_recent_searches'); }}>Clear</button>
                    </div>
                    <div className="preset-row">
                      {recentSearches.map((recentUser) => <button key={recentUser} type="button" onClick={() => setUsername(recentUser)}>@{recentUser}</button>)}
                    </div>
                  </div>
                )}
              </section>

              <section id="themes" className="workspace-panel">
                <div className="section-heading"><Palette size={17} /><span>Card Theme</span></div>
                <p className="panel-note">Pick a flat palette for the generated SVG.</p>
                <div className="theme-grid">
                  {CARD_THEMES.map((theme) => {
                    const active = selectedTheme === theme.id;
                    return (
                      <button key={theme.id} type="button" className={active ? 'theme-card active' : 'theme-card'} onClick={() => setSelectedTheme(theme.id)}>
                        <span className="theme-swatch" style={{ backgroundColor: theme.bgColor, borderColor: theme.cardColor }}><span style={{ backgroundColor: theme.accentColor }} /></span>
                        <span>{theme.name}</span>
                        {active && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section id="modules" className="workspace-panel">
                <div className="section-heading with-action">
                  <span><SlidersHorizontal size={17} />Modules<em>{activeModulesCount}/7</em></span>
                  <button type="button" onClick={resetCardSettings}>Reset</button>
                </div>
                <p className="panel-note">Use presets or toggle individual card sections.</p>
                <div className="preset-strip">
                  {MODULE_PRESETS.map((preset) => (
                    <button key={preset.id} type="button" onClick={() => applyModulePreset(preset.id)}>
                      {preset.id === 'full' && <Layers size={13} />}
                      {preset.id === 'compact' && <FileCode size={13} />}
                      {preset.id === 'activity' && <LineChart size={13} />}
                      {preset.id === 'stats' && <BarChart3 size={13} />}
                      {preset.id === 'languages' && <Code2 size={13} />}
                      {preset.label}
                    </button>
                  ))}
                </div>
                <div className="module-grid">
                  {modules.map((item) => {
                    const Icon = item.icon;
                    const locked = item.checked && activeModulesCount <= 1;
                    return (
                      <label key={item.id} className={item.checked ? 'module-pill active' : 'module-pill'}>
                        <input type="checkbox" checked={item.checked} disabled={locked} onChange={(event) => handleToggleModule(event.target.checked, item.setter)} />
                        <Icon size={15} />
                        <span>{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </section>

              <section className="workspace-panel">
                <div className="section-heading"><FileCode size={17} /><span>Language Filter</span></div>
                <p className="panel-note">Hide generated or markup-heavy languages from the breakdown.</p>
                <div className="inline-field">
                  <input value={langInput} onChange={(event) => setLangInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addLanguage(); } }} placeholder="Language to hide" />
                  <button type="button" disabled={!langInput.trim()} onClick={addLanguage}>Add</button>
                </div>
                {hiddenLangs.length > 0 && (
                  <div className="chip-row">
                    {hiddenLangs.map((lang) => (
                      <span key={lang} className="filter-chip">
                        {lang}
                        <button type="button" onClick={() => setHiddenLangs((prev) => prev.filter((item) => item !== lang))}><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="preset-row">
                  {QUICK_EXCLUDE_LANGS.map((lang) => {
                    const active = hiddenLangs.some((item) => item.toLowerCase() === lang.toLowerCase());
                    return (
                      <button key={lang} type="button" className={active ? 'active' : ''} onClick={() => {
                        if (active) setHiddenLangs((prev) => prev.filter((item) => item.toLowerCase() !== lang.toLowerCase()));
                        else setHiddenLangs((prev) => [...prev, lang]);
                      }}>
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </section>
            </aside>

            <section id="preview" className="preview-workspace">
              <div className="preview-toolbar">
                <div className="preview-heading">
                  <div className="section-heading"><Activity size={17} /><span>Preview</span></div>
                  <p className="panel-note">Live preview of your GitHub stats card.</p>
                </div>
                {generatedUsername && !hasError && hasLoaded && !isGenerating && (
                  <div className="preview-actions">
                    {hasPendingChanges && <button className="strong" type="button" onClick={() => triggerGenerate(username || generatedUsername)}><Sparkles size={14} />Update</button>}
                    <button type="button" onClick={() => triggerGenerate(generatedUsername)}><RefreshCw size={14} />Refresh</button>
                    <button type="button" onClick={openSvg}><ExternalLink size={14} />Open</button>
                    <button type="button" onClick={() => copyToClipboard(getDirectUrl(), 'direct-url')}>{copiedType === 'direct-url' ? <Check size={14} /> : <Copy size={14} />}{copiedType === 'direct-url' ? 'Copied' : 'URL'}</button>
                    {(['svg', 'png', 'jpg'] as const).map((format) => (
                      <button key={format} type="button" onClick={() => downloadImage(format)}>
                        {format === 'svg' && <BsFiletypeSvg size={14} />}
                        {format === 'png' && <BsFiletypePng size={14} />}
                        {format === 'jpg' && <BsFiletypeJpg size={14} />}
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="preview-stage">
                {!isMounted ? (
                  <StatusState icon={<RefreshCw className="animate-spin" size={24} />} title="Loading studio" />
                ) : !generatedUsername ? (
                  <StatusState icon={<Activity size={24} />} title="Ready when you are" detail="Enter a GitHub username to generate a live profile card." />
                ) : hasError ? (
                  <StatusState icon={<X size={24} />} title="Could not generate card" detail={`Check whether @${generatedUsername} exists and try again.`} tone="danger" />
                ) : !hasLoaded || isGenerating ? (
                  <StatusState icon={<RefreshCw className="animate-spin" size={24} />} title="Generating card" detail={`Fetching live GitHub stats for @${generatedUsername}.`} />
                ) : (
                  <img key={refreshKey} src={`${previewUrl}&_t=${refreshKey}`} alt="GitPulse card preview" draggable={false} className="preview-image no-drag" onError={() => { setIsGenerating(false); setHasError(true); setHasLoaded(false); }} />
                )}
              </div>
              {generatedUsername && !hasError && hasLoaded && (
                <div className="code-panel">
                  <div className="code-head">
                    <span><Terminal size={16} />Embed</span>
                    <div className="code-tabs">
                      <button type="button" className={activeCodeTab === 'markdown' ? 'active' : ''} onClick={() => setActiveCodeTab('markdown')}><SiMarkdown size={14} />Markdown</button>
                      <button type="button" className={activeCodeTab === 'html' ? 'active' : ''} onClick={() => setActiveCodeTab('html')}><SiHtml5 size={14} />HTML</button>
                      <button type="button" className={activeCodeTab === 'url' ? 'active' : ''} onClick={() => setActiveCodeTab('url')}><ExternalLink size={14} />URL</button>
                    </div>
                  </div>
                  <div className="code-box">
                    <pre>{getEmbedCode()}</pre>
                    <button type="button" onClick={() => copyToClipboard(getEmbedCode(), activeCodeTab)}>
                      {copiedType === activeCodeTab ? <Check size={14} /> : <Copy size={14} />}
                      {copiedType === activeCodeTab ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatusState({ icon, title, detail, tone }: { icon: React.ReactNode; title: string; detail?: string; tone?: 'danger' }) {
  return (
    <div className={tone === 'danger' ? 'status-state danger' : 'status-state'}>
      <div className="status-icon">{icon}</div>
      <div className="status-title">{title}</div>
      {detail && <p>{detail}</p>}
    </div>
  );
}
