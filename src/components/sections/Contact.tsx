import { site } from "@/content/site";
import { AccentHeading } from "@/components/ui/AccentHeading";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { SocialBlobs } from "@/components/ui/SocialBlobs";
import { ContactForm } from "./ContactForm";

// The single home for every link on the site: email (with copy) and the four socials.
export function Contact({ n }: { n: string }) {
  return (
    <section id="contact" aria-labelledby="contact-h" className="shell py-20 md:py-32">
      <AccentHeading n={n} label="Contact" id="contact-h" before="Have something" accent="worth" after="building?" display />
      <div className="page-grid mt-16">
        <div className="col-span-4 md:col-span-6 md:col-start-3">
          <ContactForm />
        </div>
      </div>

      <div className="page-grid mt-16 gap-y-6 border-t pt-8">
        <p className="label col-span-4 md:col-span-2">Or directly</p>
        <div className="col-span-4 flex flex-wrap items-center justify-between gap-x-10 gap-y-8 md:col-span-10">
          <CopyEmail email={site.email} />
          <SocialBlobs />
        </div>
      </div>
    </section>
  );
}
