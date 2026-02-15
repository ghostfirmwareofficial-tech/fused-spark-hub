import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

function randState() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function useEpicOAuth() {
  const [isConnecting, setIsConnecting] = useState(false);
  const popupRef = useRef<Window | null>(null);

  useEffect(() => {
    function onMsg(ev: MessageEvent) {
      if (ev.origin !== window.location.origin) return;
      const msg = ev.data as any;
      if (!msg || msg.type !== "epic-oauth-callback") return;

      const state = sessionStorage.getItem("epic_oauth_state");
      sessionStorage.removeItem("epic_oauth_state");

      if (popupRef.current && !popupRef.current.closed) popupRef.current.close();
      popupRef.current = null;

      if (msg.error) {
        setIsConnecting(false);
        toast.error("Epic connection failed", { description: String(msg.error) });
        return;
      }

      if (!msg.code) {
        setIsConnecting(false);
        toast.error("Epic connection failed", { description: "Missing authorization code" });
        return;
      }

      if (!state) {
        setIsConnecting(false);
        toast.error("Epic connection failed", { description: "Missing state" });
        return;
      }

      void (async () => {
        try {
          const redirectUri = `${window.location.origin}/epic-callback`;
          const resp = await fetch("/api/epic/exchange", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ code: msg.code, redirectUri }),
          });
          const data = await resp.json().catch(() => ({}));
          if (!resp.ok || !data?.ok) {
            throw new Error(data?.error || "Epic exchange failed");
          }

          const user = data.user || {};
          const displayName = String(user.displayName || user.preferred_username || "").trim();
          const accountId = String(user.accountId || user.sub || "").trim();

          if (!displayName && !accountId) {
            throw new Error("Epic user info missing (no displayName/accountId)");
          }

          const session = await supabase.auth.getSession();
          if (!session.data.session) throw new Error("Not logged in");

          const epicValue = displayName || accountId;

          const { error } = await supabase
            .from("profiles")
            .update({ epic_games_id: epicValue })
            .eq("user_id", session.data.session.user.id);

          if (error) throw error;

          toast.success("Epic Games connected", { description: epicValue });
        } catch (e: any) {
          toast.error("Epic connection failed", { description: e?.message || "error" });
        } finally {
          setIsConnecting(false);
        }
      })();
    }

    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const connectEpic = useCallback(() => {
    const clientId = (import.meta as any).env?.VITE_EPIC_CLIENT_ID as string | undefined;
    if (!clientId) {
      toast.error("Epic OAuth not configured", {
        description: "Missing VITE_EPIC_CLIENT_ID. Add it in Netlify env and redeploy.",
      });
      return;
    }

    const state = randState();
    sessionStorage.setItem("epic_oauth_state", state);

    const redirectUri = `${window.location.origin}/epic-callback`;
    const scope = "basic_profile";

    const authUrl = new URL("https://www.epicgames.com/id/authorize");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", scope);
    authUrl.searchParams.set("state", state);

    setIsConnecting(true);

    const w = 520;
    const h = 720;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;

    popupRef.current = window.open(
      authUrl.toString(),
      "epic-oauth",
      `width=${w},height=${h},left=${left},top=${top}`
    );

    if (!popupRef.current) {
      setIsConnecting(false);
      toast.error("Popup blocked", { description: "Allow popups to connect Epic Games." });
    }
  }, []);

  return { connectEpic, isConnecting };
}
