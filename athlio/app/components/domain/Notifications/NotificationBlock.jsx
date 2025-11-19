import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useUser } from "../../../context/UserContext";
import NotificationCard from "./NotificationCard";
import { useLocation } from "react-router";

export default function NotificationsPage() {
  const { profile, setCounts } = useUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (!profile?.id) return;

    let cancelled = false;

    async function load() {
      setLoading(true);

      // 1) Load notification list
      const { data, error } = await supabase
        .from("notifications")
        .select(
          `
          id,
          type,
          created_at,
          read_at,
          post:post_id (
            id
          ),
          actor:actor_id (
            id,
            full_name,
            username,
            avatar_url
          )
        `,
        )
        .eq("recipient_id", profile.id)
        .order("created_at", { ascending: false });

      if (!cancelled) {
        if (error) {
          console.error("notifications list error", error);
          setItems([]);
        } else {
          setItems(data || []);
        }
        setLoading(false);
      }

      // 2) Mark all unread as read
      const nowIso = new Date().toISOString();
      const { error: updateError } = await supabase
        .from("notifications")
        .update({ read_at: nowIso })
        .eq("recipient_id", profile.id)
        .is("read_at", null);

      if (updateError) {
        console.error("notifications read update error", updateError);
      }

      // 3) Locally set notifications count to 0 so the topbar badge disappears
      setCounts((prev) => ({
        ...prev,
        notifications: 0,
      }));
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [profile?.id, location.key]);

  if (loading) {
    return <div className="notifications-page">Loading...</div>;
  }

  if (!items.length) {
    return (
      <div className="notifications-page notifications-empty">
        No notifications yet.
      </div>
    );
  }

  return (
    <div className="notifications-page">
      {items.map((n) => (
        <NotificationCard key={n.id} notif={n} />
      ))}
    </div>
  );
}
