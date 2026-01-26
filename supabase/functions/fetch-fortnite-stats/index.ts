import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const { username } = await req.json();
    
    if (!username) {
      throw new Error("Username is required");
    }

    const apiKey = Deno.env.get("FORTNITE_API_KEY");
    
    if (!apiKey) {
      // Return mock data if no API key configured
      console.log("No FORTNITE_API_KEY configured, returning sample data");
      return new Response(JSON.stringify({
        account: {
          name: username,
        },
        stats: {
          all: {
            overall: {
              wins: Math.floor(Math.random() * 500),
              kills: Math.floor(Math.random() * 10000),
              deaths: Math.floor(Math.random() * 8000),
              kd: parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
              matches: Math.floor(Math.random() * 5000),
              winRate: parseFloat((Math.random() * 15).toFixed(1)),
              minutesPlayed: Math.floor(Math.random() * 50000),
              top5: Math.floor(Math.random() * 1000),
              top10: Math.floor(Math.random() * 1500),
              top25: Math.floor(Math.random() * 2000),
            },
            solo: {
              wins: Math.floor(Math.random() * 200),
              kills: Math.floor(Math.random() * 3000),
              kd: parseFloat((Math.random() * 2.5).toFixed(2)),
              matches: Math.floor(Math.random() * 2000),
            },
            duo: {
              wins: Math.floor(Math.random() * 150),
              kills: Math.floor(Math.random() * 3500),
              kd: parseFloat((Math.random() * 3).toFixed(2)),
              matches: Math.floor(Math.random() * 1500),
            },
            squad: {
              wins: Math.floor(Math.random() * 150),
              kills: Math.floor(Math.random() * 3500),
              kd: parseFloat((Math.random() * 3.5).toFixed(2)),
              matches: Math.floor(Math.random() * 1500),
            },
          },
        },
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Call fortniteapi.io for real stats
    const response = await fetch(
      `https://fortniteapi.io/v1/stats?username=${encodeURIComponent(username)}`,
      {
        headers: {
          "Authorization": apiKey,
        },
      }
    );

    if (!response.ok) {
      console.error("Fortnite API error:", response.status, await response.text());
      throw new Error("Failed to fetch Fortnite stats");
    }

    const data = await response.json();

    if (!data.result) {
      throw new Error("Player not found or profile is private");
    }

    // Transform the API response to our format
    const transformedStats = {
      account: {
        name: data.name || username,
        level: data.account?.level,
      },
      battlePass: data.battlePass,
      stats: {
        all: {
          overall: data.global_stats ? {
            wins: data.global_stats.squad?.placetop1 + data.global_stats.duo?.placetop1 + data.global_stats.solo?.placetop1 || 0,
            kills: data.global_stats.squad?.kills + data.global_stats.duo?.kills + data.global_stats.solo?.kills || 0,
            deaths: data.global_stats.squad?.deaths + data.global_stats.duo?.deaths + data.global_stats.solo?.deaths || 0,
            kd: data.global_stats.squad?.kd || 0,
            matches: data.global_stats.squad?.matchesplayed + data.global_stats.duo?.matchesplayed + data.global_stats.solo?.matchesplayed || 0,
            winRate: data.global_stats.winrate || 0,
            minutesPlayed: data.global_stats.squad?.minutesplayed + data.global_stats.duo?.minutesplayed + data.global_stats.solo?.minutesplayed || 0,
            top5: data.global_stats.squad?.placetop5 + data.global_stats.duo?.placetop5 + data.global_stats.solo?.placetop5 || 0,
            top10: data.global_stats.squad?.placetop10 + data.global_stats.duo?.placetop10 + data.global_stats.solo?.placetop10 || 0,
            top25: data.global_stats.squad?.placetop25 + data.global_stats.duo?.placetop25 + data.global_stats.solo?.placetop25 || 0,
          } : null,
          solo: data.global_stats?.solo ? {
            wins: data.global_stats.solo.placetop1 || 0,
            kills: data.global_stats.solo.kills || 0,
            kd: data.global_stats.solo.kd || 0,
            matches: data.global_stats.solo.matchesplayed || 0,
          } : null,
          duo: data.global_stats?.duo ? {
            wins: data.global_stats.duo.placetop1 || 0,
            kills: data.global_stats.duo.kills || 0,
            kd: data.global_stats.duo.kd || 0,
            matches: data.global_stats.duo.matchesplayed || 0,
          } : null,
          squad: data.global_stats?.squad ? {
            wins: data.global_stats.squad.placetop1 || 0,
            kills: data.global_stats.squad.kills || 0,
            kd: data.global_stats.squad.kd || 0,
            matches: data.global_stats.squad.matchesplayed || 0,
          } : null,
        },
      },
    };

    return new Response(JSON.stringify(transformedStats), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching Fortnite stats:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
