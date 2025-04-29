import { Youtube } from "lucide-react";
import ConnectMedia from "./ConnectMedia";
import { baseUrl } from "../../utils/constants";
import { ytLogin } from "../../services/ytLogin";

export function Yt() {
    return(
        <div>
            <ConnectMedia
             mediaName="youtube"
             mediaIcon={<Youtube className="h-5 w-5" />}
             exchangeCodeUrl={baseUrl + "/yt/exchangecodefortoken"}
             connectUrl={baseUrl + "/connect-media"}
             loginService={ytLogin}
            />
        </div>
    )
}