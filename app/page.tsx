"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"" | "success" | "error">("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"neofetch" | "cluster" | "whoami">("neofetch");
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [skillCategory, setSkillCategory] = useState<string>("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const skillsData = [
    {
      category: "os-infra",
      title: "Linux & Operating Systems",
      level: "Expert",
      items: ["AlmaLinux / RHEL", "CloudLinux & LVE", "CentOS", "Debian & Ubuntu", "Bash Scripting", "Systemd Services", "Kernel & Sysctl Tuning", "Log Analysis & Diagnostics"],
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      category: "hosting-panels",
      title: "Hosting Panels & Virtualization",
      level: "Expert",
      items: ["cPanel / WHM", "Plesk Onyx/Obsidian", "Enhance Control Panel (Clustered)", "Pterodactyl Panel (Docker)", "SiteWorx", "WHMCS API Automation", "Upmind Client Area", "KVM Virtualization"],
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      )
    },
    {
      category: "web-db",
      title: "Web Servers & Performance",
      level: "Advanced",
      items: ["LiteSpeed Enterprise (LSWS)", "Apache HTTP Server", "Nginx (Reverse Proxy & Caching)", "PHP-FPM Optimization", "MariaDB / MySQL Tuning", "Redis Caching", "OPcache", "HTTP/2 & HTTP/3 (QUIC)"],
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      category: "email-dns",
      title: "Email & DNS Infrastructure",
      level: "Advanced",
      items: ["Exim MTA", "Postfix & Dovecot", "Rspamd Anti-Spam", "DKIM, SPF, DMARC Enforcement", "MailChannels Relay", "Reverse DNS (PTR)", "PowerDNS & BIND9", "DNSSEC & Anycast DNS"],
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      category: "cloud-devops",
      title: "Cloud & DevOps (GCP & Containers)",
      level: "Advanced",
      items: ["Google Cloud Platform (GCP)", "Google Kubernetes Engine (GKE)", "Docker Containers", "Terraform (IaC)", "Google Cloud Build", "Cloud Run & Cloud Storage", "VPC & Cloud IAM", "Deployer Automation"],
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      category: "security-mon",
      title: "Security, IAM & Observability",
      level: "Intermediate - Advanced",
      items: ["Prometheus & Grafana", "Icinga2 Monitoring", "OpenLDAP Centralized IAM", "ModSecurity WAF", "CSF/LFD Firewall", "Malware Investigation", "SSL/TLS Hardening", "Root Cause Analysis (RCA)"],
      icon: (
        <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  const filteredSkills = skillCategory === "all"
    ? skillsData
    : skillsData.filter(s => s.category === skillCategory);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-200 selection:bg-blue-500 selection:text-white">
      {/* Top Banner / Availability */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-blue-950/60 border-b border-blue-800/40 py-2 px-4 text-xs font-mono text-center text-blue-200 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
        <span className="font-semibold text-emerald-400">STATUS: AVAILABLE</span>
        <span className="text-slate-400">|</span>
        <span>Open for Linux SysAdmin, Cloud Infrastructure & Hosting Engineering Roles</span>
        <span className="hidden sm:inline text-slate-400">|</span>
        <span className="hidden sm:inline text-blue-300">Remote / Full-time</span>
      </div>

      {/* Navigation */}
      <nav className="w-full bg-[#090d16]/90 backdrop-blur-md z-40 py-4 sticky top-0 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex justify-between items-center">
          <a href="#home" className="text-xl font-bold font-mono text-blue-400 tracking-wide hover:text-white transition-colors">
            Portofolio
          </a>

          <div className="hidden lg:flex items-center space-x-7 text-sm font-medium text-slate-300">
            <a href="#overview" className="hover:text-blue-400 transition-colors">Overview</a>
            <a href="#skills" className="hover:text-blue-400 transition-colors">Skills Matrix</a>
            <a href="#experience" className="hover:text-blue-400 transition-colors">Experience</a>
            <a href="#projects" className="hover:text-blue-400 transition-colors">Architecture Projects</a>
            <a href="#certifications" className="hover:text-blue-400 transition-colors">Credentials</a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-md shadow-blue-600/25 flex items-center gap-1.5 sm:gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>CV / Resume</span>
            </button>
            <a
              href="https://linkedin.com/in/hermasbintang"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2 border border-slate-700 hover:border-blue-500 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
            </a>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#0c1220] px-6 py-4 mt-4 space-y-3 font-medium text-sm text-slate-300">
            <a onClick={() => setIsMobileMenuOpen(false)} href="#overview" className="block hover:text-blue-400 transition-colors">Overview</a>
            <a onClick={() => setIsMobileMenuOpen(false)} href="#skills" className="block hover:text-blue-400 transition-colors">Skills Matrix</a>
            <a onClick={() => setIsMobileMenuOpen(false)} href="#experience" className="block hover:text-blue-400 transition-colors">Experience</a>
            <a onClick={() => setIsMobileMenuOpen(false)} href="#projects" className="block hover:text-blue-400 transition-colors">Architecture Projects</a>
            <a onClick={() => setIsMobileMenuOpen(false)} href="#certifications" className="block hover:text-blue-400 transition-colors">Credentials</a>
            <a onClick={() => setIsMobileMenuOpen(false)} href="#contact" className="block hover:text-blue-400 transition-colors">Contact</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="max-w-7xl mx-auto px-6 sm:px-8 pt-10 pb-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Intro */}
          <div className="lg:col-span-7 flex flex-col items-start">

            <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-4">
              Hermas{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
                Bintang
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300 font-medium mb-5">
              <span className="text-blue-400 font-semibold">Linux System Administrator</span>
              <span className="text-slate-600">•</span>
              <span>Hosting Infrastructure Architect</span>
              <span className="text-slate-600">•</span>
              <span>Bangkit GCP Cloud Alum</span>
            </div>

            <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed max-w-2xl">
              Experienced in designing, deploying, and supporting enterprise Linux hosting environments and multi-server clusters. Skilled in <strong>cPanel/WHM, Plesk, Enhance Control Panel, DNSSEC, email deliverability (DKIM/SPF/DMARC)</strong>, web performance tuning, and <strong>Google Cloud Platform (GCP)</strong>. Proven track record maintaining 90%+ CSAT and high-availability operations.
            </p>

            {/* Recruiter Action Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
              <button
                onClick={() => setIsResumeModalOpen(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Read Full Resume / CV</span>
              </button>

              <a
                href="#contact"
                className="px-6 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700 hover:border-slate-600 rounded-xl font-medium text-sm transition-all flex items-center gap-2"
              >
                <span>Contact & Hire</span>
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>

              <a
                href="https://www.skills.google/public_profiles/968ea3c6-53b5-4f68-b585-9445ba3bf76c"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 border border-slate-700 hover:border-blue-400 text-slate-300 hover:text-white rounded-xl font-medium text-sm transition-all flex items-center gap-2 bg-slate-900/40"
              >
                <span>Google Cloud Badges</span>
                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Quick Metadata for Recruiters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 w-full text-xs font-mono text-slate-400">
              <div>
                <span className="text-slate-500 block">LOCATION</span>
                <span className="text-slate-200 font-sans font-medium text-sm">Sidoarjo, Jawa Timur, ID</span>
              </div>
              <div>
                <span className="text-slate-500 block">WORK AUTHORIZATION</span>
                <span className="text-slate-200 font-sans font-medium text-sm">Global Remote / On-site</span>
              </div>
              <div>
                <span className="text-slate-500 block">DIRECT EMAIL</span>
                <a href="mailto:hello@hermas.id" className="text-blue-400 font-sans font-medium text-sm hover:underline">hello@hermas.id</a>
              </div>
            </div>
          </div>

          {/* Right Column: Profile + SysAdmin Live Terminal */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Profile Avatar Card */}
            <div className="relative mb-6">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl p-1 bg-gradient-to-tr from-blue-500 via-indigo-500 to-sky-400 shadow-xl shadow-blue-500/10">
                <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-900 relative">
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
              <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-xs font-mono text-emerald-400 flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>90%+ CSAT</span>
              </div>
            </div>

            {/* Interactive Terminal Widget */}
            <div className="w-full bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
              {/* Terminal Title Bar */}
              <div className="bg-[#131b2e] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-slate-400 text-[11px] ml-2">sysadmin@hermas-srv:~#</span>
                </div>
                {/* Command tabs */}
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveTab("neofetch")}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${activeTab === "neofetch" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                      }`}
                  >
                    neofetch
                  </button>
                  <button
                    onClick={() => setActiveTab("cluster")}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${activeTab === "cluster" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                      }`}
                  >
                    services
                  </button>
                  <button
                    onClick={() => setActiveTab("whoami")}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${activeTab === "whoami" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                      }`}
                  >
                    whoami
                  </button>
                </div>
              </div>

              {/* Terminal Content */}
              <div className="p-4 text-slate-300 leading-relaxed min-h-[190px]">
                {activeTab === "neofetch" && (
                  <div>
                    <div className="text-blue-400 font-bold mb-2">$ neofetch --recruiter-view</div>
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-12 sm:col-span-12 space-y-1">
                        <p><span className="text-blue-400">User:</span> hermas @ World Host Group & Terashost</p>
                        <p><span className="text-blue-400">OS:</span> Linux Production (AlmaLinux, CloudLinux, Debian)</p>
                        <p><span className="text-blue-400">Kernel:</span> 6.8.0-cloud-ha #1 SMP PREEMPT</p>
                        <p><span className="text-blue-400">Uptime:</span> 99.9% Production SLA Targets Met</p>
                        <p><span className="text-blue-400">Control Panels:</span> WHM/cPanel, Plesk, Enhance CP, Pterodactyl</p>
                        <p><span className="text-blue-400">Cloud & IaC:</span> GCP, GKE, Docker, Terraform, Cloud Build</p>
                        <p><span className="text-blue-400">Mail/DNS:</span> Exim, Postfix, Rspamd, PowerDNS, DNSSEC, DMARC</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "cluster" && (
                  <div>
                    <div className="text-blue-400 font-bold mb-2">$ systemctl status production-cluster</div>
                    <div className="space-y-1 text-[11px]">
                      <p className="text-emerald-400">● enhance-multiserver.service - ACTIVE (High Availability)</p>
                      <p className="text-emerald-400">● powerdns-authoritative.service - ACTIVE (DNSSEC Validated)</p>
                      <p className="text-emerald-400">● exim-postfix-mail.service - ACTIVE (DMARC/SPF/DKIM Enforced)</p>
                      <p className="text-emerald-400">● pterodactyl-daemon.service - ACTIVE (Containerized Workloads)</p>
                      <p className="text-emerald-400">● prometheus-grafana.service - ACTIVE (Real-time Metrics)</p>
                      <p className="text-blue-400 mt-2 font-mono">Tasks: 182 total, 0 zombies | Memory: 32G used / 128G pool</p>
                    </div>
                  </div>
                )}

                {activeTab === "whoami" && (
                  <div>
                    <div className="text-blue-400 font-bold mb-2">$ whoami --purpose</div>
                    <p className="text-slate-300 mb-2">
                      &quot;A Linux System Administrator with production experience supporting enterprise hosting providers and designing clustered platforms from scratch. Dedicated to high uptime, rapid incident resolution, and rock-solid email and DNS infrastructure.&quot;
                    </p>
                    <p className="text-amber-300 text-[11px]">
                      Ready to bring immediate reliability and efficiency to your infrastructure team.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Recruiter Impact Highlights Bar */}
      <section id="overview" className="border-y border-slate-800/80 bg-slate-900/50 py-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 mb-1">&gt; 90%</div>
              <div className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">CSAT Score</div>
              <p className="text-xs text-slate-400 mt-1">Global technical support for international hosting clients</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-sky-400 mb-1">99.9%</div>
              <div className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">SLA Target Met</div>
              <p className="text-xs text-slate-400 mt-1">Multi-server production clusters & enterprise hosting</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 mb-1">Full-Stack</div>
              <div className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">SysAdmin & Hosting</div>
              <p className="text-xs text-slate-400 mt-1">cPanel, Plesk, Enhance, Postfix, PowerDNS, WHMCS</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mb-1">GCP & IaC</div>
              <div className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">Cloud Certified</div>
              <p className="text-xs text-slate-400 mt-1">Bangkit Academy (Google, GoTo, Traveloka), GKE, Terraform</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Skills Matrix Section */}
      <section id="skills" className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-blue-400 font-mono text-xs uppercase tracking-widest font-semibold block mb-2">Technical Competencies</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Core Infrastructure Skills</h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md mt-3 md:mt-0">
            Categorized technical capabilities based on production experience in enterprise hosting, independent platforms, and cloud environments.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "all", label: "All Competencies" },
            { id: "os-infra", label: "Linux & OS" },
            { id: "hosting-panels", label: "Control Panels & Hosting" },
            { id: "web-db", label: "Web Servers & Caching" },
            { id: "email-dns", label: "Email & DNS Infrastructure" },
            { id: "cloud-devops", label: "Cloud & DevOps" },
            { id: "security-mon", label: "Security & Observability" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSkillCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${skillCategory === tab.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((card, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-blue-500/60 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {card.level}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                  {card.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {card.items.map((item, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:border-slate-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Professional Experience Section */}
      <section id="experience" className="max-w-7xl mx-auto px-6 sm:px-8 py-20 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-blue-400 font-mono text-xs uppercase tracking-widest font-semibold block mb-2">Track Record</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Work Experience</h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md mt-3 md:mt-0">
            Progressive career trajectory from international technical support to advanced infrastructure troubleshooting and platform architecture.
          </p>
        </div>

        <div className="relative border-l-2 border-blue-900/60 pl-6 sm:pl-10 ml-3 sm:ml-6 space-y-12">

          {/* Experience Item 1: Advanced Support */}
          <div className="relative group">
            <span className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-[#090d16] group-hover:scale-125 transition-transform" />
            <div className="bg-[#0d1322] p-6 sm:p-8 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Advanced Support</h3>
                  <p className="text-blue-400 font-medium text-sm">
                    World Host Group - <a href="https://hosting.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">hosting.com</a>
                  </p>
                </div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20 w-fit">
                  12/2025 - Present
                </span>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Managing high-tier technical support and production server administration across enterprise shared, VPS, and dedicated Linux environments. Consistently meeting stringent SLA targets while resolving complex web hosting, email, and networking issues.
              </p>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 list-disc list-inside">
                <li><strong className="text-white">Linux Server Hardening:</strong> Administered shared, VPS, and dedicated servers using WHM/cPanel, Plesk, and CloudLinux (LVE resource management &amp; isolation).</li>
                <li><strong className="text-white">Email Infrastructure:</strong> Configured and troubleshot Exim, SMTP, IMAP/POP3, DKIM, SPF, DMARC, MailChannels, reverse DNS (PTR), and mail routing to optimize deliverability.</li>
                <li><strong className="text-white">DNS &amp; SSL:</strong> Maintained BIND DNS zones, nameserver delegation, registrar records, and automated SSL/TLS issuance (Let&apos;s Encrypt, AutoSSL, 3rd party CAs).</li>
                <li><strong className="text-white">Web Stack Performance:</strong> Tuned Apache, LiteSpeed, PHP-FPM pools, MariaDB/MySQL, Redis caching, and OPcache to maximize uptime and prevent bottlenecks.</li>
                <li><strong className="text-white">Security &amp; Root Cause Analysis (RCA):</strong> Managed ModSecurity WAF, CSF/LFD firewalls, investigated malware injections, mitigated brute-force attacks, and delivered detailed technical post-mortems.</li>
              </ul>
            </div>
          </div>

          {/* Experience Item 2: System Architecture at Terashost */}
          <div className="relative group">
            <span className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-cyan-500 border-4 border-[#090d16] group-hover:scale-125 transition-transform" />
            <div className="bg-[#0d1322] p-6 sm:p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">System Architecture</h3>
                  <p className="text-cyan-400 font-medium text-sm">Terashost</p>
                </div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 w-fit">
                  02/2025 - Present
                </span>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Architected, deployed, and maintain a complete web and cloud hosting infrastructure from the ground up, covering compute, networking, storage, DNS, email, observability, and automated billing.
              </p>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 list-disc list-inside">
                <li><strong className="text-white">Multi-Server Cluster:</strong> Architected Enhance Control Panel multi-node cluster, separating web, database, email, and control planes for high availability and zero-single-point-of-failure.</li>
                <li><strong className="text-white">Virtualization &amp; Game Servers:</strong> Deployed and managed Pterodactyl Panel on Docker for automated provisioning of Minecraft and high-performance game server workloads.</li>
                <li><strong className="text-white">Identity &amp; Directory:</strong> Engineered centralized identity and access management using OpenLDAP across all infrastructure servers.</li>
                <li><strong className="text-white">Authoritative DNS &amp; HA Mail:</strong> Built redundant PowerDNS nameservers with DNSSEC replication, and a resilient Postfix + Dovecot + Rspamd email cluster.</li>
                <li><strong className="text-white">Observability &amp; Automation:</strong> Implemented Prometheus, Grafana, and Icinga2 for real-time alerting; automated full client lifecycle via WHMCS API integrations and Deployer.</li>
              </ul>
            </div>
          </div>

          {/* Experience Item 3: Live Chat Support */}
          <div className="relative group">
            <span className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-slate-500 border-4 border-[#090d16] group-hover:scale-125 transition-transform" />
            <div className="bg-[#0d1322] p-6 sm:p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Live Chat Support</h3>
                  <p className="text-slate-400 font-medium text-sm">
                    World Host Group - hosting.com
                  </p>
                </div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700 w-fit">
                  04/2024 - 12/2025
                </span>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Delivered real-time technical support in English via Chatwoot and LiveChatInc to international clients, diagnosing hosting, DNS, email, and website issues across cPanel, WHM, Plesk, and SiteWorx.
              </p>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 list-disc list-inside">
                <li><strong className="text-white">&gt; 90% CSAT:</strong> Maintained over 90% Customer Satisfaction score through empathetic, precise, and fast troubleshooting.</li>
                <li><strong className="text-white">Triage &amp; Escalations:</strong> Accurately gathered issue replication data, preliminary logs, and packet traces to streamline escalation to Tier-2 / Tier-3 systems teams.</li>
              </ul>
            </div>
          </div>

          {/* Experience Item 4: Bangkit Academy */}
          <div className="relative group">
            <span className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-amber-500 border-4 border-[#090d16] group-hover:scale-125 transition-transform" />
            <div className="bg-[#0d1322] p-6 sm:p-8 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Cloud Computing Intern</h3>
                  <p className="text-amber-400 font-medium text-sm">
                    Bangkit Academy led by Google, Tokopedia GoTo, Traveloka
                  </p>
                </div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 w-fit">
                  2025
                </span>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Selected for the highly competitive Google Cloud Computing learning path, focusing on cloud architecture, container orchestration, Infrastructure-as-Code, and automated CI/CD pipelines.
              </p>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 list-disc list-inside">
                <li><strong className="text-white">GCP Provisioning:</strong> Configured Compute Engine, Cloud Run, Cloud Storage, VPC networks, Cloud SQL, and Cloud Load Balancing.</li>
                <li><strong className="text-white">Containers &amp; Kubernetes:</strong> Containerized applications with Docker and deployed scalable workloads on Google Kubernetes Engine (GKE).</li>
                <li><strong className="text-white">Terraform &amp; CI/CD:</strong> Provisioned reproducible cloud infrastructure using Terraform (IaC) and established automated build pipelines with Google Cloud Build and GitHub.</li>
              </ul>
            </div>
          </div>

          {/* Education */}
          <div className="relative group">
            <span className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-slate-600 border-4 border-[#090d16]" />
            <div className="bg-[#0d1322]/60 p-6 rounded-2xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <h3 className="text-lg font-bold text-white">Major in Computer and Network Engineering</h3>
                <span className="text-xs font-mono text-slate-400">2019 - 2021</span>
              </div>
              <p className="text-blue-400 text-sm font-medium mb-2">SMK Negeri 1 Pungging - Vocational School</p>
              <p className="text-xs text-slate-400">
                Served as a Lab Assistant in the Computer Network Laboratory, mentoring students in hardware diagnostics, IP subnetting, routing, switching, and Linux OS deployments.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Architecture Case Studies */}
      <section id="projects" className="max-w-7xl mx-auto px-6 sm:px-8 py-20 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-blue-400 font-mono text-xs uppercase tracking-widest font-semibold block mb-2">Real Production Deployments</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Featured Architecture Case Studies</h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md mt-3 md:mt-0">
            Real infrastructure projects demonstrating end-to-end server clustering, automation, and enterprise email security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Project 1 */}
          <div className="p-8 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-blue-400 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                  Production Infrastructure
                </span>
                <span className="text-xs font-mono text-emerald-400">● Live Clustered</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                High-Availability Multi-Server Hosting Cluster (Terashost)
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Designed and deployed a scalable multi-node web hosting infrastructure utilizing <strong>Enhance Control Panel</strong>. Disaggregated workloads into independent web app nodes, MariaDB database nodes, and Postfix/Rspamd mail nodes with centralized OpenLDAP identity management and automated provisioning via WHMCS APIs.
              </p>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400 mb-2">TECH STACK &amp; PROTOCOLS:</div>
              <div className="flex flex-wrap gap-2">
                {["Enhance CP", "OpenLDAP", "PowerDNS", "Postfix", "Rspamd", "WHMCS API", "Linux KVM"].map((t, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 bg-slate-800/80 rounded border border-slate-700 text-slate-300">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div className="p-8 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-cyan-400 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                  Deliverability &amp; Security
                </span>
                <span className="text-xs font-mono text-cyan-400">● High Deliverability</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                Enterprise Email Infrastructure &amp; Anti-Spam Pipeline
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Engineered reliable email routing architectures across high-volume environments using <strong>Exim, Postfix, and MailChannels</strong>. Implemented strict DKIM 2048-bit signing, SPF record alignment, DMARC reporting, PTR/rDNS verification, and Rspamd neural-network filtering, eliminating spam outbound abuse and blacklisting.
              </p>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400 mb-2">TECH STACK &amp; PROTOCOLS:</div>
              <div className="flex flex-wrap gap-2">
                {["Exim", "Postfix", "Dovecot", "Rspamd", "DKIM/SPF/DMARC", "MailChannels", "rDNS / PTR"].map((t, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 bg-slate-800/80 rounded border border-slate-700 text-slate-300">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Project 3 */}
          <div className="p-8 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-amber-400 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                  Google Cloud Platform
                </span>
                <span className="text-xs font-mono text-amber-400">● Bangkit Capstone</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
                Cloud-Native Microservices with Terraform &amp; GKE
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Provisioned reproducible cloud-native microservices infrastructure on GCP using <strong>Terraform (IaC)</strong>. Architected Google Kubernetes Engine (GKE) clusters with autoscaling node pools, VPC peering, Cloud SQL managed databases, Secret Manager, and automated CI/CD deployment pipelines via Google Cloud Build.
              </p>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400 mb-2">TECH STACK &amp; PROTOCOLS:</div>
              <div className="flex flex-wrap gap-2">
                {["Google Cloud (GCP)", "GKE", "Docker", "Terraform", "Cloud Build", "Cloud SQL", "IAM"].map((t, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 bg-slate-800/80 rounded border border-slate-700 text-slate-300">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Project 4 */}
          <div className="p-8 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-indigo-400 px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/20">
                  Hardening &amp; Performance
                </span>
                <span className="text-xs font-mono text-indigo-400">● Web Acceleration</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                Production Linux Tuning, LVE Limits &amp; Security Hardening
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Optimized shared and dedicated hosting servers with <strong>CloudLinux LVE</strong> (memory/CPU isolation), LiteSpeed Enterprise web server, and Redis object caching. Configured ModSecurity WAF rules, CSF/LFD intrusion detection, automated brute-force mitigation, and isolated compromised accounts with minimal impact to neighbors.
              </p>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400 mb-2">TECH STACK &amp; PROTOCOLS:</div>
              <div className="flex flex-wrap gap-2">
                {["CloudLinux LVE", "LiteSpeed", "ModSecurity", "CSF/LFD", "Redis", "PHP-FPM", "MySQL Tuning"].map((t, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 bg-slate-800/80 rounded border border-slate-700 text-slate-300">{t}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Certifications & Verified Credentials */}
      <section id="certifications" className="max-w-7xl mx-auto px-6 sm:px-8 py-20 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-blue-400 font-mono text-xs uppercase tracking-widest font-semibold block mb-2">Verified Qualifications</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Certifications &amp; Badges</h2>
          </div>
          <a
            href="https://www.skills.google/public_profiles/968ea3c6-53b5-4f68-b585-9445ba3bf76c"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-white font-medium text-sm flex items-center gap-1.5 transition-colors mt-3 md:mt-0"
          >
            <span>View Public Google Cloud Skills Profile</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Cert 1 */}
          <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">Google Cloud</span>
              <span className="text-xs font-mono text-slate-400">2025</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Google Cloud Skill Badges (GCSB)</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Demonstrated hands-on proficiency in Cloud Architecture, VPC Networking, Google Kubernetes Engine (GKE), DevOps, and Cloud Operations.
            </p>
            <a
              href="https://www.skills.google/public_profiles/968ea3c6-53b5-4f68-b585-9445ba3bf76c"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-mono"
            >
              Verify Profile &rarr;
            </a>
          </div>

          {/* Cert 2 */}
          <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Coursera</span>
              <span className="text-xs font-mono text-slate-400">07/2026</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">IT Security: Defense Against Digital Dark Arts</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Cybersecurity fundamentals including cryptography, IAM, network security, endpoint defense, firewalls, and incident response.
            </p>
          </div>

          {/* Cert 3 */}
          <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Coursera</span>
              <span className="text-xs font-mono text-slate-400">07/2026</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Operating Systems and You: Becoming a Power User</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Linux &amp; Windows administration, CLI automation, process management, file systems, permissions, and system maintenance.
            </p>
          </div>

          {/* Cert 4 */}
          <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Coursera</span>
              <span className="text-xs font-mono text-slate-400">12/2023</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">The Bits and Bytes of Computer Networking</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              OSI &amp; TCP/IP models, IPv4/IPv6 addressing, subnetting, routing, switching, DNS, DHCP, VPNs, and packet tracing diagnostics.
            </p>
          </div>

          {/* Cert 5 */}
          <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Coursera</span>
              <span className="text-xs font-mono text-slate-400">12/2023</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">System Administration &amp; IT Infrastructure Services</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Managing enterprise server environments, core IT infrastructure services, and centralized directory administration for multi-user setups.
            </p>
          </div>

          {/* Cert 6 */}
          <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">Coursera</span>
              <span className="text-xs font-mono text-slate-400">07/2026</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Technical Support Fundamentals</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Enterprise IT troubleshooting methodologies, hardware diagnostics, customer support best practices, and core network fundamentals.
            </p>
          </div>

        </div>
      </section>

      {/* Contact & Recruiter Inquiries */}
      <section id="contact" className="max-w-7xl mx-auto px-6 sm:px-8 py-20 border-t border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5">
            <span className="text-blue-400 font-mono text-xs uppercase tracking-widest font-semibold block mb-2">Direct Channel</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">
              Let&apos;s Build Resilient Infrastructure
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8 text-sm">
              Currently available for full-time Linux System Administrator roles, Cloud/DevOps engineering positions, or infrastructure consulting contracts. Fast response time guaranteed.
            </p>

            <div className="space-y-4 mb-8 text-sm">
              <div className="flex items-center gap-3 text-slate-300 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">PRIMARY EMAIL</span>
                  <a href="mailto:hello@hermas.id" className="text-white hover:text-blue-400 font-medium">
                    hello@hermas.id
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">PHONE &amp; WHATSAPP</span>
                  <a href="tel:085852484937" className="text-white hover:text-blue-400 font-medium">
                    +62 858-5248-4937
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">LOCATION</span>
                  <span className="text-white font-medium">Sidoarjo, Jawa Timur, Indonesia</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://linkedin.com/in/hermasbintang"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4 fill-current text-blue-400" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
                <span>LinkedIn Profile</span>
              </a>

              <a
                href="https://github.com/StHermas"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4 fill-current text-slate-300" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12" />
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Right Column: Contact & Inquiry Form */}
          <div className="lg:col-span-7 bg-[#0d1322] p-8 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-bold text-white mb-2">Send Direct Message</h3>
            <p className="text-slate-400 text-xs mb-6">
              Recruiters, hiring managers, and prospective collaborators are invited to submit requirements directly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-mono text-slate-400 mb-1">YOUR NAME</label>
                  <input
                    required
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#131b2e] border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="e.g. Hiring Manager"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-mono text-slate-400 mb-1">WORK EMAIL</label>
                  <input
                    required
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#131b2e] border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="recruiter@company.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-mono text-slate-400 mb-1">MESSAGE / ROLE DETAILS</label>
                <textarea
                  required
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full bg-[#131b2e] border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Share details regarding your opportunity or server requirements..."
                />
              </div>

              {status === "success" && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs">
                  Message delivered successfully! An auto-reply confirmation was also dispatched to your email.
                </div>
              )}
              {status === "error" && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
                  Transmission failed. Please reach out directly at hermasbintang@gmail.com.
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 text-sm cursor-pointer"
              >
                {isLoading ? "Transmitting..." : "Send Message"}
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-[#070b12] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-blue-400 font-bold">hermas.id</span>
            <span>&copy; {new Date().getFullYear()} Hermas Bintang Putra Kinanti. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#home" className="hover:text-blue-400 transition-colors">Back to Top &uarr;</a>
            <span>•</span>
            <button onClick={() => setIsResumeModalOpen(true)} className="hover:text-blue-400 transition-colors cursor-pointer">
              View Resume
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Resume / CV Modal (Recruiter Favorite) */}
      {isResumeModalOpen && (
        <div className="cv-modal-overlay fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="cv-modal-container bg-[#0f172a] border border-slate-700 w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150">

            {/* Modal Header */}
            <div className="cv-modal-header bg-[#1e293b] px-6 py-4 border-b border-slate-700 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Curriculum Vitae - Hermas Bintang Putra Kinanti</h3>
                <p className="text-xs text-blue-400 font-mono">Linux System Administrator &amp; Cloud Infrastructure</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg text-xs bg-slate-700 hover:bg-slate-600 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setIsResumeModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body: Complete Formatted Resume */}
            <div className="cv-modal-body p-6 sm:p-8 overflow-y-auto text-slate-300 text-sm space-y-6">

              {/* Header Info */}
              <div className="border-b border-slate-700 pb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">Hermas Bintang Putra Kinanti</h1>
                  <p className="text-blue-400 font-semibold text-base">Linux System Administrator</p>
                  <p className="text-xs text-slate-400 mt-1">Sidoarjo, Jawa Timur, Indonesia</p>
                </div>
                <div className="text-xs font-mono space-y-1 sm:text-right">
                  <p>Email: <a href="mailto:hermasbintang@gmail.com" className="text-blue-400">hermasbintang@gmail.com</a></p>
                  <p>Phone: <span className="text-white">085852484937</span></p>
                  <p>Website: <a href="https://hermas.id" className="text-blue-400">hermas.id</a></p>
                  <p>LinkedIn: <a href="https://linkedin.com/in/hermasbintang" target="_blank" rel="noopener noreferrer" className="text-blue-400">linkedin.com/in/hermasbintang</a></p>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-2">Professional Summary</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Linux System Administrator with experience in designing, deploying, and supporting production hosting infrastructure for both enterprise providers and independent hosting platforms. Skilled in Linux administration, cPanel/WHM, Plesk, DNS, email infrastructure, web servers, virtualization, and infrastructure monitoring. Proven ability to troubleshoot complex server and networking issues, optimize system performance, implement security best practices, and automate infrastructure operations while maintaining high service availability and customer satisfaction.
                </p>
              </div>

              {/* Work Experience */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-4">Work Experience</h4>

                <div className="space-y-6">
                  {/* Job 1 */}
                  <div className="border-l-2 border-slate-700 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-white text-base">Advanced Support</h5>
                        <p className="text-blue-400 text-xs">World Host Group - hosting.com</p>
                      </div>
                      <span className="text-xs font-mono text-slate-400">12/2025 - Present</span>
                    </div>
                    <ul className="list-disc list-inside text-xs space-y-1 text-slate-300 mt-2">
                      <li>Administered and hardened shared hosting, VPS, and dedicated Linux environments using WHM/cPanel, Plesk, and CloudLinux.</li>
                      <li>Delivered advanced technical support via WHMCS and Upmind, diagnosing complex issues under strict SLA targets.</li>
                      <li>Configured and optimized email infrastructure (Exim, SMTP, IMAP/POP3, DKIM, SPF, DMARC, MailChannels, PTR).</li>
                      <li>Managed DNS zones (BIND), nameserver delegation, and SSL/TLS deployment (Let&apos;s Encrypt, AutoSSL, 3rd party CAs).</li>
                      <li>Tuned Apache, LiteSpeed, PHP-FPM, MariaDB/MySQL, Redis, OPcache, and CloudLinux LVE to maximize uptime.</li>
                      <li>Implemented ModSecurity, CSF/LFD firewalls, investigated malware, and mitigated brute-force attacks.</li>
                      <li>Conducted root cause analysis (RCA), technical documentation, and cross-team server migrations.</li>
                    </ul>
                  </div>

                  {/* Job 2 */}
                  <div className="border-l-2 border-slate-700 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-white text-base">System Architecture</h5>
                        <p className="text-blue-400 text-xs">Terashost</p>
                      </div>
                      <span className="text-xs font-mono text-slate-400">02/2025 - Present</span>
                    </div>
                    <ul className="list-disc list-inside text-xs space-y-1 text-slate-300 mt-2">
                      <li>Designed, deployed, and maintain complete hosting infrastructure: compute, networking, storage, DNS, email, and billing.</li>
                      <li>Architected Enhance Control Panel multi-server clusters with high availability and resource isolation.</li>
                      <li>Provisioned virtualization &amp; Pterodactyl Panel for containerized game &amp; VPS workloads.</li>
                      <li>Engineered centralized identity and access management using OpenLDAP across multi-infrastructure components.</li>
                      <li>Built HA email (Postfix, Dovecot, Rspamd) and authoritative DNS with PowerDNS/BIND and DNSSEC.</li>
                      <li>Implemented Prometheus, Grafana, and Icinga2 for real-time alerting; automated service lifecycle with WHMCS APIs and Deployer.</li>
                    </ul>
                  </div>

                  {/* Job 3 */}
                  <div className="border-l-2 border-slate-700 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-white text-base">Live Chat Support</h5>
                        <p className="text-blue-400 text-xs">World Host Group - hosting.com</p>
                      </div>
                      <span className="text-xs font-mono text-slate-400">04/2024 - 12/2025</span>
                    </div>
                    <ul className="list-disc list-inside text-xs space-y-1 text-slate-300 mt-2">
                      <li>Delivered real-time technical support in English via Chatwoot and LiveChatInc for international clients.</li>
                      <li>Troubleshot front-end hosting and server issues across cPanel, WHM, Plesk, and SiteWorx.</li>
                      <li>Maintained a high Customer Satisfaction (CSAT) score of over 90%.</li>
                    </ul>
                  </div>

                  {/* Job 4 */}
                  <div className="border-l-2 border-slate-700 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-white text-base">Internship - Cloud Computing</h5>
                        <p className="text-blue-400 text-xs">Bangkit Academy by Google, Tokopedia GoTo, Traveloka</p>
                      </div>
                      <span className="text-xs font-mono text-slate-400">2025</span>
                    </div>
                    <ul className="list-disc list-inside text-xs space-y-1 text-slate-300 mt-2">
                      <li>Provisioned GCP resources (Compute Engine, Cloud Run, GKE, Cloud Storage, VPC, Cloud SQL).</li>
                      <li>Built and deployed containerized applications using Docker and Google Kubernetes Engine (GKE).</li>
                      <li>Implemented CI/CD pipelines via Google Cloud Build and GitHub; used Terraform (IaC) for infrastructure.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Technical Skills Table */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-2">Technical Skills &amp; Ratings</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-slate-800 rounded"><span className="text-slate-400 block">Server Admin:</span> <span className="font-semibold text-white">Expert</span></div>
                  <div className="p-2 bg-slate-800 rounded"><span className="text-slate-400 block">Operating Systems:</span> <span className="font-semibold text-white">Expert</span></div>
                  <div className="p-2 bg-slate-800 rounded"><span className="text-slate-400 block">Hosting &amp; Control Panels:</span> <span className="font-semibold text-white">Expert</span></div>
                  <div className="p-2 bg-slate-800 rounded"><span className="text-slate-400 block">Customer Support:</span> <span className="font-semibold text-white">Expert (&gt;90% CSAT)</span></div>
                  <div className="p-2 bg-slate-800 rounded"><span className="text-slate-400 block">Web Servers:</span> <span className="font-semibold text-white">Advanced</span></div>
                  <div className="p-2 bg-slate-800 rounded"><span className="text-slate-400 block">Email Infrastructure:</span> <span className="font-semibold text-white">Advanced</span></div>
                  <div className="p-2 bg-slate-800 rounded"><span className="text-slate-400 block">Virtualization &amp; Containers:</span> <span className="font-semibold text-white">Advanced</span></div>
                  <div className="p-2 bg-slate-800 rounded"><span className="text-slate-400 block">Identity &amp; Security:</span> <span className="font-semibold text-white">Intermediate</span></div>
                </div>
              </div>

              {/* Education & Certs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-2">Education</h4>
                  <p className="font-bold text-white text-xs">Major in Computer and Network Engineering</p>
                  <p className="text-slate-400 text-xs">SMK Negeri 1 Pungging (2019 - 2021)</p>
                  <p className="text-xs text-slate-400 mt-1">Lab Assistant in Computer Network Laboratory</p>
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-2">Certifications</h4>
                  <ul className="text-xs text-slate-300 space-y-1">
                    <li>• Google Cloud Skill Badges (GCSB)</li>
                    <li>• IT Security: Defense Against Digital Dark Arts (Coursera)</li>
                    <li>• Operating Systems and You: Becoming a Power User (Coursera)</li>
                    <li>• The Bits and Bytes of Computer Networking (Coursera)</li>
                    <li>• System Administration &amp; IT Infrastructure Services (Coursera)</li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="cv-modal-footer bg-[#1e293b] px-6 py-3 border-t border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setIsResumeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
              <a
                href="mailto:hermasbintang@gmail.com?subject=Job%20Opportunity%20Inquiry%20-%20Hermas%20Bintang"
                className="px-4 py-2 rounded-xl text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
              >
                Reach Out Directly
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
