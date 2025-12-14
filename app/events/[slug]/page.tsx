import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import { IEvent } from "@/database";
import EventCard from "@/components/EventCard";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems = [] }: { agendaItems?: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => {
        const [timeRaw, titleRaw] = item.split("|").map((s) => s.trim());
        const time = timeRaw ?? "";
        const title = titleRaw ?? item;
        return (
          <li key={item} className="agenda-item">
            <div className="agenda-time">{time}</div>
            <div className="agenda-title">{title}</div>
          </li>
        );
      })}
    </ul>
  </div>
);

const EventTags = ({ tags = [] }: { tags?: string[] }) => (
  <div className="flex flex-row gap-2 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>
        {tag}
      </div>
    ))}
  </div>
);

const EventDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  "use cache";
  cacheLife("hours");
  const { slug } = await params;

  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  const { event } = await request.json();

  const {
    title,
    description,
    image,
    overview,
    date,
    time,
    venue,
    location,
    mode,
    agenda,
    audience,
    tags,
    organizer,
  } = event;

  if (!description) return notFound();

  const bookings = 10;

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  //console.log({similarEvents})

  return (
    <section id="event">
      <div className="header">
        <h1>{title}</h1>

        <div className="flex-row-gap-2 items-center">
          <EventDetailItem
            icon="/icons/calendar.svg"
            alt="Calendar"
            label={date}
          />
          <EventDetailItem icon="/icons/clock.svg" alt="Clock" label={time} />
          <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
          <EventDetailItem icon="/icons/mode.svg" alt="Mode" label={mode} />
        </div>

        <section className="flex-col-gap-2 mt-4">
          <h2>Description</h2>
          <p className="mt-2 ">{description}</p>
        </section>
        <div className="mt-4">
          <EventTags tags={tags} />
        </div>
      </div>

      <div className="details">
        {/* Left Side - Event content */}
        <div className="content">
          <Image
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="Calendar"
              label={date}
            />
            <EventDetailItem icon="/icons/clock.svg" alt="Clock" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="Mode" label={mode} />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="Audience"
              label={audience}
            />
          </section>

          <EventAgenda agendaItems={agenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>

        {/* Right Side - Booking Form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot! </p>
            )}
            <BookEvent eventId={event._id} slug={event.slug} />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 &&
            similarEvents.map((similarEvent: IEvent) => (
              <EventCard
                key={similarEvent.slug}
                {...similarEvent}
                imageWidth={800}
                imageHeight={800}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetailPage;
