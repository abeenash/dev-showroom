// Source: docs/FACTS.md → Recognition (verified from certificates). Years are AD conversions of BS dates.
import bizbuzzCert from "../../public/certs/bizbuzz-2026.jpg";
import growthForumCert from "../../public/certs/growth-forum-nepal.jpg";
import iccrCert from "../../public/certs/iccr-2026.jpg";
import workshopCert from "../../public/certs/steam-paper-writing-workshop.jpg";
import bim1Cert from "../../public/certs/tu-topper-bim-1st-sem.jpg";
import bim3Cert from "../../public/certs/tu-2nd-topper-bim-3rd-sem.jpg";
import bim6Cert from "../../public/certs/tu-2nd-topper-bim-6th-sem.jpg";
import bizbuzzPhoto from "../../public/photos/bizbuzz-trophy.jpg";
import felicitationCert from "../../public/photos/felicitation-certificate.jpg";
import felicitationTika from "../../public/photos/felicitation-tika.jpg";
import growthForumStage from "../../public/photos/growth-forum-stage.jpg";
import bim1Poster from "../../public/photos/poster-bim-1st-sem.jpg";
import bim5Poster from "../../public/photos/poster-bim-5th-sem.jpg";
import type { AwardGroup } from "./types";

export const recognition: AwardGroup[] = [
  {
    name: "Academics",
    awards: [
      {
        year: "2023",
        title: "Tribhuvan University topper",
        detail: "BIM 1st semester · SGPA 4.0",
        images: [
          { src: bim1Cert, alt: "Orchid International College certificate: University topper, SGPA 4, BIM I Semester result" },
          { src: bim1Poster, alt: "College poster congratulating Abinash Adhikari as TU topper, BIM 1st semester, SGPA 4.0" },
          { src: felicitationCert, alt: "Abinash receiving the certificate of achievement from college staff" },
          { src: felicitationTika, alt: "Abinash receiving tika at the felicitation for the TU topper result" },
        ],
      },
      {
        year: "2024",
        title: "TU 2nd topper",
        detail: "BIM 3rd semester · SGPA 3.98",
        images: [{ src: bim3Cert, alt: "Framed certificate: TU 2nd topper, SGPA 3.98, BIM 3rd semester" }],
      },
      {
        title: "Topper",
        detail: "BIM 5th semester · SGPA 3.97",
        images: [{ src: bim5Poster, alt: "College poster: Congratulations topper, SGPA 3.97, BIM 5th semester" }],
      },
      {
        year: "2026",
        title: "TU 2nd topper",
        detail: "BIM 6th semester · SGPA 3.97",
        images: [{ src: bim6Cert, alt: "Certificate: TU second topper, 3.97, BIM sixth semester" }],
      },
    ],
  },
  {
    name: "Competitions",
    awards: [
      {
        year: "2026",
        title: "2nd Runner-Up, BizBuzz 2026",
        detail: "With Orchid International College's team, at Kathford International College · Rs. 10,000 prize",
        images: [
          { src: bizbuzzCert, alt: "Certificate of achievement: 2nd Runner Up, BizBuzz 2026" },
          { src: bizbuzzPhoto, alt: "Abinash holding the BizBuzz trophy and the ceremonial prize cheque" },
        ],
      },
    ],
  },
  {
    name: "Research",
    // Abinash's own words (FACTS → Recognition).
    caption: "Being a developer takes research too.",
    awards: [
      {
        year: "2026",
        title: "Presented a case paper at Growth Forum Nepal",
        detail: "International conference on economic growth, Embark College · 8 May 2026, Hotel Himalaya, Lalitpur",
        images: [
          { src: growthForumCert, alt: "Certificate of presentation: case paper at Growth Forum Nepal, 8 May 2026" },
          { src: growthForumStage, alt: "Abinash presenting a market analysis slide on stage at Growth Forum Nepal" },
        ],
      },
      {
        year: "2026",
        title: "International Conference on Contemporary Research",
        detail: "ICCR-2026, participant · STEAM Research Centre · 16 May 2026, Southwestern State College, Kathmandu",
        images: [{ src: iccrCert, alt: "Certificate of participation: International Conference on Contemporary Research 2026" }],
      },
      {
        year: "2026",
        title: "Workshop on scientific paper writing",
        detail: "Participant · STEAM Research Centre · 11 April 2026, Embark College, Lalitpur",
        images: [
          { src: workshopCert, alt: "Certificate of participation: Capacity Building Workshop on Scientific Paper Writing for Researchers" },
        ],
      },
    ],
  },
];
