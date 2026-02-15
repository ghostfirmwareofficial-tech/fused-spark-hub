export default async (req) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...headers, 'Content-Type': 'application/json' } });
  }

  let body;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } });
  }

  const code = String(body.code || '').trim();
  const redirectUri = String(body.redirectUri || '').trim();

  if (!code || !redirectUri) {
    return new Response(JSON.stringify({ error: 'code and redirectUri required' }), { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } });
  }

  const clientId = process.env.EPIC_CLIENT_ID || '';
  const clientSecret = process.env.EPIC_CLIENT_SECRET || '';
  const deploymentId = process.env.EPIC_DEPLOYMENT_ID || '';

  if (!clientId || !clientSecret) {
    return new Response(JSON.stringify({ error: 'Server missing EPIC_CLIENT_ID/EPIC_CLIENT_SECRET' }), { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } });
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const form = new URLSearchParams();
  form.set('grant_type', 'authorization_code');
  form.set('code', code);
  form.set('redirect_uri', redirectUri);
  form.set('scope', 'basic_profile');
  if (deploymentId) form.set('deployment_id', deploymentId);

  const tokenResp = await fetch('https://api.epicgames.dev/epic/oauth/v1/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basic}`,
    },
    body: form.toString(),
  });

  const tokenText = await tokenResp.text();
  let tokenJson;
  try { tokenJson = JSON.parse(tokenText); } catch { tokenJson = { raw: tokenText }; }

  if (!tokenResp.ok) {
    return new Response(JSON.stringify({ error: 'token_exchange_failed', details: tokenJson }), { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } });
  }

  const accessToken = String(tokenJson.access_token || '');
  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'missing_access_token', details: tokenJson }), { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } });
  }

  const userResp = await fetch('https://api.epicgames.dev/epic/oauth/v2/userInfo', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const userText = await userResp.text();
  let userJson;
  try { userJson = JSON.parse(userText); } catch { userJson = { raw: userText }; }

  if (!userResp.ok) {
    return new Response(JSON.stringify({ error: 'user_info_failed', details: userJson }), { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({ ok: true, user: userJson }), {
    status: 200,
    headers: { ...headers, 'Content-Type': 'application/json' }
  });
};
