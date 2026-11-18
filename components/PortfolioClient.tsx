"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface PortfolioClientProps {
  turnstileSiteKey: string;
}

export default function PortfolioClient({ turnstileSiteKey }: PortfolioClientProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"" | "success" | "error">("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"neofetch" | "cluster" | "whoami">("neofetch");
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [skillCategory, setSkillCategory] = useState<string>("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cloudflare Turnstile state
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!turnstileSiteKey || !turnstileContainerRef.current) return;

    const tryRender = () => {
      if (
        window.turnstile &&
        turnstileContainerRef.current &&
        turnstileWidgetIdRef.current === null
      ) {
        turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: turnstileSiteKey,
          theme: "light",
          callback: (token: string) => {
            setTurnstileToken(token);
          },
          "expired-callback": () => {
            setTurnstileToken("");
          },
          "error-callback": () => {
            setTurnstileToken("");
          },
        });
      }
    };

    tryRender();

    return () => {
      if (turnstileWidgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [turnstileReady, turnstileSiteKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    setStatusMessage("");

    if (!turnstileToken) {
      setStatus("error");
      setStatusMessage("Please complete the security verification.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, turnstileToken }),
      });

      const data = (await response.json()) as { success?: boolean; message?: string };

      if (response.ok && data.success) {
        setStatus("success");
        setStatusMessage("Message sent! Confirmation sent to your email.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        setStatusMessage(data.message || "Failed to send message. Try again.");
      }
    } catch {
      setStatus("error");
      setStatusMessage("Network error. Email hermasbintang@gmail.com directly.");
    } finally {
      setIsLoading(false);
      setTurnstileToken("");
      if (turnstileWidgetIdRef.current !== null && window.turnstile) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      }
    }
  };

  const skillsData = [
    {
      category: "os-infra",
      title: "Linux & OS",
      level: "Expert",
      accent: "bg-[#FFEB3B] text-[#0F0F1A]",
      span: "md:col-span-7",
      items: ["AlmaLinux", "CloudLinux LVE", "CentOS", "Debian / Ubuntu", "Bash", "Systemd", "Kernel Tuning"],
    },
    {
      category: "hosting-panels",
      title: "Hosting Panels",
      level: "Expert",
      accent: "bg-[#93C5FD] text-[#0F0F1A]",
      span: "md:col-span-5",
      items: ["cPanel / WHM", "Plesk", "Enhance CP", "Pterodactyl", "SiteWorx", "WHMCS API", "Upmind"],
    },
    {
      category: "web-db",
      title: "Web & Databases",
      level: "Advanced",
      accent: "bg-[#86EFAC] text-[#0F0F1A]",
      span: "md:col-span-5",
      items: ["LiteSpeed", "Apache", "Nginx", "PHP-FPM", "MariaDB / MySQL", "Redis", "OPcache"],
    },
    {
      category: "email-dns",
      title: "Mail & DNS",
      level: "Advanced",
      accent: "bg-[#F9A8D4] text-[#0F0F1A]",
      span: "md:col-span-7",
      items: ["Exim", "Postfix & Dovecot", "Rspamd", "MailChannels", "DKIM / SPF / DMARC", "PTR", "PowerDNS / BIND", "DNSSEC"],
    },
    {
      category: "cloud-devops",
      title: "Cloud & IaC",
      level: "Advanced",
      accent: "bg-[#C4B5FD] text-[#0F0F1A]",
      span: "md:col-span-7",
      items: ["Google Cloud (GCP)", "GKE", "Docker", "Terraform", "Cloud Build", "Cloud Run", "VPC & IAM", "Deployer"],
    },
    {
      category: "security-mon",
      title: "Security & Monitoring",
      level: "Intermediate+",
      accent: "bg-[#FFEB3B] text-[#0F0F1A]",
      span: "md:col-span-5",
      items: ["Prometheus", "Grafana", "Icinga2", "OpenLDAP", "ModSecurity", "CSF / LFD", "SSL / TLS"],
    },
  ];

  const filteredSkills =
    skillCategory === "all"
      ? skillsData
      : skillsData.filter((s) => s.category === skillCategory);

  const projectsData = [
    {
      badge: "TERASHOST",
      status: "PRODUCTION",
      accent: "bg-[#FFEB3B] text-[#0F0F1A]",
      title: "Multi-Server Hosting Cluster",
      summary: "Separated web, MariaDB, and mail nodes under Enhance CP, OpenLDAP IAM, PowerDNS DNSSEC, and WHMCS billing automation.",
      stack: ["Enhance CP", "OpenLDAP", "PowerDNS", "Postfix", "WHMCS API", "Pterodactyl"],
      diagramLines: [
        "[WHMCS] --API--> [Enhance Control Plane]",
        "                   ├── Web (CloudLinux/LSWS)",
        "                   ├── DB (MariaDB + Redis)",
        "                   ├── Mail (Postfix/Rspamd)",
        "                   └── Auth/DNS (OpenLDAP + DNSSEC)",
      ],
    },
    {
      badge: "MAIL & DNS",
      status: "DELIVERABILITY",
      accent: "bg-[#93C5FD] text-[#0F0F1A]",
      title: "Anti-Spam & Mail Deliverability Pipeline",
      summary: "Configured Exim, Postfix, and MailChannels relays with 2048-bit DKIM, aligned SPF/DMARC, PTR, and Rspamd filtering.",
      stack: ["Exim", "Postfix", "Dovecot", "Rspamd", "MailChannels", "DKIM/SPF/DMARC"],
      diagramLines: [
        "[Client] -> [Exim / Postfix MTA]",
        "              ├── Rspamd Scan",
        "              ├── DKIM + SPF + DMARC",
        "              └── MailChannels Relay + PTR",
      ],
    },
    {
      badge: "GOOGLE CLOUD",
      status: "CAPSTONE",
      accent: "bg-[#F9A8D4] text-[#0F0F1A]",
      title: "Terraform & GKE Microservices",
      summary: "Provisioned VPC, GKE autoscaling pools, Cloud SQL, and IAM in Terraform with automated Docker CI/CD via Cloud Build.",
      stack: ["GCP", "GKE", "Docker", "Terraform", "Cloud Build", "Cloud SQL"],
      diagramLines: [
        "[GitHub] -> [Cloud Build] -> [Artifact Registry]",
        "                                   │",
        "[Terraform] -> [VPC] -> [GKE + Cloud SQL]",
      ],
    },
    {
      badge: "HARDENING",
      status: "ENTERPRISE",
      accent: "bg-[#86EFAC] text-[#0F0F1A]",
      title: "Linux Isolation & Speed Tuning",
      summary: "Enforced CloudLinux LVE limits, ModSecurity WAF, and CSF/LFD alongside LiteSpeed, PHP-FPM, and Redis caching.",
      stack: ["CloudLinux LVE", "LiteSpeed", "PHP-FPM", "Redis", "ModSecurity", "CSF/LFD"],
      diagramLines: [
        "[Traffic] -> [CSF/LFD + ModSecurity WAF]",
        "                    │",
        "             [LiteSpeed + Redis]",
        "                    │",
        "             [CloudLinux LVE PHP-FPM]",
      ],
    },
  ];

  return (
    <div className="min-h-[100dvh] text-[#0F0F1A] selection:bg-[#FFEB3B] selection:text-[#0F0F1A]">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setTurnstileReady(true)}
      />

      {/* Top Availability Banner */}
      <div className="no-print bg-[#FFEB3B] border-b-2 border-[#0F0F1A] py-2 px-4 text-xs font-mono font-bold text-[#0F0F1A] flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] border-2 border-[#0F0F1A] inline-block" />
          <span>AVAILABLE</span>
        </span>
        <span className="hidden sm:inline">•</span>
        <span>LINUX SYSADMIN &amp; CLOUD INFRASTRUCTURE</span>
        <span className="hidden md:inline bg-[#0F0F1A] text-[#FFEB3B] px-2.5 py-0.5 rounded-full text-[11px]">
          REMOTE / ON-SITE
        </span>
      </div>

      {/* Sticky Navbar */}
      <nav className="no-print w-full bg-[#FFFDF5] z-[100] py-3.5 sticky top-0 border-b-2 border-[#0F0F1A]">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a
            href="#home"
            className="text-lg font-extrabold font-mono text-[#0F0F1A] bg-[#FFEB3B] px-3.5 py-1.5 rounded-xl border-2 border-[#0F0F1A] shadow-[2px_3px_0_#0F0F1A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_2px_0_#0F0F1A] transition-all"
          >
            Portofolio
          </a>

          <div className="hidden lg:flex items-center space-x-3 text-sm font-bold text-[#0F0F1A]">
            <a href="#skills" className="hover:bg-[#FFEB3B] px-3 py-1.5 rounded-xl border-2 border-transparent hover:border-[#0F0F1A] transition-all">
              Skills
            </a>
            <a href="#experience" className="hover:bg-[#FFEB3B] px-3 py-1.5 rounded-xl border-2 border-transparent hover:border-[#0F0F1A] transition-all">
              Experience
            </a>
            <a href="#projects" className="hover:bg-[#FFEB3B] px-3 py-1.5 rounded-xl border-2 border-transparent hover:border-[#0F0F1A] transition-all">
              Projects
            </a>
            <a href="#certifications" className="hover:bg-[#FFEB3B] px-3 py-1.5 rounded-xl border-2 border-transparent hover:border-[#0F0F1A] transition-all">
              Credentials
            </a>
            <a href="#contact" className="hover:bg-[#FFEB3B] px-3 py-1.5 rounded-xl border-2 border-transparent hover:border-[#0F0F1A] transition-all">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="px-4 py-2 text-xs sm:text-sm font-bold bg-[#2196F3] text-white rounded-xl border-2 border-[#0F0F1A] shadow-[2px_3px_0_#0F0F1A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_2px_0_#0F0F1A] active:translate-x-[2px] active:translate-y-[3px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>View CV</span>
            </button>

            <a
              href="https://linkedin.com/in/hermasbintang"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2.5 bg-white text-[#0F0F1A] rounded-xl border-2 border-[#0F0F1A] shadow-[2px_3px_0_#0F0F1A] hover:bg-[#FFEB3B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_2px_0_#0F0F1A] transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 bg-white rounded-xl border-2 border-[#0F0F1A] shadow-[2px_3px_0_#0F0F1A] text-[#0F0F1A] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-[#0F0F1A] bg-[#FFEB3B] px-6 py-4 mt-3.5 space-y-2 font-bold text-sm text-[#0F0F1A]">
            <a onClick={() => setIsMobileMenuOpen(false)} href="#skills" className="block py-1 hover:underline">Skills</a>
            <a onClick={() => setIsMobileMenuOpen(false)} href="#experience" className="block py-1 hover:underline">Experience</a>
            <a onClick={() => setIsMobileMenuOpen(false)} href="#projects" className="block py-1 hover:underline">Projects</a>
            <a onClick={() => setIsMobileMenuOpen(false)} href="#certifications" className="block py-1 hover:underline">Credentials</a>
            <a onClick={() => setIsMobileMenuOpen(false)} href="#contact" className="block py-1 hover:underline">Contact</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <span className="inline-block bg-[#FF5252] text-white font-mono text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border-2 border-[#0F0F1A] shadow-[2px_3px_0_#0F0F1A] mb-5">
              Linux System Administrator
            </span>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F0F1A] tracking-tight leading-[1.1] mb-5">
              Hermas{" "}
              <span className="bg-[#FFEB3B] px-3 py-0.5 rounded-2xl border-2 border-[#0F0F1A] inline-block shadow-[3px_4px_0_#0F0F1A]">
                Bintang
              </span>
            </h1>

            <p className="text-[#0F0F1A] text-base sm:text-lg leading-relaxed max-w-[54ch] mb-7 font-medium">
              Building and supporting production Linux hosting clusters, mail &amp; DNS infrastructure, and GCP cloud environments.
            </p>

            {/* Primary Actions */}
            <div className="flex flex-wrap gap-3.5 mb-8">
              <button
                onClick={() => setIsResumeModalOpen(true)}
                className="px-6 py-3 bg-[#FFEB3B] text-[#0F0F1A] font-bold text-sm rounded-xl border-2 border-[#0F0F1A] shadow-[3px_4px_0_#0F0F1A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_3px_0_#0F0F1A] active:translate-x-[3px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Open Resume</span>
              </button>

              <a
                href="#contact"
                className="px-6 py-3 bg-[#2196F3] text-white font-bold text-sm rounded-xl border-2 border-[#0F0F1A] shadow-[3px_4px_0_#0F0F1A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_3px_0_#0F0F1A] active:translate-x-[3px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2"
              >
                <span>Contact Me</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>

              <a
                href="https://www.skills.google/public_profiles/968ea3c6-53b5-4f68-b585-9445ba3bf76c"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-white text-[#0F0F1A] font-bold text-sm rounded-xl border-2 border-[#0F0F1A] shadow-[3px_4px_0_#0F0F1A] hover:bg-[#FFEB3B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_3px_0_#0F0F1A] transition-all flex items-center gap-2"
              >
                <span>GCP Badges</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Compact Contact Strip */}
            <div className="flex flex-wrap gap-3 text-xs font-mono">
              <div className="bg-white border-2 border-[#0F0F1A] rounded-xl px-3.5 py-2 shadow-[2px_3px_0_#0F0F1A]">
                <span className="text-neutral-500 font-bold mr-1.5">LOC:</span>
                <span className="font-bold">Sidoarjo, ID</span>
              </div>
              <a
                href="mailto:hermasbintang@gmail.com"
                className="bg-white border-2 border-[#0F0F1A] rounded-xl px-3.5 py-2 shadow-[2px_3px_0_#0F0F1A] hover:bg-[#FFEB3B] transition-colors font-bold"
              >
                hermasbintang@gmail.com
              </a>
              <a
                href="tel:085852484937"
                className="bg-white border-2 border-[#0F0F1A] rounded-xl px-3.5 py-2 shadow-[2px_3px_0_#0F0F1A] hover:bg-[#FFEB3B] transition-colors font-bold"
              >
                +62 858-5248-4937
              </a>
            </div>
          </div>

          {/* Right: Photo + Terminal */}
          <div className="lg:col-span-5 flex flex-col items-center gap-5">
            <div className="bg-[#93C5FD] p-2.5 rounded-2xl border-2 border-[#0F0F1A] shadow-[4px_5px_0_#0F0F1A]">
              <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-xl border-2 border-[#0F0F1A] overflow-hidden bg-white">
                <Image
                  alt="Hermas Bintang Putra Kinanti"
                  className="object-cover w-full h-full object-top"
                  height={400}
                  priority
                  src="/profile.jpg"
                  width={400}
                />
              </div>
            </div>

            {/* Interactive Terminal */}
            <div className="w-full bg-[#111827] text-white rounded-2xl border-2 border-[#0F0F1A] shadow-[4px_5px_0_#0F0F1A] overflow-hidden font-mono text-xs">
              <div className="bg-[#FFEB3B] text-[#0F0F1A] px-4 py-2 border-b-2 border-[#0F0F1A] flex items-center justify-between gap-2">
                <span className="font-bold">hermas@prod:~#</span>
                <div className="flex gap-1.5">
                  {(["neofetch", "cluster", "whoami"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-2.5 py-0.5 rounded-lg border-2 border-[#0F0F1A] text-[11px] font-bold transition-colors cursor-pointer ${
                        activeTab === tab
                          ? "bg-[#0F0F1A] text-[#FFEB3B]"
                          : "bg-white text-[#0F0F1A] hover:bg-[#93C5FD]"
                      }`}
                    >
                      {tab === "cluster" ? "services" : tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 leading-relaxed min-h-[150px]">
                {activeTab === "neofetch" && (
                  <div className="space-y-1">
                    <div className="text-[#FFEB3B] font-bold mb-1.5">$ neofetch</div>
                    <p><span className="text-[#93C5FD]">OS:</span> AlmaLinux, CloudLinux, Debian</p>
                    <p><span className="text-[#93C5FD]">Panels:</span> WHM/cPanel, Plesk, Enhance, Pterodactyl</p>
                    <p><span className="text-[#93C5FD]">Web/DB:</span> LiteSpeed, Nginx, Apache, MariaDB, Redis</p>
                    <p><span className="text-[#93C5FD]">Mail/DNS:</span> Exim, Postfix, Rspamd, PowerDNS, BIND</p>
                    <p><span className="text-[#93C5FD]">Cloud:</span> GCP, GKE, Docker, Terraform</p>
                  </div>
                )}

                {activeTab === "cluster" && (
                  <div className="space-y-1">
                    <div className="text-[#FFEB3B] font-bold mb-1.5">$ systemctl status</div>
                    <p className="text-[#86EFAC]">● enhance-cluster.service [ACTIVE]</p>
                    <p className="text-[#86EFAC]">● powerdns-dnssec.service [ACTIVE]</p>
                    <p className="text-[#86EFAC]">● postfix-rspamd.service  [ACTIVE]</p>
                    <p className="text-[#86EFAC]">● pterodactyl.service     [ACTIVE]</p>
                    <p className="text-[#86EFAC]">● grafana-icinga2.service [ACTIVE]</p>
                  </div>
                )}

                {activeTab === "whoami" && (
                  <div className="space-y-2">
                    <div className="text-[#FFEB3B] font-bold">$ whoami</div>
                    <p className="text-neutral-200">
                      SysAdmin focused on hosting reliability, root-cause analysis, mail deliverability, and cloud automation.
                    </p>
                    <p className="text-[#86EFAC] font-bold">
                      Languages: Indonesian (Native), English (Intermediate)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Row (Reference-inspired Rounded Cards with Pastel Circle Badges + Numbers) */}
      <section id="overview" className="py-10">
        <div className="max-w-7xl mx-auto px-6 relative">
          {/* Dashed connector line on large screens */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 border-t-2 border-dashed border-[#0F0F1A]/25 -z-10" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                num: "1",
                title: "> 90% CSAT",
                desc: "Global English support for international hosting clients.",
                circleBg: "bg-[#C4B5FD]",
                icon: (
                  <svg className="w-6 h-6 text-[#0F0F1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                num: "2",
                title: "0 → 1 Platform",
                desc: "Built Terashost multi-node cluster, DNS, mail & billing.",
                circleBg: "bg-[#93C5FD]",
                icon: (
                  <svg className="w-6 h-6 text-[#0F0F1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                  </svg>
                ),
              },
              {
                num: "3",
                title: "L1 → L3 Ops",
                desc: "Shared, VPS & dedicated Linux hardening under SLA.",
                circleBg: "bg-[#86EFAC]",
                icon: (
                  <svg className="w-6 h-6 text-[#0F0F1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
              },
              {
                num: "4",
                title: "GCP & IaC",
                desc: "Bangkit 2025 alum: GKE, Docker, Terraform & CI/CD.",
                circleBg: "bg-[#F9A8D4]",
                icon: (
                  <svg className="w-6 h-6 text-[#0F0F1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.num}
                className="bg-white border-2 border-[#0F0F1A] rounded-2xl p-6 shadow-[3px_4px_0_#0F0F1A] text-center flex flex-col items-center hover:-translate-y-0.5 transition-transform"
              >
                <div className="relative mb-4">
                  <div className={`w-14 h-14 ${item.circleBg} rounded-full border-2 border-[#0F0F1A] flex items-center justify-center`}>
                    {item.icon}
                  </div>
                  <span className="absolute -top-1 -right-1.5 w-6 h-6 rounded-full bg-[#FFEB3B] border-2 border-[#0F0F1A] font-mono text-xs font-extrabold flex items-center justify-center">
                    {item.num}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-[#0F0F1A] mb-1.5">{item.title}</h3>
                <p className="text-xs text-neutral-600 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Matrix */}
      <section id="skills" className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider bg-[#0F0F1A] text-[#FFEB3B] px-3 py-1 rounded-full inline-block mb-2.5">
              01 // Tech Stack
            </span>
            <h2 className="text-3xl font-extrabold text-[#0F0F1A] tracking-tight">Skills</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All" },
              { id: "os-infra", label: "Linux" },
              { id: "hosting-panels", label: "Panels" },
              { id: "web-db", label: "Web & DB" },
              { id: "email-dns", label: "Mail & DNS" },
              { id: "cloud-devops", label: "Cloud" },
              { id: "security-mon", label: "Security" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSkillCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-full border-2 border-[#0F0F1A] font-mono text-xs font-bold transition-all cursor-pointer ${
                  skillCategory === tab.id
                    ? "bg-[#FFEB3B] text-[#0F0F1A] shadow-[2px_3px_0_#0F0F1A]"
                    : "bg-white text-[#0F0F1A] hover:bg-[#93C5FD]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {filteredSkills.map((card, idx) => (
            <div
              key={idx}
              className={`${skillCategory === "all" ? card.span : "md:col-span-6"} bg-white rounded-2xl border-2 border-[#0F0F1A] shadow-[3px_4px_0_#0F0F1A] overflow-hidden flex flex-col`}
            >
              <div className={`${card.accent} px-5 py-3 border-b-2 border-[#0F0F1A] flex items-center justify-between`}>
                <h3 className="text-base font-extrabold">{card.title}</h3>
                <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-[#0F0F1A] border-2 border-[#0F0F1A]">
                  {card.level}
                </span>
              </div>
              <div className="p-5 flex flex-wrap gap-2">
                {card.items.map((item, i) => (
                  <span
                    key={i}
                    className="font-mono text-xs font-bold px-3 py-1 rounded-xl bg-[#FFFDF5] border-2 border-[#0F0F1A] text-[#0F0F1A]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <span className="font-mono text-xs font-bold uppercase tracking-wider bg-[#2196F3] text-white border-2 border-[#0F0F1A] px-3 py-1 rounded-full inline-block mb-2.5 shadow-[2px_2px_0_#0F0F1A]">
              02 // Experience
            </span>
            <h2 className="text-3xl font-extrabold text-[#0F0F1A] tracking-tight">
              Work &amp; Education
            </h2>
          </div>

          <div className="space-y-6">
            {/* Role 1 */}
            <div className="bg-white rounded-2xl border-2 border-[#0F0F1A] p-6 shadow-[3px_4px_0_#0F0F1A]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b-2 border-dashed border-[#0F0F1A]/20">
                <div>
                  <h3 className="text-xl font-extrabold text-[#0F0F1A]">Advanced Support</h3>
                  <p className="font-mono text-xs font-bold text-[#2196F3]">
                    World Host Group —{" "}
                    <a href="https://hosting.com" target="_blank" rel="noopener noreferrer" className="underline text-[#0F0F1A]">
                      hosting.com
                    </a>
                  </p>
                </div>
                <span className="font-mono text-xs font-bold bg-[#FFEB3B] border-2 border-[#0F0F1A] rounded-full px-3 py-1 w-fit">
                  12/2025 - Present
                </span>
              </div>
              <ul className="space-y-1.5 text-sm text-neutral-800 list-disc list-inside font-medium">
                <li>Hardened shared, VPS &amp; dedicated Linux servers (WHM/cPanel, Plesk, CloudLinux LVE).</li>
                <li>Resolved BIND DNS, AutoSSL, Exim/MailChannels (DKIM/SPF/DMARC), and CMS issues.</li>
                <li>Tuned LiteSpeed, PHP-FPM, MariaDB &amp; Redis; managed ModSecurity, CSF/LFD &amp; RCA.</li>
              </ul>
            </div>

            {/* Role 2 */}
            <div className="bg-white rounded-2xl border-2 border-[#0F0F1A] p-6 shadow-[3px_4px_0_#0F0F1A]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b-2 border-dashed border-[#0F0F1A]/20">
                <div>
                  <h3 className="text-xl font-extrabold text-[#0F0F1A]">System Architecture</h3>
                  <p className="font-mono text-xs font-bold text-[#FF5252]">Terashost</p>
                </div>
                <span className="font-mono text-xs font-bold bg-[#93C5FD] border-2 border-[#0F0F1A] rounded-full px-3 py-1 w-fit">
                  02/2025 - Present
                </span>
              </div>
              <ul className="space-y-1.5 text-sm text-neutral-800 list-disc list-inside font-medium">
                <li>Architected Enhance Control Panel clusters and Pterodactyl Docker game/VPS hosting.</li>
                <li>Built OpenLDAP IAM, PowerDNS (DNSSEC), and Postfix/Dovecot/Rspamd HA mail.</li>
                <li>Deployed Icinga2/Grafana/Prometheus monitoring and WHMCS API billing automation.</li>
              </ul>
            </div>

            {/* Role 3 & 4 side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border-2 border-[#0F0F1A] p-6 shadow-[3px_4px_0_#0F0F1A]">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#0F0F1A]">Live Chat Support</h3>
                    <p className="font-mono text-xs font-bold text-neutral-600">World Host Group</p>
                  </div>
                  <span className="font-mono text-[11px] font-bold bg-[#FFFDF5] border-2 border-[#0F0F1A] rounded-full px-2.5 py-0.5 shrink-0">
                    04/2024 - 12/2025
                  </span>
                </div>
                <p className="text-sm text-neutral-700 font-medium">
                  Real-time English troubleshooting via Chatwoot &amp; LiveChatInc across cPanel, Plesk, SiteWorx, and Upmind.
                </p>
              </div>

              <div className="bg-white rounded-2xl border-2 border-[#0F0F1A] p-6 shadow-[3px_4px_0_#0F0F1A]">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#0F0F1A]">Cloud Computing Intern</h3>
                    <p className="font-mono text-xs font-bold text-[#2196F3]">Bangkit Academy (Google, GoTo, Traveloka)</p>
                  </div>
                  <span className="font-mono text-[11px] font-bold bg-[#F9A8D4] border-2 border-[#0F0F1A] rounded-full px-2.5 py-0.5 shrink-0">
                    2025
                  </span>
                </div>
                <p className="text-sm text-neutral-700 font-medium">
                  Provisioned GCP (GKE, Cloud Run, Cloud SQL, VPC) with Docker, Terraform IaC, and Cloud Build CI/CD.
                </p>
              </div>
            </div>

            {/* Education */}
            <div className="bg-[#FFEB3B] rounded-2xl border-2 border-[#0F0F1A] p-5 shadow-[3px_4px_0_#0F0F1A] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-[#0F0F1A]">SMK Negeri 1 Pungging — Computer &amp; Network Engineering</h3>
                <p className="text-xs font-medium text-[#0F0F1A]">Computer Network Lab Assistant: hardware diagnostics, networking &amp; OS deployments.</p>
              </div>
              <span className="font-mono text-xs font-bold bg-white border-2 border-[#0F0F1A] rounded-full px-3 py-1 w-fit shrink-0">
                2019 - 2021
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Case Studies */}
      <section id="projects" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <span className="font-mono text-xs font-bold uppercase tracking-wider bg-[#FF5252] text-white border-2 border-[#0F0F1A] px-3 py-1 rounded-full inline-block mb-2.5 shadow-[2px_2px_0_#0F0F1A]">
              03 // Projects
            </span>
            <h2 className="text-3xl font-extrabold text-[#0F0F1A] tracking-tight">
              Architecture Highlights
            </h2>
          </div>

          <div className="space-y-8">
            {projectsData.map((project, idx) => {
              const isReversed = idx % 2 === 1;
              return (
                <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  <div
                    className={`lg:col-span-7 bg-white rounded-2xl border-2 border-[#0F0F1A] p-6 shadow-[3px_4px_0_#0F0F1A] flex flex-col justify-between ${
                      isReversed ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className={`${project.accent} font-mono text-xs font-bold px-3 py-1 rounded-full border-2 border-[#0F0F1A]`}>
                          {project.badge}
                        </span>
                        <span className="font-mono text-[11px] font-bold text-[#0F0F1A] border-2 border-[#0F0F1A] rounded-full px-2.5 py-0.5 bg-[#FFFDF5]">
                          {project.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-[#0F0F1A] mb-2">{project.title}</h3>
                      <p className="text-sm text-neutral-700 font-medium leading-relaxed mb-4">
                        {project.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-3 border-t-2 border-dashed border-[#0F0F1A]/20">
                      {project.stack.map((tech, i) => (
                        <span
                          key={i}
                          className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#FFFDF5] border-2 border-[#0F0F1A]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`lg:col-span-5 bg-[#111827] text-white rounded-2xl border-2 border-[#0F0F1A] shadow-[3px_4px_0_#0F0F1A] overflow-hidden flex flex-col justify-between ${
                      isReversed ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="bg-[#FFEB3B] text-[#0F0F1A] px-4 py-2 border-b-2 border-[#0F0F1A] font-mono text-xs font-bold flex justify-between items-center">
                      <span>TOPOLOGY // 0{idx + 1}</span>
                      <span>INFRA</span>
                    </div>
                    <pre className="p-5 font-mono text-xs text-[#86EFAC] overflow-x-auto leading-relaxed my-auto">
                      {project.diagramLines.join("\n")}
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section id="certifications" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider bg-[#FFEB3B] text-[#0F0F1A] border-2 border-[#0F0F1A] px-3 py-1 rounded-full inline-block mb-2.5 shadow-[2px_2px_0_#0F0F1A]">
                04 // Credentials
              </span>
              <h2 className="text-3xl font-extrabold text-[#0F0F1A] tracking-tight">
                Certifications
              </h2>
            </div>
            <a
              href="https://www.skills.google/public_profiles/968ea3c6-53b5-4f68-b585-9445ba3bf76c"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#2196F3] text-white font-mono text-xs font-bold rounded-xl border-2 border-[#0F0F1A] shadow-[2px_3px_0_#0F0F1A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_2px_0_#0F0F1A] transition-all inline-flex items-center gap-2 w-fit"
            >
              <span>Verify Google Cloud Profile</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                issuer: "Google Cloud",
                date: "2025",
                title: "Google Cloud Skill Badges (GCSB)",
                tagColor: "bg-[#93C5FD]",
                href: "https://www.skills.google/public_profiles/968ea3c6-53b5-4f68-b585-9445ba3bf76c",
              },
              {
                issuer: "Coursera",
                date: "07/2026",
                title: "IT Security: Defense Against the Digital Dark Arts",
                tagColor: "bg-[#F9A8D4]",
              },
              {
                issuer: "Coursera",
                date: "07/2026",
                title: "Operating Systems and You: Becoming a Power User",
                tagColor: "bg-[#FFEB3B]",
              },
              {
                issuer: "Coursera",
                date: "07/2026",
                title: "Technical Support Fundamentals",
                tagColor: "bg-[#86EFAC]",
              },
              {
                issuer: "Coursera",
                date: "12/2023",
                title: "The Bits and Bytes of Computer Networking",
                tagColor: "bg-[#C4B5FD]",
              },
              {
                issuer: "Coursera",
                date: "12/2023",
                title: "System Administration & IT Infrastructure Services",
                tagColor: "bg-[#93C5FD]",
              },
            ].map((cert, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border-2 border-[#0F0F1A] p-5 shadow-[3px_4px_0_#0F0F1A] flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`${cert.tagColor} font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full border-2 border-[#0F0F1A]`}>
                      {cert.issuer}
                    </span>
                    <span className="font-mono text-xs font-bold text-neutral-500">{cert.date}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#0F0F1A]">{cert.title}</h3>
                </div>
                {cert.href && (
                  <a
                    href={cert.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs font-bold bg-[#FFEB3B] px-3 py-1.5 rounded-xl border-2 border-[#0F0F1A] shadow-[2px_2px_0_#0F0F1A] shrink-0 hover:bg-[#93C5FD] transition-colors"
                  >
                    Verify
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact + Cloudflare Turnstile */}
      <section id="contact" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Info */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider bg-[#0F0F1A] text-[#FFEB3B] px-3 py-1 rounded-full inline-block mb-3">
                  05 // Contact
                </span>
                <h2 className="text-3xl font-extrabold text-[#0F0F1A] mb-3 tracking-tight">
                  Get in Touch
                </h2>
                <p className="text-sm text-neutral-700 font-medium mb-6">
                  Available for Linux SysAdmin roles, infrastructure architecture, and consulting.
                </p>

                <div className="space-y-3.5">
                  <div className="bg-white rounded-2xl border-2 border-[#0F0F1A] p-4 shadow-[3px_4px_0_#0F0F1A] flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-[#FFEB3B] border-2 border-[#0F0F1A] flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-mono text-[11px] font-bold text-neutral-500 block">EMAIL</span>
                      <a href="mailto:hermasbintang@gmail.com" className="font-bold text-sm text-[#0F0F1A] hover:text-[#2196F3] break-all">
                        hermasbintang@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border-2 border-[#0F0F1A] p-4 shadow-[3px_4px_0_#0F0F1A] flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-[#93C5FD] border-2 border-[#0F0F1A] flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-mono text-[11px] font-bold text-neutral-500 block">PHONE</span>
                      <a href="tel:085852484937" className="font-bold text-sm text-[#0F0F1A] hover:text-[#2196F3]">
                        +62 858-5248-4937
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://linkedin.com/in/hermasbintang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-white text-[#0F0F1A] font-bold text-xs rounded-xl border-2 border-[#0F0F1A] shadow-[2px_3px_0_#0F0F1A] hover:bg-[#FFEB3B] transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/StHermas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-white text-[#0F0F1A] font-bold text-xs rounded-xl border-2 border-[#0F0F1A] shadow-[2px_3px_0_#0F0F1A] hover:bg-[#FFEB3B] transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-[#0F0F1A] p-6 sm:p-8 shadow-[4px_5px_0_#0F0F1A]">
              <h3 className="text-xl font-extrabold text-[#0F0F1A] mb-1">Send Message</h3>
              <p className="text-xs font-mono text-neutral-500 mb-5">
                Protected by Cloudflare Turnstile
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-mono font-bold text-[#0F0F1A] mb-1.5">
                      NAME
                    </label>
                    <input
                      required
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#FFFDF5] rounded-xl border-2 border-[#0F0F1A] px-4 py-2.5 text-[#0F0F1A] text-sm font-medium focus:outline-none focus:bg-[#FFEB3B]/20"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-mono font-bold text-[#0F0F1A] mb-1.5">
                      EMAIL
                    </label>
                    <input
                      required
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#FFFDF5] rounded-xl border-2 border-[#0F0F1A] px-4 py-2.5 text-[#0F0F1A] text-sm font-medium focus:outline-none focus:bg-[#FFEB3B]/20"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-mono font-bold text-[#0F0F1A] mb-1.5">
                    MESSAGE
                  </label>
                  <textarea
                    required
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full bg-[#FFFDF5] rounded-xl border-2 border-[#0F0F1A] px-4 py-2.5 text-[#0F0F1A] text-sm font-medium focus:outline-none focus:bg-[#FFEB3B]/20 resize-none"
                    placeholder="Role or infrastructure inquiry..."
                  />
                </div>

                {/* Cloudflare Turnstile */}
                <div className="bg-[#FFFDF5] rounded-xl border-2 border-[#0F0F1A] p-3">
                  {turnstileSiteKey ? (
                    <div ref={turnstileContainerRef} className="min-h-[65px] flex items-center" />
                  ) : (
                    <p className="text-xs font-mono text-[#FF5252] font-bold">
                      TURNSTILE_SITE_KEY missing.
                    </p>
                  )}
                </div>

                {status === "success" && (
                  <div className="p-3 bg-[#86EFAC] rounded-xl border-2 border-[#0F0F1A] text-[#0F0F1A] font-bold text-xs shadow-[2px_3px_0_#0F0F1A]">
                    {statusMessage}
                  </div>
                )}
                {status === "error" && (
                  <div className="p-3 bg-[#FF5252] rounded-xl border-2 border-[#0F0F1A] text-white font-bold text-xs shadow-[2px_3px_0_#0F0F1A]">
                    {statusMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !turnstileToken}
                  className="w-full bg-[#FFEB3B] hover:bg-[#fde047] text-[#0F0F1A] font-extrabold py-3 rounded-xl border-2 border-[#0F0F1A] shadow-[3px_4px_0_#0F0F1A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_3px_0_#0F0F1A] active:translate-x-[3px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="no-print border-t-2 border-[#0F0F1A] py-6 bg-white text-[#0F0F1A] text-xs font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#FFEB3B] font-bold px-2.5 py-0.5 rounded-lg border-2 border-[#0F0F1A]">hermas.id</span>
            <span className="font-medium">&copy; {new Date().getFullYear()} Hermas Bintang Putra Kinanti</span>
          </div>
          <div className="flex items-center gap-4 font-bold">
            <a href="#home" className="hover:underline">Top &uarr;</a>
            <button onClick={() => setIsResumeModalOpen(true)} className="hover:underline cursor-pointer">
              View CV
            </button>
          </div>
        </div>
      </footer>

      {/* CV Modal */}
      {isResumeModalOpen && (
        <div className="cv-modal-overlay fixed inset-0 z-[300] bg-black/65 flex items-center justify-center p-4 overflow-y-auto">
          <div className="cv-modal-container bg-[#FFFDF5] rounded-2xl border-2 border-[#0F0F1A] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[6px_7px_0_#0F0F1A] overflow-hidden">
            {/* Modal Header */}
            <div className="cv-modal-header bg-[#FFEB3B] px-6 py-4 border-b-2 border-[#0F0F1A] flex justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#0F0F1A]">Curriculum Vitae</h3>
                <p className="text-xs font-mono font-bold text-[#0F0F1A]">Hermas Bintang Putra Kinanti</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-white text-[#0F0F1A] border-2 border-[#0F0F1A] shadow-[2px_2px_0_#0F0F1A] hover:bg-[#93C5FD] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={() => setIsResumeModalOpen(false)}
                  className="p-1.5 rounded-xl bg-[#FF5252] text-white border-2 border-[#0F0F1A] shadow-[2px_2px_0_#0F0F1A] hover:bg-[#0F0F1A] transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="cv-modal-body p-6 sm:p-8 overflow-y-auto text-[#0F0F1A] text-sm space-y-5">
              <div className="border-b-2 border-[#0F0F1A] pb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold">Hermas Bintang Putra Kinanti</h1>
                  <p className="text-[#2196F3] font-bold">Linux System Administrator</p>
                  <p className="text-xs font-mono text-neutral-600 mt-0.5">Sidoarjo, Jawa Timur, Indonesia</p>
                </div>
                <div className="text-xs font-mono space-y-1 sm:text-right">
                  <p><a href="mailto:hermasbintang@gmail.com" className="text-[#2196F3] font-bold underline">hermasbintang@gmail.com</a></p>
                  <p className="font-bold">085852484937</p>
                  <p><a href="https://hermas.id" className="text-[#2196F3] font-bold underline">hermas.id</a></p>
                  <p><a href="https://linkedin.com/in/hermasbintang" target="_blank" rel="noopener noreferrer" className="text-[#2196F3] font-bold underline">linkedin.com/in/hermasbintang</a></p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold uppercase bg-[#0F0F1A] text-[#FFEB3B] px-2.5 py-0.5 rounded-full inline-block mb-2">
                  Summary
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed">
                  Linux System Administrator experienced in designing, deploying, and supporting production hosting infrastructure across Linux, control panels, DNS, email, virtualization, monitoring, and security hardening.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold uppercase bg-[#0F0F1A] text-[#FFEB3B] px-2.5 py-0.5 rounded-full inline-block mb-3">
                  Experience
                </h4>
                <div className="space-y-4">
                  <div className="border-l-2 border-[#0F0F1A] pl-4">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h5 className="font-extrabold text-sm">Advanced Support — World Host Group (hosting.com)</h5>
                      </div>
                      <span className="text-xs font-mono font-bold shrink-0">12/2025 - Present</span>
                    </div>
                    <ul className="list-disc list-inside text-xs space-y-1 mt-1.5 text-neutral-800">
                      <li>Hardened shared, VPS &amp; dedicated Linux servers (WHM/cPanel, Plesk, CloudLinux LVE).</li>
                      <li>Managed Exim, MailChannels, DKIM/SPF/DMARC, PTR, BIND DNS zones &amp; SSL/TLS.</li>
                      <li>Tuned LiteSpeed/Apache, PHP-FPM, MariaDB &amp; Redis; handled ModSecurity, CSF/LFD &amp; RCA.</li>
                    </ul>
                  </div>

                  <div className="border-l-2 border-[#0F0F1A] pl-4">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h5 className="font-extrabold text-sm">System Architecture — Terashost</h5>
                      </div>
                      <span className="text-xs font-mono font-bold shrink-0">02/2025 - Present</span>
                    </div>
                    <ul className="list-disc list-inside text-xs space-y-1 mt-1.5 text-neutral-800">
                      <li>Architected Enhance Control Panel multi-server clusters &amp; Pterodactyl Docker hosting.</li>
                      <li>Engineered OpenLDAP IAM, PowerDNS (DNSSEC), Postfix/Dovecot/Rspamd HA mail &amp; Icinga2/Grafana/Prometheus.</li>
                      <li>Automated client lifecycle and provisioning via WHMCS APIs and Deployer.</li>
                    </ul>
                  </div>

                  <div className="border-l-2 border-[#0F0F1A] pl-4">
                    <div className="flex justify-between items-start gap-2">
                      <h5 className="font-extrabold text-sm">Live Chat Support — World Host Group</h5>
                      <span className="text-xs font-mono font-bold shrink-0">04/2024 - 12/2025</span>
                    </div>
                    <p className="text-xs mt-1 text-neutral-800">
                      Real-time English hosting support via Chatwoot &amp; LiveChatInc across cPanel, Plesk, SiteWorx (&gt;90% CSAT).
                    </p>
                  </div>

                  <div className="border-l-2 border-[#0F0F1A] pl-4">
                    <div className="flex justify-between items-start gap-2">
                      <h5 className="font-extrabold text-sm">Cloud Computing Intern — Bangkit Academy</h5>
                      <span className="text-xs font-mono font-bold shrink-0">2025</span>
                    </div>
                    <p className="text-xs mt-1 text-neutral-800">
                      Provisioned GCP (GKE, Cloud Run, Cloud SQL, VPC) using Docker, Terraform IaC &amp; Cloud Build CI/CD.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t-2 border-dashed border-[#0F0F1A]/30">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase bg-[#0F0F1A] text-[#FFEB3B] px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                    Education
                  </h4>
                  <p className="font-bold text-xs">Computer &amp; Network Engineering</p>
                  <p className="text-xs text-neutral-700">SMK Negeri 1 Pungging (2019 - 2021)</p>
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase bg-[#0F0F1A] text-[#FFEB3B] px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                    Certifications
                  </h4>
                  <p className="text-xs text-neutral-700">Google Cloud Skill Badges (GCSB) &amp; Coursera IT Security, OS, Networking, SysAdmin, Support</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="cv-modal-footer bg-white px-6 py-3 border-t-2 border-[#0F0F1A] flex justify-end gap-3">
              <button
                onClick={() => setIsResumeModalOpen(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-white text-[#0F0F1A] border-2 border-[#0F0F1A] shadow-[2px_2px_0_#0F0F1A] hover:bg-[#FFEB3B] cursor-pointer"
              >
                Close
              </button>
              <a
                href="mailto:hermasbintang@gmail.com?subject=Job%20Opportunity%20-%20Hermas%20Bintang"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#2196F3] text-white border-2 border-[#0F0F1A] shadow-[2px_2px_0_#0F0F1A]"
              >
                Email Directly
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
