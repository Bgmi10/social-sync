import { baseFrontendUrl } from "../utils/constants";

export function ytLogin() {
    const clientId = "852793375848-0bq2mr73d5p5j5ug8no17rkag72lbpk5.apps.googleusercontent.com"; 
    const redirectUri = encodeURIComponent(`${baseFrontendUrl}/youtube/callback`);
    const scope = encodeURIComponent("https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile");
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline&prompt=consent`;

    // Redirect user to Google login
    window.location.href = oauthUrl;
}
