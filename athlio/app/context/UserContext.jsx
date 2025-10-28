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

  async function fetchProfileAndCounts(uid) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", uid) //filter by user id (where id===uid)
      .maybeSingle();
    setProfile(data);
    setLoading(false);

    await fetchCounts(uid);
    subscribeToChanges(uid);
    setLoading(false);
  }

  async function fetchCounts(uid) {
    const { count: msgCount } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("receiver_id", uid)
      .eq("read", false);

    const { count: notifCount } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", uid)
      .eq("read", false);

    setCounts({
      messages: msgCount || 0,
      notifications: notifCount || 0,
    });
  }

  // live updates
  function subscribeToChanges(uid) {
    const msgSub = supabase
      .channel("messages-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          if (
            payload.new?.receiver_id === uid ||
            payload.old?.receiver_id === uid
          ) {
            fetchCounts(uid);
          }
        },
      )
      .subscribe();

    const notifSub = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        (payload) => {
          if (payload.new?.user_id === uid || payload.old?.user_id === uid) {
            fetchCounts(uid);
          }
        },
      )
      .subscribe();

    // cleanup
    return () => {
      supabase.removeChannel(msgSub);
      supabase.removeChannel(notifSub);
    };
  }
  return (
    <UserContext.Provider value={{ user, profile, counts, setCounts, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
