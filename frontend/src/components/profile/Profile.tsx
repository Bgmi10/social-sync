import { useState } from 'react';
import { PlusIcon, UploadIcon, ArrowRightIcon, XIcon } from 'lucide-react';
import { mockPosts } from './constants';
import { useAuth } from '../../contexts/AuthProvider';
import { fbLogin } from '../../services/fbLogin';
import { baseUrl } from '../../utils/constants';
import { ytLogin } from '../../services/ytLogin';

export default function Profile() {
  const { user } = useAuth();

  function isConnected(platform: string) {
    return user?.connections?.some((item: any) => {
      return item.mediaName === platform;
    }) 
  } 

  function mapId(platform: string) {
   const id = user?.connections?.map((item: any)=> {
    return item.mediaName === platform ? item.id : platform
   });
   const stringId = id?.join("");
   return stringId
  }

  const socialPlatforms = [
    { id: 'instagram', name: 'Instagram', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAYAAACLz2ctAAAtXklEQVR4AezBAQ0AAAjAoNu/tDl0QAAAAAAAAG9NRy179gDrX9NdcfyzZ8793b9r27Zt2wqqoHYb1rYdt1Hj1AhqI6jdPrafizO7uHOSnfMi+uvFTlZm73XO9TdrZnK/TB6/Ctef5jqudm4MbgTXBofGUXAYHJaLvq/GUee4GR2tGz2tndaa80a2hWhAdCPCiAA0dBmBBQ1bH4BONqFJi8ggm6FrGWRnXKwxmrHS1kWsYYyDOBucdLk27Sycnod2cixOhzw7Fs8NnljFk8PZ01fFs087fRzPegmt+HP3uNvrF7325eD1lu6t1/SW2bxWX71x8iqRDskRjoNlqk9FoyW9yUjZQvYwgmxdIqMRzRoNNuiEjmYIIqQmNQQaltJvft/gFLnNDX3OIbLJ7FKIPBIjZAbTjzUYTeairawjGOToYm2chHG6cIa1y8eSe7r492Y8EM7/7Ez7rzf1mg8j3eUVKd1N9ZVXvUY786qteUfpnYKPkN5QuhaJokgCEEUNCbM34QlDQxhCCpu/gjb9xtTQUOHr6ucMCzbfXKN4Md+pMIbQ6rtzbnLO1Ln21QspdjPDBaT53138NeN3mvO/Pji+7xW95n04eTmAu/o8Lr3qVW++nnmj1ny08B6R3ly6DJEYhLnu4bPv9zCOCVAW+NjgaxID6QghN1AnHEOvMBTgluLt4eo28KI+n37Od7MAOHQNSQGvzb4CGGWtgDLUPlg79zTrn5G/162//4z1P/Cwu6DiHv/gTtYPXXnzj8nwYdL7S6/b0qtFIIkJm6TC15JaHQqE6h+spF2Xcs6b39VkTItkex/toi/gbT52oDW0CZitl5svsGy9nE5qWMQOMKImq6SAW1O5wvjCNbbPfTqs/975S/JXbzj/VTxyhxPw79yJ+porb/lOwee15qMNryNdikQWgCaEkpizCWAgC2hKH1BTrEC1zNSLDawCYNsDKAuYUYBlQYgKjIOgAlfTUmyfRxdy9il1sYdOg33i1c+/B466Fo0pQnIxn+L+kP/cjB++4t9+Eyd3CMBfdbvqy33U8ZVr3uucL4z0icHV2GCaYBlAywLclKyAAYGOKGogS/LVs9+qTfBM4FqBsU3IzHWhwBuipGDIOdNFScU9gAG7rbSeA4HYVAGsniFEAW0gNCkk068/nwmhzZt92a7PG3966vQHw8kf4H63seJpf+p21Ld4t9d03cdKXxe8uQRiEGqylXMeYi3PVQBfeGLsz0nNqtU0nOnX59z3aWctZ7cJZwGws9/6LKKAVS8eKbQdTKFJrSTh5sf0a5rZIBUlybBPPpA7GPdKrAIqjFKzPtT4le78m/EftzEB/9KtrPBO8Q3XvLX0tcJH49UlMWjq9nohaGP6VfUP/GLUqYmmGxiaUdJt1LSbIG694pkfF/UWLMo2u78Zd20DYoNM7OA0e+X2awO39HsQ61wvUknxxsTa7JXkI6zswdxAtEr5W+SPd9d/43ZsywvX3cr62uveE98ZvLdwsMHUaImYwAUxoIJHY5cEBKAVlWQoyTV0Y65ZUs0GqAWBmLAu5VmBtMC9hzxmHxobQOy2zQ3YCiepUdIaCPbPZIFYgc8ujbMmIxW0zdGo6VfW0OQH4fV48rVYfgHP3OIE/Bu3or7a218+vuGTpZ8P84JRoAJoFbpBjN35zy79CgTFL/2oAAprmdOypSETsGGRYurIoKRdLynSRAVYF0xvQlWSDxtYWgEidhenALETkPXzU8BUkpDcz4LiZz0DCuaawpBztUlOnf8SR1+Mh29hAp7dgvPeu1w5vILPaekbpEsRBCJQt9S5GrsLRdIrpFDhm4K2B3N3QyypNZUl8WYKTmjJAtiw1PcpICsA24ShFcBil3pRe+qtlro9S9if7+TuZ8MuxVRApdwl6/Y5kqKo0FH6+DTO/pHTn8F/3RIAb3bCfu+rvv/10xOfsaRvD149AogoIGUBcqWNDcjZ7858ClgNSt/ZATGmN0aT502eLPL5Lk/TOFt4Pi78sRgZcjTySGaTSbrw6bJAPdLs65bbNGFomkZJGtGY7wUiJkzRBTQyQosmG9nJQ4hLF2seB5dCLEFLIwJ250AAsgK+AwwGCLn1yJ0A9R3rVxOvyvrt+O9bAOBwM+uZUx/bYsKHTZIAtCAqaBt8Zd4lWvXOgoeDexb+Jbmn8dTCk8RzXTzfrKchnj/iJLVnunyuy/O0JrkGo4tMq8vkKZCLwBlIHEgO4OAUADFdDhKBVIuDI8Cp0zhsroMzZ3E014OG8yDi3HkPrR85tHB6vFquNC43ebxwPOQxcSXEFdZXaNorhnxL8nXxWuRlYBQIYZQ+i/aVRYGBuIxP4+ghjn4Yj7iJFelP3Kz6thvv/m5n/FGjB5Rz3P4/Gm0q7NOvbquexn0L/xn8Ef7mwJ/8J/dgeHkB+Cb/8uosb8r6/ng3vBnj1cnXICuMU1l6Zc6ptXjrXP0wH/h1OL/r/hf8Lde8re6HpA+NknaSmDJoCmQD6/RMKP+nvbsAsuS4En7/y6y63T2sscVMRsmklekz4zIzM++alzf8DIvGb3ntZd41My2ZmS1ZMglHjMPdfavyPLobcSNj6k231Hem50X/I9JZWdcjaWb+fbLOqcy8RMMefBIfSfxnw6dX/iC8wU+5fjMH70d5IL6HuBf9mUQzLeNEsqlWKumgn5a2p3sq/msNBXznGsj31BOb7EWJ74iwJcHUtBpBiinJpt9wFGIiZmY586+JdxY+cCs3YNkGdyMyfuJ4tj6A7htI3045qxKuuu6hjnwIdCifoPwsPrZGAr7d3eGnfc3o9O2+PfOX2JICpoUjBYFcJRmCpp+IyheDP5znjTu4Ab01YYPvJHHJiYzOZPnFlMfhUBJOtXock9YvEf9G+yzctgYC/oe7w28d96THN+HvU3FGSvifCAf/IyDERLhCiknrydyY+MfEi3GzmbLBz/jsFnwH/dOIB1JawnSjryJifd9BumfR/A2W3A3auzvDjXrflzgjBSYt+Z+ePB0Ro46Cbiv8Pv4y2GfmbPCnHrj/5/h7Pn496bnEo1FFvPj/aFA2kX6Cuffi80ctAr5k+5MeGsV7EpvS/0gGUMiTPiFNop9g8hy4C7/1U7wSYYOjwCfuS/+PlK869FQcA9lxZ3L9J/gFd4OWPe4qUfxEEzZJ1AJCE5QgIwc5kXqasBsvnecf/4GwwVHiqy7/QR/6Tfwu8WCmZQMD2XEgkL6XO5+Dxbsh4G6snpct/MgT5nhiQhRSIiEVpmUc1e96w0147k/wFwgbHGUe+Q4+fAfxvykPIzI9oAy0MOnvwfZn8u2/h7B6pLB6Xi3mbtrs5Sn5sQgLSbWkatKmi8uTscQf7eZXcNCas8Ezvbvl8QXFqnj3D5BeTjkeKAh0iCEBUT7M8ndil9Wj5R+tlju2uE/LIxULkKaXyBcgFUzX/oAvBr+zc83k2+BHvLvl+LPIj6C7F8edxqfvIK4gfwSfsiJueS0n3Jf4jfr57zDlmvNpvwZ/afVoaa2W1Dmn4XyJBIjpwnKaqgGaXBN4GW60hmxwwq9RvonxaaQt2ExZxh7KbYxfQ/c3uNowOO0gy39M/AJlx7CEdYISx1Eexc5/wNLqBbTdavhLX3vSiG+IsC0FEUAytZOtLsEg8erCW91tNvh+Ep+9AC8mvoaAaTFaYjNOJi6g+S76X2P5nVg0zI2MX0D8LjFHDwiUqkFB1+Iibn0wPrJ6Ad1qNcxxai4eHQGYFhASqQDQIrE38/pXcYM1YEPAz56G36U8GXWNDuoodT/S8xjdjvcxDPvfTvP9lItI9T8HtYSBOBfn88MfRaxSwB9cnYCNe0fvPEFKlCDXElKv5/vomA98G70N7hbf4/072fKDpKcQLQWgFqNuD6a8BA+HYfIV9K+iPIho6BEDq2QAbKW/iL99K+5cpYB/azXk/kceHswlCDIyYmB7IQ4kPnEJ11kDNthxOuMfJOZRiRCAGGpfRX4gPmuQrUvc8UnKtTi7WpwKCEBfCT4+EXfOdEn+HF8TyAAIqASckvLaxFsuplgDNlj8avL9KIgB6aD+HEpD+Wme8AsIg/zrpcxfQpxFn+hR/3N7FCT0iIfhFHxxdQKugjf7yc0tZ0NGVPIFciUjri9cYo3YoFwwLF2soJUL+MBW7DXI99zAqy8jPYV+nnoKdqhVMlspZ8HMIuAmzgo2FWRAqabfDIAEfBx3WCM2iJOGhTPdDxSO02b27MCwgN4epI8xvgWnD5dkahnLg/H3M9sTMuK+BRCVcBmBaRqM+Yg1ZINYImCVURCgD+bGDsuey4jbiNOHM2G15OfBzARsuH9jOPpFJR+6OAYFfLzntzxxJ8sn0J1EeybpfOJsnEyzhbSVmCN1OEDsJe0hfYX8JdI1uIXxjYx2Y681IT6PbyENyFeqe10lpi/x/lscnks478vEg6YEq/95VSJS7s0zE2IVAj7dSpnztJNV0tXPgYXpJOS2TexyjPBwb93JwoU88t4cfCjNA0kX0G8nIwH6gTO5AgkF+SBxC6P3Uz5N8wl8BVe7W5QPkfZQtquj23Ckmr73bi4qVsRtV2LgmY9DTM1n8+LN2L8KAV9sJVzqOXMjzquTj4I8rPzV1jkXeXXD9nPIT2busXQXEWeQNtNVUqmrnJWMaToz3EQ6k/77SN9FXE+5Fm+ifT+nfBKLVs1VHye/nfLdpAEpoK8kgbiNxTdaMeVSkuGl+lGPF0jHr1LAZCU0bJvjOFUZsq1ELEiA4ErrmAd59VZ2/CK+hTiP2EG0h87vA1DXAFLVZ6hp6c/EmaQL6Xex693EX+OTVset9K/Co4nTCBRAfV2P/THzt1gx+2+mQ1nhwoSCvMMqaAkrIbF9nvlUBfYetcKBhLQOp9/7+sSIvWcx/kG2/zDlLHowTKr6HpCqBqrPVJ+lHaQduAA/T7yS9FqWP4LdDk+H1+E4PJu4PzH0Cg4RlP3EbzP3Cqti6WYMRL4ykJAsn4nPrkLARSthM1sKTVRTboMYKEon9lhHnO9dW0jfhB+nfyxGFBh4omW41G7g84QwLKb6n/dTxBOZ/1PiDVY+a/w1i7dQXkicjy1EJYegfIzyRtJfs3yHVbG4l3mE4c3ttfjNCVZBS2MlNOxomB+uPEEoSAKhiH3WCed673l4GuPvxQnDZ6IEatJQZKtamRZw4CVlOdT4fMoL8D3EL+KjVkT7Zrov0T2O8hjiQspxpH3EV/BRvIM9l2LRqsn7h1ZEDz8P2rpKAXsrYYGtPaNAUSf+RZKEkIWEUIxYtA44zdvuw/yLiSdStgy/Sciokw1VRKsFrZ/7Sh3l6ux4oGgcW/Ew0h9R/pw7/gnLDs/luJodb2O8g36ebky5kxNuxz6Oc9f43BJ9ITKl2hNiYP/IeH4m2zLn2DoWIwghEDAZhYl4QhECSRxVAU/23/PEj9I8j+6kQz+k90iADlDLFnW0q8WqBE7V/TTV90iGSQ/Dg9j5ABb/DF9yeA6yfC2upUUL2OfusXSAdomyiVRHv4FIaPNM3gXPMUfJvZBMu19AL1Bk01OwJUeJk3xsK/13kX6H2AnUf4BQhkRAUlELWY3LgLihFnGYgHnS02jPIn4GtzgqfHSRh+8nNlWSGX43bG4mWXCxON9KuQGhTPUhZFAUoUGIEuKoCHgP795G87P0v0jsJAB1/m4Vz3x1qyVMA2MwICTDlAbfRtxG8zu4yhHnx3ou2Uscf4joNzSen8kzYKOMktQEQkgC5CkZCWXSB306CgJu8x9zLHwt/a9jO/3AEWSqWt40xbBYeXjZxWDtMCE5PAG1sN9Hl7jjN3CzI07spx8Qrr6H1QtYrISRMhfkiWAaTK6r/y0ClOVes98RJ/8Y49+nbAf6SQMoA283IEE9bRbSftxOvpP+StIdxD7yMrnFZspO0imkE0nbsRNzwyWbmgQOURbagh9nxyLxu7jeEWXXvrrkQgcDUs5IQEqbRGoUYCrpgDKRL5mMlMVWHHAEGXn3ReT/g7J9+Cd2qGqpyoZjiXQV5VLyJ3AJzRWcdDk6NW5pWLwnWy4gX0g8jHQf3B9bKMgwLKQ0VBpK+Bnsxm86opRu+NwYtXwo7YwEXG5JmQAUWSCEkGEiYRGwFEo5cvL99zmMns/4ZMrA0nGqzw6VTCzRf47mX0kfJ11G3Aws41oD9LiZ/Tfjv8nb2Xwy6VGUb8YT6LeTVjr9Vr2W8jTKu/BeR4wY061gCi6AaGeShNC15HyoZ6hUnbieBCwnpXdE+OI8fob+CRQUAHQoVXSpM9UMcID8+/SvYv+VPG0Z4a6xB3t4xZWc+F7KE/DTpItxuGRkoNRfthG/Oim5XOmI0HcUGBSvOnW1nUkSQpln3BAw8MK7TAlZlmh6M+e/R7TfTfMz9Fsoh4l41NMhcYD4N+LFuAxo8CfuPt2Y67+Cr+AvOen5xPeTziHl4cjHwL6Pp5Key95n4Q4zZ7w8sD1zoKRVmllNwQ0lkVBgOB0H/ZiDYeake1N+kNhen940vGgzoSDgKtp/Yv5Pcb2ZU36PuJz8y7iQaOsSDQWgvkY0eCJbH8kV70AxWwqljnrDPyCkGW1KGjeUVE+/hkschQgzp5s8X6kLowNLZ/O0iLfgl1l8G/Y7Itx+kP3/xoVfon8uvpEAVT+QFRc4k/gxzv4MrjNTLi8YXo5FNe5XGwG7VQgYiYCBkGw6AsXsBdw1R/l5+oYyvDFHqqMh3E7zq+x+PTpHlsIlH+fcp9OeiwtI9azCcFYMTyEeidcc6Qg4fNI+RJ5RErKcKYkY2nlVR6CgMzueknjRc2hOreUjBgrK0CHfSv+DvOs/0DlqvPtKfvTbGP0B/VORMTSj1AJsJ36bfW/FQTOjKwTDEa/+wUkzEnCpQaoLuZSBelBfEGbG755FfCNjFBiIFnVxOd1G/Cm3vIeHdI46n/4iD34p6QLSGQQMJFF1K/dm68PwHjMjKgHL4X5A0qySkEwkykAELNW9PujNjvSNjM+hh+FFAVQSegvNn3PPg9YNu9/H9j8g/QZlp2kUGK7DGf8wt70PxUzoAVBqCatmlknIUgJKbT76+g8HHZowEy7ZTHk45QTyQCG3ALIpxjQvoLvBuuL2JY77B7rH4RsBiBVUHOLBnHghPmsm3BlDq6AH9iWnGT8DFtONhA4JBWOAoJgN+x9CfhTy8JQbaNAjkArNCyhXWJd84WZOewZzT8BWyko3nd+Lpe9i9yUo1pjhVTAG6oBhRoXoA4mMfmhXPAJ9Jeda8+9znH0/ysmESRt4n9sBMspn8Vbrmmuu4Nx3EN+BoWhT/6VvpVzAju2405pzaxDqBkP3ZzUFO3QZpp/qTfXdjJ4Bd96T5YuJheHlVPXSqTQm/QP7v2Td0/8Z6bHEiYYjTl0YPoflc/Apa04fAMRK2sySkFS9dhvYoNyhwIyqA/M7WXooCeozuSohCxLSdbQfZmGfdU/+MuP3kL7zEAIOTXsnUE42E8LKBYQwqzIMukSYbnSgfg1GxGySkIMnEvcjIWD4iEyBHDSfYvFSxwQ7r+Pmd9B/AzYNr+yJ6Xunku7H1v/CkjUnqjZc9pphErI/kwY2KB9qDL0ZCHg67SYSDCyNzwBIeyZns+x2TPDfPff5Iul6nFdFuuEvmOZc9m1dewH7ICGqZrCf1btgBMpKzolDMRvKvRgPlJxyJWNG3IJPOaboryZfSTkPKCvIPMvkaBG3WXOGi8+kIzUFj4cPpdHX0/AMBezOJw1MtwW5zoj3E19yTLH3FrZeg57SAFG3eja6B2nBmhPD8lHdM8sIeBDQVxKODe8ZXbb2jE8CciVcroTMKChX849fdGyxyO9dTTpAbKMADEU/lJOIzdacWjrDEW+2Ai7XG1PqcsykQcywDthvJpChPnUAqnHcyvcWxxyxm1geWARQtQI7sXl2CYjDyzf7OqCq3jf49U3oka09461AGmj1ocH2OybpD5K64XfB6vEm4jgzo5buiEfA8QoOKIR+xlNwN0+CAfmqEwr1Y8ckpUMhBt4Fq68TJc8uATG8n/rITcGDGXA1Lkhmw7ibFpAGkAfOaGkbxyQl0+eBetxQRIwjF/nqa7POghcBECs4rgvC2tPtJ9VvO5CR62VYGC84JukXiDy8UUm9FnOZvN9MGH7mIw2M1/iIXvqBBah9/dM44yjY76egqZKNfkrABmFyfQ/enhCOKR60jTQi1G0gIdlN7JmtgBjeT400yym4q4QrlZhRj1GsOW23Vx8IZCKTAlCIBhAAp/KtJ+BmxxTlnqQFihV+M9LtdEuOCInhkx1mJeBiJVUtYy1dmY2Ao/GXzSNlSiIyMZWEJERBpmRKd4L2zgfgPx0rLF54AuVCYiKgAQGhB5SbWT5ozekHdhemgag3uwg4fCzD8DQ8AwG7L2shI5mIRkqUIAXREJPr5XI8zQXHlIDyKfQnDhR/h1ZHX2smZ/GU4chGJeZsyzCBOuoNL8tXMLbmbO6uJC1LaY6Ehkjkhr4QGcVESprmOBEXm9u0Bfutd256V+Ih96GcP7wxCaJuX2LuTmvO/kQc5uR/dzkitmQrowsi6BFqGetFqRo0ZhEBbyHdSDqTZBpNAgSBSEhZOFcsnonLrHuesYNyMf1WwIB0pvuD+Ap/st+a8/0D34liqI8ZZcHjoFTSqYvSpDE5MZKUkqw180s30rwP3y9lSiElIkiJUtCgEJM+8oM1HuaM0ZfQWc/c0N+b8h1IdfQzPCVfzdKX+KGwNqzyKyoS0qyTkPHA9FtIQS4o5J45jLokj609N96iPfHT5O+lyVKQEwUp0QalEBmBhrCFpW9xg3/H9dY1/ROJc4cTDyj1ZzfS3GomjBPJMLneCGYm3xPCUmBqCu6RyD1NT4vU0wajjjZIyZqz7+Qlxy9/Rso3iO40elKLnmiJQpPRolACmWieKo2/Fn9lvXLZA+5B9wtAgMMnIg7gM1y1y0w4KQ1Mt1WDPMskpA+KSSMVYNTT9pPIF5PrMcnsjgdM469o5i8jnSaj9GiJ+nSpTEHKsFnE09a1gOLHKaetUsBbKO/m9M5MWK7lg+Hvx5djRknIUlBC0wFtz6jQFEY9uaMtNGNSIfdJU5JZcMAV7tF/UEoPp91GQ5kjjYlR/SaEaIkg8gMVzzfuX4x91gufvzTxI99I/Bx9Ld/hZPwMt7/dzDgOUYtXSQcNEtLMBOylCKMeE/lGhXZMM6YJUtD05CAjzI7UvUPje6Vum2hpOmJERilEQUMKCkog0zQ/aS5/3scueRXCuuCHziY9i/5sYhWLAaC8ix1LZkdCteLc8HQsm42A+WAY9cwXck9TaCdRL8ekIaFFIwuzY59PON47iXsxJsboUWhaYo4oRJCD6NEiThbNr/tfD74CH3O0+eD9zyJ+lfhfh5evjopuorzKTGkzkAcEy9PRb4ZT8Gipt2kcmn6SaAQ5SMhTrTG5lnSSWRGW8UqNXwABY1KPEQXRokz6BkFEEum+YvwrlvMv4wpHl5+l/36MMCTc0PU/4RYzJdKhI15GnhZvxgJu39/LitZUpKt+AFokJJCMzJY7fM5J/lryYwAULKEnMjYREwlToSD6OdF+u1Fzb73v8P7Lv4ziiPINx7PwHMa/Mlx3g6KGQPo45S/NnNyQh954VBI2UGaTBc/ppSnhagnrSJglRTJrWn8peRzOAwUJOqDAGCNiRELKRFD6B8ijV3rivX5bGb8Pi2bNu+854qwziF+ifPfq1tIFIPaT/4buajNnLqOWDhmpatD0s6kDNopGqabaQ7eERntEBEw+qfEKyQuwAMIUy0SHnuiJQEtpaDIRj1Gav9DO/4kyfiV2myXbT/9O4+6nLHmEkuZXt5wpAN5LeS3pgJmTUi0goBYSzQyn4EYnC83AlNtM9RnJSJLNmjstOdWb9b4WT4BaQgplmdRROmKOPE80RMqaOEuJZ2rai/XxvJm8M/7cOSfSfr+2e7rkTFkyTiyvZiVxIF2DV/Lmmx0RvndUvemokpGmFrDMJgJmi0Z6DXIlW1MnRMgWJK0jwa0ut9MLzNumuJh61TqaIHpyj2WMKS0WJiK2p4j2u6TR10heL+JfLHZf4Oxd6KyWd787Of2RO21fuJel9I02lR9nfLJRok+M0SCjS/SIertpjTH5hXgDX+fIECPS0HTLtBCgHa9SwNaKWNBRTcGVfJWAc8iOFLu924leqvEPQguo65EUKMQyuSeCmEPQF3K/XTQ/rG+fYvPcx6Qb3qRvvqhbvMa5O2/A2BCv/ETyqEedYpxOcNGj7qNrL9b7OnNxgVIokMiJhAajxBiLiR59N7zOTnor7/hrR5TvGZEcfitsRoPoZrMpKes0QlMnHBwyOUkWJAuOJP/mVX7Ak/BjQh4+YQx6So+eWCbmaEaUEdHQ9KeK5puV0ddq+2u07TV27b9aP7pSTnt16aDIYyU1+rSgNNs86mHH099XTidr8rlSt02TspLoEwWRgJQm8iElErpgKdMHoea/6H+HxxVHlNSQTFE9c6kEaLqZRMCJgH2VaNQCkqYiYNjsSPJUxdjvWdAKP8Jhvv8lIfVTb046SiLK5F5DLnMin68058vRyQ6KtCw3HRFI5EZjTmdOlAUyqRAT8QIyGWlyDyJNP0MzTuTCGEuIBPBF2hey+9OOPJtMU0/Bcp2QjGdUiLYsK3XCUUsoIaExwiZHmn2+YovfAHynbIsY2F8NPXKgI3piTLSUeZNnQ7T0LaFV2m1kcksgZ5O9JzQNXSISgT6TEyUBMn2iR5PoJn2LLjEXLCVGGE3uHfTf+DW6j7DJkSe2oYo4qml30oyQlmazILWxLCkydSJCPR0jazDvaHCL693T8805iJ9B0iCGv4wIlKD06Mn9RMRJ/VBHNKRAJhUik1BaSiYK8kRApMl1n0goicgkpEwO+kyXaJAQiRbAZyx4Pj7iaLGYN5OQB9YApvovfnE2WXA7EXB6uq2lqxsLjha7XeUeftOcLfgezLGS3Y2AMomIZZItx4hoiYls0VAaSqb0yJOIlymJkkmJSKRJK4k86ROTMSmRUSbXPaT/Iv2+kfc4Wtx+1ibSdhIMFYCrZ8K8PKs64KKkG5Stvt+AOUeT3W53gt/U+KLsGcLxSv1dNkNf+ghB6smFGBMN/Yg8R8nkZhIh00S4TExE7Cdy9ZmUJtdpWk76oM8wERTyIt4jNb/qlP5SR5Pb2wUsEEgDG9PriDR30CpoV+xI2K2xrKmKz81gHRAWHG1udy1+2+k+KjxbeDzmFUAMtAYFEEEEpdCMKYvE3ETIhhhREhq6TGpIk3GbpoWkoCRSppnKjrtUhF2a/Dxf/NzfobjKUeZ+C2hJpptagukoqCzO5pT8ZI9kXEW6OvFQfb7VeuFG/+4UXxaeK3mi7EzB8D7vKQlLvfemYJFIpBHRURoiEy0pkZvJvYSJkGUiXMoIIgHZPpp369K/GvX/5KL7Wxd8cmkL80N7QAZqgXOLs4mA2V6NcZ35Dj8SgO3WEze50vF+zoKnCD8gfJ2wRUGqIl8ACsPfTBHkZcoypaEk8iQalnZyryHlqc8nEuZMZLJ36/MbpMVXO+uam6wnPnnxNkotHKA5ZMQhbptNIXqrg3qdNCBfQqbKkndYb9zpoLO8w6JLJG+U/YrGA8SAdAlNdQhXqc/hRN+TEP1Eskxu6FpSQz9PDpMISO96pXmNfv5PjZevwUG7Tre+KDum/2JRC3eotyE3zCYLXnankT1VtKt+EKraIPe3HtllGVfgCsd5gzmPl30bHoLzhG1CEuiRBs7krCNnTO3fz4XSkZcoLXm8JNxA8xmpfZPF/o24Td7LZuuU/hRaRCVa/TzYTo3jptlEwHe9bL9vfNZV1TvfYfkykrOsd/baj7c6xTv17oNvFx4iOUdxkuQkIUnIdeRDqqboyViPZK/karpb6D6jaz5g1L8D+8w7FrjvlFiH2QvSIHeUO2eThEDj2mqarWWsxTzZvHvgduud3Tpc6mU+7/l24ky9E4w8WHGG5FzFCXonY4dksyTphGJZuBO3GbtZcp3kK8a+LFwh3OgG19F3jinSvYk6+YCB/cB5F6ffsUoBz7Rikptq+WoB6xUxevfFBx0rPF3g9kmj8X47bNPZppg3sklnq2y70KBoHTC2W7Zo3kFL9tlvr/McRAH3dmzxvG88HtVDaRp46A9kpGu4oV+lgDdYMdlH6ihXPwNq6+K4x+GDjl0O2uMgbgZLaihoALAwaXscw8xfhFPISAPymRKgRXMZzCYJgd6VRjpZO7Ai5lDtYbZYwKINjiGai4idBAKQDvPdfPFZmE0SAm/4ozt9/y/eIDtjuPxSPx+6t0X3w6dscGzwe1+/ExeTjqsEA0BSRcclRl9avYBGVkX2CdkZlWhDWTDZ8bJHHksCbrD1NJxP5HqaIwHUUfFa4tbZRkDI3i77Jo2sGYx6JJNrJ8qegtfgZhusb5730BHjR9Hed7qmRD7MUvzyPtrrYTYrogFan5bdJDtl+L1wHR09WHL/Y0HADU45C1+H+eFDMVPdOvLHOXjn6gV00KrYZJex92t8Zx35BiNidqbk62Wfwm4brGPKwylPBNJKN8tfQ3wOS6sXcLXc5FYneLfsWzXaQ0XBQ2TGWfYdslfhYzZYx6SfIW8dPp63PhEVfIX5y6weLfNWxatfsexpP/1pXC67UFtJV19ntEjOxkslX42DNlhfPGs+85gfJx5Nj4wGgQDkQ61Nu4PmnSzdavVoWbJqGpcLl0kuQJKQVrBTrvEY2dfhtTZYZzzqYtqfhuHzanq09TfVX4P/Apj9FAwv/8PbPetpb9F6rMZJh5x6m4FpufG7sr14lw3WBz/9xPNIz6VcMPxVEACpkjN/gNs/dzcEvN1dInmb7CekWsDhpkFyjuTXzbkNn7DB0eVHnngy3S/QPJk8kPnWfQAKuj9noXMXySy4S+2lv3er7PclRR54H9xUPTRajccp/kj4GsFGO0rtFy48yejAHxDPIKbkA+gBkOpr5DfQf47eXW0tvbvMnLcrLpE9UKIWsX4WZPozj5S9VNiFSxxZNnjOheebm/t5Ed+lFPo8fCi6glLddz3jV7ibpPA8d4vnPe+7ZK/QOE5T1wLRHLZE8ynJy23yBuy1wWx5wUUjtx+8WJd/RTf3eEujHbqGgyO6FqNJm0Mz6UeYRzvpRz2jF9G+DLfC7JOQYd6t8Q+yXxwWbaAlZA/UeKGxBwkvwY02mA0vPjvZv+cnjfLPyc19pGh1iMQIfRCBqNaYRdV8gfKvPO+2NYiAa8Dvuw/+QOPJGo1m4OiQKjs+xPgmxcvxDsnVvsVuhA3uOg9Ic+6xcLKDm59kvPB9utGT9S3jecYtXctiO+lHLI3QYH6qn5uKjPNX0D4Db7YGpPAca8KLXvKtsj80cnq9YHWF2fH0GTSflbxR8kHh8/a7Bb0NVs4rHC8508HRRcrCN+vnHqOb22E8oowYz9G1jBu6EYtzLDfsn0eekm5uqrUYvRDPNcysC9EDHPBW222S/ZNUZ8ArOFMQMrI5ycWSB0luknzeTp+aLAO7zC0uq2XcAL8qe7CTLblIcn+Ni3XO1XT3Y3mzQGppglToe3LDKJGCvkdmuafLRKm+kLxD8zqal1lDUniGNeMV/3uzsb/S+J7B9YFtdZ0MrvqetJDtx63Yq3EZdglflFxv5EadfTbZZ9GiHQ643RI6a0UjORz7HI7hx/Ul7AcsT9qWSX8AT5C8yYJiXmezYrODtuM4vVONnas4z9g5xk5V3FNvm142Rsl0mxlvopunTKbcbp5uxHgSCccjDoxYHtGNMJqOfJ+geQbev8YC/tgah/6/Pl7xbK2f1th5yKRkZHJ9uL66hjS8OUvSC8uS/diL/RN5x4pO0gnLsl4RKCiSgkAIAQJQBIACQqkqFNBD9U8rU+OCTlIkk15IOo3epNfqjPSTVsxZtl1nm85WvTmdkQ5jdOgnrTC5T48OBcuIxHiefp7lzZSWfo7xHOMR/YguT8YtB0YszhMjjJZp3kf78/iCNaZl2Zry0z9wq7/+xz/Vu4fkB2WbpgXSACDVAtUSDok2eL+RbJJsEo6XAJBhYBxqSIhqL3Cu+vqfU6rPUr1/p+pLFfXrxLPUfxZT9+oEtT65ISOQEEHuJ30hCqmQe9pMZHKiKfQYoevpEpHfTXoBy18wA5rnuS/6tW1vvGCPb7r001rLssfK1eaple0nGfgqsvrXDoibhzbyV2OHuVb9Mw0cEqAaD/0AlcEvHq/GU00luWm5phoUpKHPE9FSEjEiT+RLiciYjFOmz6T0AX1+Fv3H6M2itSybCT/5Lbu84g1/YKvjZD8jaWVAMtys4p76eqoF6s+h/jxXf2n1rxtaDFzLkRGVeHVUSmiq6FpgIPJNmrb69dDXP5T1hrXqB7gUdKSgDXT0GUhIQQ6aQilhLv7DUnqhhfGnzZAUC19vprzorfNO8lTZL8keKlsYPl1/OIoMnRA7LOXgtDp8LwAO9y35A/cC9cFFZar11XWPbqovU/0YPZaZ3J+Mq8/HKFhGX///qnvjhrIwef5bYJKE6OfoJ4nHuPmCfuFvHPAK3GnGpDju8Y4If/nui7V+UfLtki1TEq5MwPoahjdqrZZhAROiaqpxLWUcRryYEqNDUcs4fD1GX40nvVJ93mM89Vk/STTKiH7LRL55xv9Pv2zcXGLc/J5rPvo69MyeFI4gr3NPje/S+DHZQySN5lDPcQNjh5u6hyQcmlprKukMSjcsYR0J+1UK2A3IOK7v121KuB4F40rAwPKIfoGyQDeiW6Af7TKe/1vj5m34kCNIivMf4ojyG59acLIHCN8t+wHZSZoBqepkhGEpwYCIUY9XEQUZFhAKYiXT8ICM40rIMeopNyZ9merHA5Gy/mcsI6Y/z5RN9JvoR2F54dW60d8po/e69NL9iCMroKPI22y3yc/qfbXs3rKTZK00FAWrxnCvygZV1xCwwnEMjAtU4qkiYKnFq6fdKmr1dUQbeCbsUI/rX9erx7fq5m5W5t9mPP+v+ISjSIqHH++o8uFbk/9yJp6o8RjJIzROk2yXhhOSgRpfLd4AqxDycBGxwGGm4BiKgJU0dTG5FqnDUvVrp5KPQXE7S4qr9a6w5D/wHjf7LJYdZVLc3/rheTY51X1wgeSrJs+JD5bskKRVZb9phVmwVdwrqBMTA5GvAOpMuKvGQ+L0hrPeOtKN1fKGzgG9qy15r3ApPmXRNbjWOiLFU60/fk2rsdOc4ySn4GxcqHFv2b1wFrbIsAIJoxJwSMSEAitIRADq+329kLiOgPUUXD+jUQs5uQ7Tny+bFrbTu87Y1RZ9QXKpzuUW3WLO9Tp3YNk6JMV3Ora4QPY9ttjteK1tGmfKTsAWybx+0mfzipF20tNKWiEjS7IyuSbJCAmUybhM3WO4LggqAXskoUcPQqATOhShCJ0i9DpFr1jS6U2asbFFnWWdJWOLegd1Dhq7TXGj3k16d9hlN3orZ0PADTbI/v/KBhsCbrDBhoAbbAi4wQYbAm6wIeAGG2wIuMGGgBtssCHgBhsCbrDB/wlKajuIhIz6AQAAAABJRU5ErkJggg==', 
    connected: false, 
    authUrl: '/api/auth/instagram' },
    { id: 'twitter', name: 'X (Twitter)', icon: 'https://abs.twimg.com/favicons/twitter.3.ico', connected: false, authUrl: '/api/auth/twitter' },
    { id: 'facebook', name: 'Facebook', icon: `data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' style='fill:none;' viewBox='0 0 500 501'%3e%3cpath style='fill:%230866FF;' d='M500 250.199C500 112.099 388.1 .199219 250 .199219C111.9 .199219 0 112.099 0 250.199C0 367.399 80.7 465.799 189.6 492.799V326.599H138V250.199H189.6V217.299C189.6 132.199 228.1 92.7992 311.6 92.7992C327.4 92.7992 354.8 95.8992 365.9 98.9992V168.299C360 167.699 349.8 167.399 337 167.399C296 167.399 280.2 182.899 280.2 223.299V250.299H361.9L347.9 326.699H280.3V498.499C404.1 483.499 500 378.099 500 250.199Z'/%3e%3cpath d='M347.9 326.599L361.9 250.199H280.2V223.199C280.2 182.799 296 167.299 337 167.299C349.7 167.299 360 167.599 365.9 168.199V98.9988C354.7 95.8988 327.4 92.7988 311.6 92.7988C228.1 92.7988 189.6 132.199 189.6 217.299V250.199H138V326.599H189.6V492.799C208.9 497.599 229.2 500.199 250 500.199C260.3 500.199 270.4 499.599 280.3 498.399V326.599H347.9Z' style='fill:white;'/%3e%3c/svg%3e`, connected: false, authUrl: fbLogin },
    { id: 'youtube', name: 'YouTube', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAZlBMVEX2HA3////2AAD6ko38r6v/9/b2FQD+6un90tD2FwT+6Ob8zcv8wb/7oZz8vLj5hYH4VEz3Mib6mJL5bWb4YFn+7+32KBz3SkD92dn5amH4UEX5jYj6f3j3Ny35gXz5dnD8tbH3Qjgj3VKrAAABv0lEQVRoge3Y65KCMAwF4LbScpeLgCC66vu/5AZ2GQVhnKE5/5oH+ObYYiaNkMASDne4wx2Ox6MgTtLDrkqTOIi2cX3M8lBZVJhnR72Ka68wygirIqDw9Cf+yG3lyc8fS7w0LPTIm3KG+yfFRQ+lTv4bXrHapFcvPGO2Sc8mPGU77leZ9A+vw5AfD8N6xHkvcyp1GvCgAQSn6E1AeA8JTtF7Kfwz4DqHMmdftKDgFL0VBxx+EB3oVOhcOnGBfCtDhRdRfE+wV/9OC5Ebhfp1qpT19QbilUcdqO0Fpkd4Y2turwqQ/h8nPmv42/6ESxmwp3/DaWbqeNPPcEr/Yxj5BS510CnDdThLfEh/5zqcFVzKuOMZz1ZxSl/t7zlfcSmTu336TZwm7pvtxW7jNKnZRt/G/bJAJff7m/3nvo63pfUrZAuPsoKng33guu3YmuMST+6MnWuOx7w99w2vjzlfQ1zgj4rvxTfHa6/haYSfeJQ+IZMLDUW6PwNSj9VU+/+M0EEUOkJDh3/oswX64II+FaGPXOzzHLpYwK5EoMsc7BoKu0DDrv6gS0uJXbdiF8USuuIeC7ecZy+HO9zhDkfUL6KTHlj3cT86AAAAAElFTkSuQmCC', connected: false, authUrl: ytLogin },   
  ];

  const [connections, setConnections] = useState(() => 
    socialPlatforms.map(platform => ({
      ...platform,
      connected: isConnected(platform.id),
      id: mapId(platform.id)
    }))
  );
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isConnecting, setIsConnecting] = useState(null);
  const [postCaption, setPostCaption] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  
  const handleDisconnect = async (platformId: string) => {
    try {
      setIsDisconnecting(true);
      const res = await fetch(baseUrl + "/connect-media", {
        method: "DELETE",
        body: JSON.stringify({ id: platformId }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json" 
        }
      });
      if (res.status === 200) {
        setConnections(connections.map(p => 
          p.id === platformId ? { ...p, connected: false } : p
        ));
      }
     
    } catch (e) {
      console.log(e);
    } finally {
      setIsDisconnecting(false);
    }
    
  };

  const handleMediaSelect = (id) => {
    if (selectedMedia.includes(id)) {
      setSelectedMedia(selectedMedia.filter(mediaId => mediaId !== id));
    } else {
      setSelectedMedia([...selectedMedia, id]);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'video/mp4'];
      const maxSize = 50 * 1024 * 1024; // 50MB
      
      if (!validTypes.includes(selectedFile.type)) {
        alert('Please select a valid image (JPEG, PNG) or video (MP4) file');
        return;
      }
      
      if (selectedFile.size > maxSize) {
        alert('File size exceeds 50MB limit');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || selectedMedia.length === 0) {
      alert('Please select a file and at least one platform');
      return;
    }
    
    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setTimeout(() => setUploadProgress(i), i * 50);
      }
      
      // In a real app, this would:
      // 1. Upload file to your endpoint
      // 2. Endpoint would:
      //    - Validate with Zod
      //    - Upload to S3
      //    - Get platform tokens from DB
      //    - Distribute to selected platforms
      //    - Create post record in DB
      
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      alert('Upload successful! Your content is being distributed to selected platforms.');
      setIsUploadOpen(false);
      setUploadProgress(0);
      setFile(null);
      setSelectedMedia([]);
      setPostCaption('');
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadProgress(0);
      alert('Upload failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Profile Header */}
      <div className="max-w-4xl mx-auto bg-gradient-to-tr from-purple-300 via-blue-400 to-pink-300 rounded-xl shadow-md overflow-hidden p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 relative">
            <img 
              src="https://avatars.githubusercontent.com/u/143197207?v=4" 
              className="rounded-full w-24 h-24 md:w-32 md:h-32 object-cover border-4 border-blue-100"
              alt="Profile"
            />
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full">
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{user.name}</h1>
                <p className="text-gray-600 mt-2">Digital Content Creator | Social Media Strategist</p>
              </div>
              <button className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Edit Profile
              </button>
            </div>
            
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
              {connections.filter(c => c.connected).map(platform => (
                <span 
                  key={platform.id}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  <img src={platform.icon} alt={platform.name} className="w-3 h-3" />
                  {platform.name}
                </span>
              ))}
            </div>
            
            <div className="mt-4 flex justify-between max-w-md">
              <div className="text-center">
                <p className="font-bold text-gray-800">142</p>
                <p className="text-xs text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-800">5.8K</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-800">328</p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-800">1.2M</p>
                <p className="text-xs text-gray-500">Views</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Connections */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Social Media Connections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {connections.map((platform) => (
            <div 
              key={platform.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                platform.connected ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <img 
                  src={platform.icon} 
                  alt={platform.name} 
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <p className="font-medium text-gray-800">{platform.name}</p>
                  <p className="text-xs text-gray-500">
                    {platform.connected ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              
              {platform.connected ? (
                <button
                  onClick={() => handleDisconnect(platform.id)}
                  className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded-md hover:bg-red-50"
                >
                 { isDisconnecting !== platform.id ? "Disconnect" : "Disconnecting..."}
                </button>
              ) : (
                <button
                  onClick={() => platform.authUrl()}
                  disabled={isConnecting === platform.id}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${
                    isConnecting === platform.id 
                      ? 'bg-blue-300 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isConnecting === platform.id ? (
                    'Connecting...'
                  ) : (
                    <>
                      Connect <ArrowRightIcon className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">How connecting works</h3>
          <p className="text-sm text-blue-700">
            You'll be redirected to the platform to authorize access. We only request minimum permissions
            needed to share your content. Your credentials are never stored directly.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex border-b border-gray-200 w-full">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === 'posts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('reels')}
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === 'reels' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Reels
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === 'videos' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Videos
            </button>
          </div>
          
          <button
            onClick={() => setIsUploadOpen(true)}
            className="ml-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
          >
            <PlusIcon className="h-5 w-5" />
            New Post
          </button>
        </div>

        {activeTab === 'posts' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {mockPosts.filter(p => p.type === 'image').map((post) => (
              <div key={post.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative group">
                <img 
                  src={post.thumbnail} 
                  alt={`Post ${post.id}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex flex-wrap justify-center gap-1 max-w-[80%]">
                    {post.platforms.map(platform => (
                      <img 
                        key={platform} 
                        src={`/icons/${platform}.svg`} 
                        alt={platform} 
                        className="w-5 h-5 bg-white p-0.5 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {mockPosts.filter(p => p.type === 'reel').map((post) => (
              <div key={post.id} className="aspect-[9/16] bg-gray-200 rounded-lg overflow-hidden relative group">
                <img 
                  src={post.thumbnail} 
                  alt={`Reel ${post.id}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  0:15
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {mockPosts.filter(p => p.type === 'video').map((post) => (
              <div key={post.id} className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative group">
                <img 
                  src={post.thumbnail} 
                  alt={`Video ${post.id}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  2:45
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Post</h3>
              <button
                onClick={() => {
                  setIsUploadOpen(false);
                  setUploadProgress(0);
                  setFile(null);
                  setSelectedMedia([]);
                  setPostCaption('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
              {file ? (
                <div className="flex flex-col items-center">
                  {file.type.startsWith('image/') ? (
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="Preview" 
                      className="max-h-60 rounded-lg mb-2"
                    />
                  ) : (
                    <div className="bg-gray-100 w-full h-40 flex items-center justify-center rounded-lg mb-2">
                      <span className="text-gray-500">Video file selected</span>
                    </div>
                  )}
                  <p className="font-medium truncate max-w-full">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button
                    onClick={() => setFile(null)}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div>
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Drag and drop files here or click to browse</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    id="file-upload"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,video/mp4"
                  />
                  <label 
                    htmlFor="file-upload"
                    className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer text-sm"
                  >
                    Select File
                  </label>
                </div>
              )}
            </div>

            {/* Caption */}
            <div className="mb-4">
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
                Caption
              </label>
              <textarea
                id="caption"
                rows={3}
                value={postCaption}
                onChange={(e) => setPostCaption(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write a caption..."
              />
            </div>

            {/* Platform Selection */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Select Platforms</h4>
              {connections.filter(c => c.connected).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {connections.filter(c => c.connected).map(platform => (
                    <button
                      key={platform.id}
                      onClick={() => handleMediaSelect(platform.id)}
                      disabled={uploadProgress > 0}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        selectedMedia.includes(platform.id) 
                          ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      } ${uploadProgress > 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <img src={platform.icon} alt={platform.name} className="w-4 h-4" />
                      {platform.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No connected platforms. Please connect at least one social media account above.
                </p>
              )}
            </div>

            {/* Progress Bar */}
            {uploadProgress > 0 && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-500 mt-1">
                  {uploadProgress}% {uploadProgress === 100 ? 'Finalizing...' : 'Uploading...'}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsUploadOpen(false);
                  setUploadProgress(0);
                  setFile(null);
                  setSelectedMedia([]);
                  setPostCaption('');
                }}
                disabled={uploadProgress > 0}
                className={`px-4 py-2 rounded-lg ${
                  uploadProgress > 0 ? 'text-gray-500 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || selectedMedia.length === 0 || uploadProgress > 0}
                className={`px-4 py-2 rounded-lg text-white ${
                  (!file || selectedMedia.length === 0 || uploadProgress > 0) 
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {uploadProgress > 0 ? 'Uploading...' : 'Share Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}