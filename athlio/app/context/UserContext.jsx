import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); //supabase user object (id, email, etc)
  const [profile, setProfile] = useState(null); //the profile row with extra info
  const [loading, setLoading] = useState(true); //loading state while fetching the data

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data?.session?.user || null;
      setUser(currentUser);
      if (currentUser) fetchProfile(currentUser.id);
      else setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (currentUser) fetchProfile(currentUser.id);
        else {
          setProfile(null);
          setLoading(false);
        }
      },
    );

    //when app is closed, stop listening to auth changes
    return () => listener.subscription.unsubscribe();
  }, []);

  const [club, setClub] = useState(null);

  async function fetchProfile(uid) {
    const { data } = await supabase
      .from("profiles")
      .select("*, club:club_id (id, name, logo_url")
      .eq("id", uid)
      .maybeSingle();
    setProfile(data);
    setClub(data?.club || null);
    setLoading(false);
  }

  return (
    <UserContext.Provider value={{ user, profile, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
