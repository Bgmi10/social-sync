import { baseFrontendUrl } from "../utils/constants";

export function fbLogin() {
    const clientId = "1008204271285975";
    const redirectUri = encodeURIComponent(`${baseFrontendUrl}/facebook/callback`);
    const scope = "pages_show_list,pages_manage_posts,publish_video,email,public_profile";
    const oauthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

    // Redirect user to Facebook login
    window.location.href = oauthUrl;
}