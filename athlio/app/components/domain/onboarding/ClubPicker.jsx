import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../lib/supabase.js";
import TextInput from "../../inputs/TextInput";

export default function ClubPicker({ sport, value, onChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [useOther, setUseOther] = useState(Boolean(value?.club_other_name));
  const deb = useRef();

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    if (deb.current) clearTimeout(deb.current);

    deb.current = setTimeout(async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select("id, name, city, country_code")
        .eq("sport", sport)
        .ilike("name", `%${query}%`)
        .limit(15);

      if (!error) setResults(data || []);
    }, 250);
  }, [query, sport]);

  function pickClub(id) {
    setUseOther(false);
    onChange({ club_id: id, club_other_name: null });
  }

  function chooseOther() {
    setUseOther(true);
    onChange({ club_id: null, club_other_name: "" });
  }

  async function addNewClub(name) {
    const clean = (name || "").trim();
    if (!clean) return;

    const { data, error } = await supabase
      .from("clubs")
      .insert([{ name: clean, sport }])
      .select("id")
      .single();

    if (!error && data) {
      onChange({ club_id: data.id, club_other_name: null });
      setUseOther(false);
    }
  }

  // --- Render ---
  return (
    <div>
      <TextInput placeholder="Search club" value={query} onChange={setQuery} />

      <ul>
        {results.map((c) => (
          <li key={c.id}>
            <button type="button" onClick={() => pickClub(c.id)}>
              {c.name}
              {c.city ? ` (${c.city})` : ""}
            </button>
          </li>
        ))}
        <li>
          <button type="button" onClick={chooseOther}>
            Other (not listed)
          </button>
        </li>
      </ul>

      {useOther && (
        <div>
          <TextInput
            placeholder="Enter club name"
            value={value?.club_other_name || ""}
            onChange={(v) => onChange({ club_id: null, club_other_name: v })}
          />
          <button
            type="button"
            onClick={() => addNewClub(value?.club_other_name)}
          >
            Add new club
          </button>
        </div>
      )}
    </div>
  );
}
