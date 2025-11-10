import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); //supabase user object (id, email, etc)
  const [profile, setProfile] = useState(null); //the profile row with extra info
  const [counts, setCounts] = useState({ messages: 0, notifications: 0 }); //counts of unread messages/notifications
  const [loading, setLoading] = useState(true); //loading state while fetching the data

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data?.session?.user || null;
      setUser(currentUser);
      if (currentUser) fetchProfileAndCounts(currentUser.id);
      else setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (currentUser) fetchProfileAndCounts(currentUser.id);
        else {
          setProfile(null);
          setCounts({ messages: 0, notifications: 0 });
          setLoading(false);
        }
      },
    );

    //when app is closed, stop listening to auth changes
    return () => listener.subscription.unsubscribe();
  }, []);

  const [club, setClub] = useState(null);

  // Derive role and permissions from the loaded profile. We accept multiple possible column names.
  const roleValue = (
    profile?.role ||
    profile?.account_type ||
    profile?.type ||
    ""
  )
    .toString()
    .toLowerCase();
  const isScout = roleValue === "scout";

  // Centralized permissions used across the app
  const permissions = {
    canPostBasic: true,
    canPostEvent: true,
    canPostMatch: !isScout,
    canPostActivity: !isScout,
  };

  // Small helper so UI can quickly check
  function canPost(kind) {
    switch ((kind || "").toString().toLowerCase()) {
      case "post":
      case "basic":
        return permissions.canPostBasic;
      case "event":
        return permissions.canPostEvent;
      case "match":
        return permissions.canPostMatch;
      case "activity":
        return permissions.canPostActivity;
      default:
        return false;
    }
  }

  async function fetchProfileAndCounts(uid) {
    const { data } = await supabase
      .from("profiles")
      .select("*, club:club_id (id, name, logo_url)")
      .eq("id", uid)
      .maybeSingle();
    setProfile(data);
    setClub(data?.club || null);
    setLoading(false);
  }

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        counts,
        setCounts,
        loading,
        role: roleValue,
        isScout,
        permissions,
        canPost,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
