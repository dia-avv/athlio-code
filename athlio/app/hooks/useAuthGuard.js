import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";

export function useAuthGuard() {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) navigate("/auth" /*{ replace: true }*/);
    })();
  }, [navigate]);
}
