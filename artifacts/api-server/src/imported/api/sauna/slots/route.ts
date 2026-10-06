import type { JsonRequest as Request } from "@/native-request";
import { migrationLogger as log } from "@/migration-logger";
import {
  getBookableDates,
  getSaunaConfig,
  getSessionsForDate,
} from "@/imported/lib/store/booking";
import { SAUNA_TICKETS, type TicketType } from "@/imported/lib/cms/sauna";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date");
  const month = url.searchParams.get("month"); // YYYY-MM
  const ticket = (url.searchParams.get("ticket") ?? "sauna_plunge") as TicketType;

  if (!(ticket in SAUNA_TICKETS)) {
    return Response.json({ error: "Unknown ticket type." }, { status: 400 });
  }

  try {
    const config = await getSaunaConfig();

    if (date) {
      const { saunaDay, sessions } = await getSessionsForDate(date, config);
      const def = SAUNA_TICKETS[ticket];
      const visible = sessions.filter((s) =>
        def.kind === "single" ? def.needsSauna === false || s.saunaAvailable : true
      );
      return Response.json({
        date,
        saunaDay,
        pricePence: config.prices[ticket],
        sessions: visible.map((s) => ({
          time: s.time,
          capacity: s.capacity,
          available: s.available,
          saunaAvailable: s.saunaAvailable,
        })),
      });
    }

    if (month) {
      const [y, m] = month.split("-").map(Number);
      if (!y || !m || m < 1 || m > 12) {
        return Response.json({ error: "Invalid month." }, { status: 400 });
      }
      const dates = getBookableDates(y, m - 1, config, ticket);
      return Response.json({ month, ticket, dates });
    }

    return Response.json({ error: "Provide date or month." }, { status: 400 });
  } catch (err) {
    log.error("[slots] availability fetch failed", err);
    return Response.json(
      { error: "Booking service is starting up. Please try again in a moment." },
      { status: 503 }
    );
  }
}
