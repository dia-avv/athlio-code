import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import CardInfoSingle from "../../../UI/InfoCards";
import EditIcon from "../../../../assets/icons/edit.svg?react";
import Button from "../../../UI/Button";
import "./InfoTab.css";
import ExperienceList from "../../Scouting/ExperienceList";

export default function InfoTab({ profile, isMe = false }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;

    async function fetchExperiences() {
      setLoading(true);

      const { data, error } = await supabase
        .from("experiences") // 👈 your table name (adjust if different)
        .select(
          "team_name, org_name, logo_url, start_date, end_date, is_current",
        )
        .eq("profile_id", profile.id)
        .order("start_date", { ascending: false });

      if (error) {
        console.error("Error fetching experiences:", error);
      } else {
        setExperiences(data || []);
      }

      setLoading(false);
    }

    fetchExperiences();
  }, [profile?.id]);

  const playersWithExperiences = [
    {
      id: profile.id,
      experiences: experiences || [],
    },
  ];

  return (
    <main>
      <div className="profile-info-tab">
        {/* === Header with edit button === */}
        <div className="info-tab-header">
          {isMe && (
            <Button
              size="medium"
              type="outline"
              Icon={EditIcon}
              className="edit-info-btn"
              onClick={() => (window.location.href = "/edit-profile")}
            />
          )}
        </div>

        {/* === Info cards === */}
        <CardInfoSingle profile={profile} />

        {/* === Experiences section === */}
        <section className="info-experience-section">
          <h3 className="info-section-title">Career history</h3>
          {loading ? (
            <p>Loading experience...</p>
          ) : (
            <ExperienceList players={playersWithExperiences} />
          )}
        </section>
      </div>
    </main>
  );
}
