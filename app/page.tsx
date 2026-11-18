import PortfolioClient from "@/components/PortfolioClient";

export default function Home() {
  const turnstileSiteKey =
    process.env.TURNSTILE_SITE_KEY ??
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ??
    "";

  return <PortfolioClient turnstileSiteKey={turnstileSiteKey} />;
}
