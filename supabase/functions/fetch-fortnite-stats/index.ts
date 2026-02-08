import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FortniteStats {
  account: {
    name: string;
    id?: string;
  };
  battlePass?: {
    level: number;
    progress: number;
  } | null;
  stats: {
    all: {
      overall: {
        wins: number;
        kills: number;
        deaths: number;
        kd: number;
        matches: number;
        winRate: number;
        minutesPlayed: number;
        top5: number;
        top10: number;
        top25: number;
      } | null;
      solo?: {
        wins: number;
        kills: number;
        kd: number;
        matches: number;
      } | null;
      duo?: {
        wins: number;
        kills: number;
        kd: number;
        matches: number;
      } | null;
      squad?: {
        wins: number;
        kills: number;
        kd: number;
        matches: number;
      } | null;
    };
  };
}

async function fetchFortniteStats(username: string): Promise<FortniteStats> {
  // Validate username format (basic sanitization)
  const sanitizedUsername = username.trim().slice(0, 50);
  if (!sanitizedUsername || sanitizedUsername.length < 2) {
    throw new Error("Invalid username");
  }

  // Use Fortnite-API.com - completely free, no API key needed for stats
  const response = await fetch(
    `https://fortnite-api.com/v2/stats/br/v2?name=${encodeURIComponent(sanitizedUsername)}`,
    {
      headers: {
        "User-Agent": "FusedUP-App/1.0",
      },
    }
  );

  const data = await response.json();

  // Handle API errors
  if (data.status !== 200) {
    if (data.status === 404) {
      throw new Error("Player not found. Make sure the username is correct and the profile is public.");
    }
    if (data.status === 403) {
      throw new Error("This player's stats are private.");
    }
    console.error("Fortnite API error:", data);
    throw new Error(data.error || "Failed to fetch Fortnite stats");
  }

  const stats = data.data;

  // Transform the API response to our format
  return {
    account: {
      name: stats.account?.name || sanitizedUsername,
      id: stats.account?.id,
    },
    battlePass: stats.battlePass ? {
      level: stats.battlePass.level,
      progress: stats.battlePass.progress,
    } : null,
    stats: {
      all: {
        overall: stats.stats?.all?.overall ? {
          wins: stats.stats.all.overall.wins || 0,
          kills: stats.stats.all.overall.kills || 0,
          deaths: stats.stats.all.overall.deaths || 0,
          kd: stats.stats.all.overall.kd || 0,
          matches: stats.stats.all.overall.matches || 0,
          winRate: stats.stats.all.overall.winRate || 0,
          minutesPlayed: stats.stats.all.overall.minutesPlayed || 0,
          top5: stats.stats.all.overall.top5 || 0,
          top10: stats.stats.all.overall.top10 || 0,
          top25: stats.stats.all.overall.top25 || 0,
        } : null,
        solo: stats.stats?.all?.solo ? {
          wins: stats.stats.all.solo.wins || 0,
          kills: stats.stats.all.solo.kills || 0,
          kd: stats.stats.all.solo.kd || 0,
          matches: stats.stats.all.solo.matches || 0,
        } : null,
        duo: stats.stats?.all?.duo ? {
          wins: stats.stats.all.duo.wins || 0,
          kills: stats.stats.all.duo.kills || 0,
          kd: stats.stats.all.duo.kd || 0,
          matches: stats.stats.all.duo.matches || 0,
        } : null,
        squad: stats.stats?.all?.squad ? {
          wins: stats.stats.all.squad.wins || 0,
          kills: stats.stats.all.squad.kills || 0,
          kd: stats.stats.all.squad.kd || 0,
          matches: stats.stats.all.squad.matches || 0,
        } : null,
      },
    },
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Verify user is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { username, action } = await req.json();
    
    if (!username) {
      throw new Error("Username is required");
    }

    console.log(`[fetch-fortnite-stats] Fetching stats for: ${username}, action: ${action || 'default'}`);

    const transformedStats = await fetchFortniteStats(username);

    console.log(`[fetch-fortnite-stats] Successfully fetched stats for: ${username}`);
    console.log(`[fetch-fortnite-stats] Overall stats - Wins: ${transformedStats.stats.all.overall?.wins}, Kills: ${transformedStats.stats.all.overall?.kills}`);

    return new Response(JSON.stringify(transformedStats), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[fetch-fortnite-stats] Error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
