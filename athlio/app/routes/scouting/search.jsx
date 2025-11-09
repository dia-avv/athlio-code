import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import SearchBar from '../../components/UI/SearchBar';
import SearchBarCard from '../../components/domain/Scouting/SearchBarCard';
import { useNavigate } from 'react-router';

const RECENTS_KEY = 'recentProfileSearches';

function loadRecents() {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    const arr = JSON.parse(raw || '[]');
    if (Array.isArray(arr)) return arr.filter(Boolean);
  } catch {}
  return [];
}

function saveRecent(id) {
  try {
    const current = loadRecents();
    const next = [id, ...current.filter((x) => x !== id)].slice(0, 10);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  } catch {}
}

export default function ScoutingSearch() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recents, setRecents] = useState(() => loadRecents());
  const [suggested, setSuggested] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let cancel = false;
    async function run() {
      const term = q.trim();
      if (term.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .ilike('full_name', `%${term}%`)
        .limit(20);
      if (cancel) return;
      if (error) {
        console.error('search profiles', error);
        setResults([]);
      } else {
        setResults(data || []);
      }
      setLoading(false);
    }
    run();
    return () => {
      cancel = true;
    };
  }, [q]);

  // When there are no recents and no query, show suggested profiles
  useEffect(() => {
    let cancel = false;
    async function loadSuggested() {
      if (q.trim() !== '' || recents.length > 0) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .order('created_at', { ascending: false })
        .limit(10);
      if (cancel) return;
      if (error) {
        console.error('load suggested profiles', error);
        setSuggested([]);
      } else {
        setSuggested(data || []);
      }
    }
    loadSuggested();
    return () => {
      cancel = true;
    };
  }, [q, recents.length]);

  function pick(id) {
    saveRecent(id);
    setRecents(loadRecents());
    navigate(`/scouting?add=${encodeURIComponent(id)}`);
  }

  return (
    <main style={{ paddingTop: 64, padding: 16, maxWidth: 720, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 12 }}>Add a player</h2>
      <div style={{ marginBottom: 16 }}>
        <SearchBar label="Search profiles" onClick={() => {}} onClear={() => setQ('')} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type at least 2 characters…"
          style={{
            width: '100%',
            marginTop: 8,
            padding: '10px 12px',
            border: '1px solid var(--color-gray-300)',
            borderRadius: 8,
            fontSize: 14,
          }}
        />
      </div>

      {loading && <p>Searching…</p>}

      {!loading && results.length > 0 && (
        <section>
          <h3 style={{ fontSize: 14, margin: '8px 0' }}>Results</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {results.map((r) => (
              <SearchBarCard key={r.id} profileId={r.id} onSelect={pick} />
            ))}
          </div>
        </section>
      )}

      {!loading && results.length === 0 && (
        <section>
          <h3 style={{ fontSize: 14, margin: '8px 0' }}>Recent profiles</h3>
          {recents.length > 0 && (
            <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
              {recents.map((id) => (
                <SearchBarCard key={id} profileId={id} onSelect={pick} />
              ))}
            </div>
          )}

          {recents.length === 0 && (
            <>
              <p style={{ color: 'var(--color-gray-700)', marginBottom: 8 }}>
                No recent profiles. Try searching above, or pick a suggestion:
              </p>
              <div style={{ display: 'grid', gap: 8 }}>
                {suggested.length > 0 ? (
                  suggested.map((p) => (
                    <SearchBarCard key={p.id} profileId={p.id} onSelect={pick} />
                  ))
                ) : (
                  <p style={{ color: 'var(--color-gray-700)' }}>No profiles yet.</p>
                )}
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}
