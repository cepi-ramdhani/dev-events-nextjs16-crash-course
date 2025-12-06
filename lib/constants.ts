export type Event = {
  title: string;
  image: string;
  location: string;
  date: string;
  time: string;
  slug: string;
  url: string;
};

export const events: Event[] = [
  {
    title: "React Summit 2025",
    image: "/images/event1.png",
    location: "Amsterdam, NL",
    date: "2025-06-13",
    time: "09:00-17:00 CET",
    slug: "react-summit-2025",
    url: "https://reactsummit.com/",
  },
  {
    title: "Next.js Conf",
    image: "/images/event2.png",
    location: "San Francisco, USA",
    date: "2025-10-15",
    time: "10:00-18:00 PT",
    slug: "nextjs-conf-2025",
    url: "https://nextjs.org/conf",
  },
  {
    title: "Google I/O Extended",
    image: "/images/event3.png",
    location: "Online + Local Hubs",
    date: "2025-05-14",
    time: "09:30-16:30 PT",
    slug: "google-io-extended-2025",
    url: "https://io.google/2025/",
  },
  {
    title: "ETHGlobal Hackathon",
    image: "/images/event4.png",
    location: "Singapore, SG",
    date: "2025-08-09",
    time: "48-hour hackathon",
    slug: "ethglobal-hackathon-2025",
    url: "https://ethglobal.com/events",
  },
  {
    title: "JSNation Live",
    image: "/images/event5.png",
    location: "Online",
    date: "2025-04-24",
    time: "14:00-21:00 CET",
    slug: "jsnation-live-2025",
    url: "https://jsnation.com/",
  },
  {
    title: "HackMIT",
    image: "/images/event6.png",
    location: "Cambridge, USA",
    date: "2025-09-27",
    time: "36-hour hackathon",
    slug: "hackmit-2025",
    url: "https://hackmit.org/",
  },
];
