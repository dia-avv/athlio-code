import "./PostTypePicer.css";
import PostTypeButton from "../../UI/PostTypeButton";
import PostIcon from "../../../assets/icons/post.svg?react";
import StatsIcon from "../../../assets/icons/stats.svg?react";
import ActivityIcon from "../../../assets/icons/activity.svg?react";
import EventIcon from "../../../assets/icons/event.svg?react";

export default function PostTypePicker({ onChoose }) {
  const types = [
    { key: "post", title: "Post", icon: PostIcon },
    {
      key: "match",
      title: "Manual Match",
      icon: StatsIcon,
    },
    {
      key: "activity",
      title: "Activity",
      icon: ActivityIcon,
    },
    {
      key: "event",
      title: "Event",
      icon: EventIcon,
    },
  ];

  return (
    <div className="post-type-picker">
      {types.map((t) => (
        <PostTypeButton
          key={t.key}
          title={t.title}
          icon={t.icon}
          onClick={() => onChoose?.(t.key)}
        />
      ))}
    </div>
  );
}
