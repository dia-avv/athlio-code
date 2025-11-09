import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const { SUPABASE_URL, SUPABASE_SERVICE_KEY, API_SPORTS_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY)
  throw new Error("Missing Supabase environment variables.");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// --- ISO2 helper ---
const ISO2 = {
  spain: "ES",
  germany: "DE",
  france: "FR",
  italy: "IT",
  england: "GB",
  "united kingdom": "GB",
  uk: "GB",
  usa: "US",
  us: "US",
  "united states": "US",
  "united states of america": "US",
  romania: "RO",
};

function toISO2(name) {
  if (!name) return null;
  const key = String(name).toLowerCase().replace(/[.,]/g, "").trim();
  return ISO2[key] ?? null;
}

// --- SPORTS CONFIG ---
const SPORTS = [
  {
    name: "football",
    countries: ["France"],
    async fetchTeams() {
      const teams = [];
      for (const country of this.countries) {
        const { data } = await axios.get(
          `https://v3.football.api-sports.io/teams?country=${country}`,
          { headers: { "x-apisports-key": API_SPORTS_KEY } },
        );
        teams.push(...(data?.response || []));
      }
      return teams.map((row) => ({
        name: row?.team?.name ?? null,
        city: row?.venue?.city ?? null,
        country: row?.team?.country ?? null,
        country_code: toISO2(row?.team?.country),
        logo_url: row?.team?.logo ?? null,
        sport: "football",
      }));
    },
  },
  {
    name: "basketball",
    async fetchTeams() {
      const leagues = [
        { id: 12, name: "NBA", country: "USA" },
        { id: 117, name: "LNB Pro A", country: "France" },
        { id: 120, name: "Liga ACB", country: "Spain" },
      ];

      const allTeams = [];
      for (const league of leagues) {
        console.log(
          `[basketball] fetching ${league.name} (${league.country})...`,
        );
        try {
          const { data } = await axios.get(
            "https://v1.basketball.api-sports.io/teams",
            {
              headers: { "x-apisports-key": API_SPORTS_KEY },
              params: { league: league.id, season: 2023 }, // ← 2023 season works better for v1
            },
          );

          const teams = data?.response || [];
          console.log(
            `[basketball] ${league.name}: ${teams.length} teams found`,
          );

          for (const team of teams) {
            let city = team?.city ?? null;
            if (!city && team?.id) {
              try {
                const venueRes = await axios.get(
                  "https://v1.basketball.api-sports.io/venues",
                  {
                    headers: { "x-apisports-key": API_SPORTS_KEY },
                    params: { team: team.id },
                  },
                );
                city = venueRes?.data?.response?.[0]?.city ?? null;
              } catch {
                city = null;
              }
            }

            allTeams.push({
              name: team?.name ?? null,
              city,
              country: league.country,
              country_code: toISO2(league.country),
              logo_url: team?.logo ?? null,
              sport: "basketball",
            });

            // chill a sec to avoid 429s
            await new Promise((res) => setTimeout(res, 1000));
          }
        } catch (err) {
          console.warn(`[basketball] ${league.name} failed:`, err.message);
        }
      }

      return allTeams;
    },
  },
];

// --- SEED FUNCTION ---
async function seedClubs() {
  for (const sport of SPORTS) {
    try {
      const rows = await sport.fetchTeams();
      if (!Array.isArray(rows) || !rows.length) {
        console.warn(`No ${sport.name} teams found`);
        continue;
      }

      // Normalize + filter
      const clean = rows
        .filter((c) => typeof c?.name === "string" && c.name.trim() !== "")
        .map((c) => ({
          ...c,
          name: String(c.name).trim(),
          country:
            typeof c.country === "string"
              ? c.country.trim()
              : String(c.country || ""),
          country_code: c.country_code
            ? String(c.country_code).toUpperCase()
            : null,
        }));

      // De-duplicate safely
      const seen = new Map();
      const deduped = clean.filter((c) => {
        const sportKey = String(c.sport || "").toLowerCase();
        const nameKey =
          typeof c.name === "string"
            ? c.name.toLowerCase()
            : String(c.name || "");
        const countryKey =
          typeof c.country === "string"
            ? c.country.toLowerCase()
            : String(c.country || "");
        const key = `${sportKey}|${nameKey}|${countryKey}`;
        if (!nameKey || seen.has(key)) return false;
        seen.set(key, true);
        return true;
      });

      console.log(`Preparing to insert ${deduped.length} ${sport.name} clubs`);

      const { error } = await supabase
        .from("clubs")
        .upsert(deduped, { onConflict: "sport,name,country" });

      if (error) console.error(`Error inserting ${sport.name}:`, error);
      else console.log(`Inserted ${deduped.length} ${sport.name} clubs!`);
    } catch (err) {
      console.error(`Failed to fetch ${sport.name}:`, err.message);
    }
  }
}

seedClubs();
