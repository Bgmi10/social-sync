import { baseUrl } from "../../utils/constants";
import { Facebook } from 'lucide-react';
import { fbLogin } from "../../services/fbLogin";
import ConnectMedia from "./ConnectMedia";


export default function Fb() {
  return(
    <div>
      <ConnectMedia
        mediaName="facebook"
        mediaIcon={<Facebook className="h-5 w-5" />}
        exchangeCodeUrl={baseUrl + "/fb/exchangecodefortoken"}
        connectUrl={baseUrl + "/connect-media"}
        loginService={fbLogin}
      />
    </div>
  )
}