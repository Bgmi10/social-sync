import { baseFrontendUrl } from "../utils/constants";


function base64urlencode(str: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64urlencode(digest);
}

export async function xLogin() {
  const clientId = "TXl1eTRhTThVbVVFVkltaUdrSXA6MTpjaQ";
  const redirectUri = encodeURIComponent(`${baseFrontendUrl}/x/callback`);
  const scope = encodeURIComponent("tweet.read tweet.write users.read offline.access");
  const state = crypto.randomUUID(); 

  const codeVerifier = crypto.randomUUID(); // Store this in sessionStorage
  sessionStorage.setItem("x_code_verifier", codeVerifier);

  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const codeChallengeMethod = "S256";

  const oauthUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`;

  window.location.href = oauthUrl;
}

