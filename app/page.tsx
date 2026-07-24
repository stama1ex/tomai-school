import { HeroSection } from '@/components/home/hero-section';
import { ContactBar } from '@/components/home/contact-bar';
import { StatsStrip } from '@/components/home/stats-strip';
import { QuickLinks } from '@/components/home/quick-links';
import { AnnouncementsSection } from '@/components/home/announcements-section';
import { getSiteSettings } from '@/lib/settings';

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <>
      <HeroSection />
      <ContactBar settings={settings} />
      <StatsStrip settings={settings} />
      <QuickLinks />
      <AnnouncementsSection />
    </>
  );
}
