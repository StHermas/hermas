import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hermas Bintang | Linux System Administrator & Cloud Infrastructure Engineer",
  description: "Portfolio of Hermas Bintang Putra Kinanti - Linux System Administrator specializing in production hosting infrastructure, cPanel/WHM, Plesk, Enhance Control Panel, DNS, email deliverability, and Google Cloud Platform (GCP).",
  keywords: [
    "Hermas Bintang",
    "Linux System Administrator",
    "Cloud Infrastructure Engineer",
    "DevOps",
    "WHM/cPanel",
    "Plesk",
    "Enhance Control Panel",
    "Email Infrastructure",
    "DNSSEC",
    "GCP",
    "Google Cloud",
    "Kubernetes",
    "Sidoarjo",
    "Indonesia"
  ],
  authors: [{ name: "Hermas Bintang Putra Kinanti" }],
  openGraph: {
    title: "Hermas Bintang | Linux System Administrator & Cloud Infrastructure Engineer",
    description: "Experienced in designing, deploying, and supporting enterprise Linux hosting environments, multi-server clusters, and cloud infrastructure.",
    url: "https://hermas.id",
    siteName: "Hermas Bintang - Portfolio",
    locale: "en_US",
    type: "website",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hermas Bintang Putra Kinanti",
  url: "https://hermas.id",
  jobTitle: "Linux System Administrator",
  worksFor: [
    {
      "@type": "Organization",
      name: "World Host Group - hosting.com",
    },
    {
      "@type": "Organization",
      name: "Terashost",
    },
  ],
  sameAs: [
    "https://linkedin.com/in/hermasbintang",
    "https://github.com/StHermas",
    "https://www.skills.google/public_profiles/968ea3c6-53b5-4f68-b585-9445ba3bf76c",
  ],
  knowsAbout: [
    "Linux Administration",
    "WHM/cPanel",
    "Plesk",
    "Enhance Control Panel",
    "Email Infrastructure",
    "DNS & DNSSEC",
    "Google Cloud Platform (GCP)",
    "Kubernetes",
    "Docker",
    "Terraform",
    "System Architecture",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sidoarjo",
    addressRegion: "Jawa Timur",
    addressCountry: "ID",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
