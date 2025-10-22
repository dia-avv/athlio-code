import { useNavigate } from "react-router";

export default function Intro() {
  const navigate = useNavigate();

  function start() {
    localStorage.setItem("introSeen", "true");
    navigate(
      "/auth" /*{ replace: true } //this is to now allow user to go back to onboarding*/,
    );
  }

  return (
    <section className="min-h-dvh grid place-items-center p-8">
      <div className="max-w-xl space-y-4">
        <h1 className="text-4xl font-bold">Athlio</h1>
        <p className="opacity-80">
          Showcase your game. Get discovered. Connect with scouts and teams.
        </p>

        {/* design */}

        <button
          onClick={start}
          className="rounded-xl bg-black text-white px-5 py-3"
        >
          Get started
        </button>
      </div>
    </section>
  );
}
