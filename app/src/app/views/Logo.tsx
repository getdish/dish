import React, { memo, useRef } from 'react'
import { Defs, Ellipse, G, Mask, Path, Svg, Use } from 'react-native-svg'

import { brandColor } from '../../constants/colors'
import {
  logoHeight,
  logoSmHeight,
  logoSmWidth,
  logoWidth,
  logoXsHeight,
  logoXsWidth,
} from '../../constants/constants'

export const LogoColor = ({ scale = 1, color }: { scale?: number; color?: string }) => {
  return (
    <Svg
      width={logoSmWidth * scale}
      height={logoSmHeight * scale}
      viewBox={`0 0 ${logoWidth} ${logoHeight}`}
      // style={{
      //   margin: -(scale * 14),
      // }}
    >
      <Path
        d="M447.644868,174 C464.26457,174 480.003297,177.781494 494.051704,184.533077 L494.048327,536.890328 C497.151953,572.26877 523.564721,600.95969 557.834665,607.508301 C558.519253,619.789517 557.085627,632.397656 553.276823,644.845287 C546.846443,665.860543 534.547392,683.472479 518.720004,696.439613 C490.687948,687.34907 465.756129,671.375803 445.916414,650.513034 C444.950761,649.497587 443.997172,648.470557 443.055877,647.432173 C411.481241,679.276237 367.672926,699 319.251721,699 C223.015153,699 145,621.088987 145,524.980883 C145,428.872779 223.015153,350.961766 319.251721,350.961766 C348.117898,350.961766 375.344692,357.971429 399.318476,370.379281 L399.316704,185.480263 C413.84527,178.136151 430.26327,174 447.644868,174 Z M319.251721,447.214007 C277.237336,447.214007 243.177948,481.240366 243.177948,523.214007 C243.177948,565.187648 277.237336,599.214007 319.251721,599.214007 C361.266106,599.214007 395.325495,565.187648 395.325495,523.214007 C395.325495,481.240366 361.266106,447.214007 319.251721,447.214007 Z"
        fill={color || '#FFB926' || brandColor}
      />
      <Path
        d="M844.136663,291 C886.969058,291 950.86366,311.308253 975.44192,371.082963 C956.158629,390.050252 929.736499,401.744585 900.589452,401.744585 C899.924847,401.744585 899.261658,401.738505 898.599939,401.726397 C891.20842,378.047923 861.84303,375.791668 846.913773,375.791668 C830.247852,375.791668 809.081994,385.271065 809.081994,404.50655 C809.081994,417.066777 821.277836,422.898356 846.867652,422.898356 C921.520864,422.898356 980.833346,446.173133 981.982565,511.537564 L982,513.522152 C982,579.801936 927.438494,630 846.867652,630 C791.056142,630 736.313856,593.081983 716.267724,546.58082 C735.385033,525.357674 762.448733,511.730622 792.455473,511.730622 C795.091815,511.730622 797.705439,511.828292 800.292954,512.020223 C804.11846,532.1032 827.903974,540.359523 846.088384,540.359523 C865.920858,540.359523 886.916927,533.069867 886.916927,512.803528 C886.916927,499.002728 872.388374,494.454489 847.913235,493.570047 L847.133427,493.580931 C775.979067,493.580931 714.166654,471.136945 713.017435,405.772514 L713,403.787926 C713,341.513274 774.261415,291 844.136663,291 Z"
        fill={color || '#29ACEE' || brandColor}
      />
      <Path
        d="M608.409926,228 C625.900125,228 642.412678,232.175175 657.000478,239.580821 L657.000478,548.419179 C642.412678,555.824825 625.900125,560 608.409926,560 C590.991876,560 574.543423,555.859199 560,548.51066 L560,239.48934 C574.543423,232.140801 590.991876,228 608.409926,228 Z"
        fill={color || '#C03EFF' || brandColor}
      />
      <Path
        d="M1078.48064,173 C1096.44537,173 1113.37996,177.41209 1128.26064,185.212142 L1128.25753,376.026161 C1145.28885,369.190533 1163.82501,365.438404 1183.21476,365.438404 C1265.77581,365.438404 1332.63216,433.465825 1333.96104,517.903289 L1333.972,519.212 L1333.98581,519.212494 L1333.45931,702.525165 C1318.0247,711.110081 1300.25389,716 1281.34137,716 C1265.01398,716 1249.5375,712.355512 1235.68053,705.835387 L1236.17038,519.212494 L1236.185,519.212 L1236.20726,518.340803 C1236.21225,518.032651 1236.21476,517.723884 1236.21476,517.41452 C1236.21476,487.033261 1212.03813,462.404384 1182.21476,462.404384 C1153.12043,462.404384 1129.40016,485.84384 1128.25783,515.197037 L1128.26008,668.305208 C1113.62256,675.782729 1097.04358,680 1079.47995,680 C1062.03609,680 1045.56351,675.840052 1030.99946,668.457759 L1031.00025,184.041858 C1045.31656,176.972241 1061.43488,173 1078.48064,173 Z"
        fill={color || '#F4348E' || brandColor}
      />
    </Svg>
  )

  // return (
  //   <Svg width={logoWidth * scale} height={logoHeight * scale} viewBox={`0 0 1303 608`}>
  //     <G transform="translate(-124.000000, -446.000000)">
  //       <Path
  //         d="M876.7372,593.757576 C919.615653,593.757576 983.578863,614.039619 1008.18392,673.737093 C988.88072,692.680667 962.429798,704.360269 933.250958,704.360269 C932.585593,704.360269 931.921646,704.354196 931.259171,704.342102 C923.859926,680.693979 894.462723,678.440604 879.517309,678.440604 C862.833388,678.440604 841.644672,687.907856 841.644672,707.118695 C841.644672,719.66283 853.853685,725.486938 879.471138,725.486938 C954.204976,725.486938 1013.58151,748.731894 1014.73198,814.012577 L1014.74943,815.994621 C1014.74943,882.189485 960.128997,932.323232 879.471138,932.323232 C823.599236,932.323232 768.797717,895.452364 748.730037,849.010645 C767.868459,827.814808 794.961236,814.205387 825.000193,814.205387 C827.639477,814.205387 830.256017,814.302938 832.846417,814.494638 C836.675777,834.551862 860.486979,842.797607 878.691029,842.797607 C898.544922,842.797607 919.563666,835.517291 919.563666,815.276918 C919.563666,801.4938 905.019423,796.951388 880.51785,796.06808 L879.7372,796.07895 C808.505994,796.07895 746.626823,773.66372 745.476363,708.383037 L745.458909,706.400992 C745.458909,644.206129 806.786486,593.757576 876.7372,593.757576 Z"
  //         fill={'#fff' || color || themeColor || '#FFB926'}
  //       />
  //       <Path
  //         d="M640.547594,530.461279 C657.595477,530.461279 673.712174,534.448157 688.016164,541.54039 L688.016164,851.382169 C673.712174,858.474402 657.595477,862.461279 640.547594,862.461279 C623.570716,862.461279 607.517283,858.507544 593.257848,851.470625 L593.257848,541.451933 C607.517283,534.415015 623.570716,530.461279 640.547594,530.461279 Z"
  //         fill={color || themeColor || '#29ACEE'}
  //       />
  //       <Path
  //         d="M1117.20287,474.888889 C1133.98215,474.888889 1149.86337,478.732623 1164.01351,485.587335 L1164.01302,680.560104 C1180.30664,673.925755 1198.01363,670.152058 1216.5431,669.844307 L1219.00631,669.823865 C1300.44806,669.823865 1366.62384,736.77864 1367.93922,819.884706 L1367.94857,821.201889 L1367.87857,821.201889 L1367.34426,1007.02952 C1353.11103,1013.98497 1337.11301,1017.88889 1320.20287,1017.88889 C1303.47045,1017.88889 1287.63107,1014.06659 1273.51081,1007.24779 L1273.99957,821.202889 L1273.99938,821.20363 C1274.00399,820.904821 1274.00631,820.605444 1274.00631,820.305517 C1274.00631,789.377571 1249.38197,764.305517 1219.00631,764.305517 C1188.89635,764.305517 1164.43754,788.940864 1164.01195,819.495266 L1164.01257,821.089889 L1164.01417,821.202865 L1164.01257,821.201889 L1164.01403,971.668225 C1150.11718,978.223517 1134.58822,981.888889 1118.20287,981.888889 C1100.74704,981.888889 1084.26315,977.728941 1069.6891,970.346648 L1069.68973,485.930828 C1084.01591,478.86116 1100.14535,474.888889 1117.20287,474.888889 Z"
  //         fill={color || themeColor || '#C03EFF'}
  //       />
  //       <Path
  //         d="M469.617244,476.147568 C486.235833,476.147568 501.973486,479.928209 516.020872,486.678247 L516.016532,838.939131 C519.489906,878.522803 552.156313,909.732267 592.35695,910.908722 C596.258446,922.023963 598.379079,933.975242 598.379079,946.420569 C598.379079,968.607427 591.640566,989.223602 580.093951,1006.34265 C538.177109,1002.87477 500.452332,984.636564 472.13649,956.845109 C440.208122,993.112099 393.398868,1016 341.235734,1016 C245.007889,1016 166.999807,938.110279 166.999807,842.028438 C166.999807,745.946597 245.007889,668.056876 341.235734,668.056876 C370.099293,668.056876 397.323617,675.064622 421.295227,687.469082 L421.294023,487.62441 C435.821133,480.282483 452.237445,476.147568 469.617244,476.147568 Z M341.235734,761.262044 C297.605239,761.262044 262.235734,796.631549 262.235734,840.262044 C262.235734,883.89254 297.605239,919.262044 341.235734,919.262044 C384.86623,919.262044 420.235734,883.89254 420.235734,840.262044 C420.235734,796.631549 384.86623,761.262044 341.235734,761.262044 Z"
  //         fill={color || themeColor || '#F4348E'}
  //       />
  //     </G>
  //   </Svg>
  // )
}

export const LogoCircle = memo(() => {
  const id = useRef(`dish-${Math.round(Math.random() * 10000000)}`).current
  const maskID = `mask-${id}`
  const pathID = `path-${id}`

  return (
    <Svg width={logoXsWidth} height={logoXsHeight} viewBox="0 0 1024 1024">
      <Defs>
        <Path
          d="M624.856059,57.4818247 L642.37358,62.1756303 C739.460043,88.1898698 812.439261,127.589272 868.133607,179.776687 C923.827953,231.964102 961.177574,296.655543 978.526028,370.981969 C995.874482,445.308395 993.505757,528.209953 967.491517,625.296417 L962.983829,642.119339 C936.969589,739.205802 897.570187,812.185021 845.382772,867.879366 C793.195357,923.573712 728.503915,960.923333 654.17749,978.271787 C579.851064,995.620242 496.949506,993.251516 399.863042,967.237276 L382.345522,962.543471 C285.259058,936.529231 212.27984,897.129829 156.585494,844.942414 C100.891148,792.754999 63.5415275,728.063558 46.1930731,653.737132 C28.8446188,579.410706 31.2133446,496.509148 57.2275841,399.422685 L61.7352726,382.599762 C87.7495121,285.513299 127.148914,212.53408 179.336329,156.839735 C231.523744,101.145389 296.215186,63.7957681 370.541611,46.4473138 C444.868037,29.0988594 527.769595,31.4675852 624.856059,57.4818247 Z M610.511029,186.666667 C594.84123,186.666667 579.602284,188.514984 564.999508,192.005899 L564.999508,192.005899 L565.003062,423.212772 C534.771833,405.097721 499.287196,394.666667 461.333333,394.666667 C350.876383,394.666667 261.333333,483.015809 261.333333,592 C261.333333,700.984191 350.876383,789.333333 461.333333,789.333333 C524.652687,789.333333 581.099428,760.300515 617.741158,714.988115 C618.500223,715.803327 619.26614,716.612216 620.038819,717.414693 C650.106304,748.64172 690.412354,770.159099 735.644477,776.716731 C741.021919,762.86419 744.898974,748.174711 747.052162,732.817027 C749.432821,715.836871 749.563159,699.059657 747.670563,682.790784 C700.624184,674.997841 664.292029,635.867629 661.288858,587.796551 C661.248817,585.905964 661.181827,584.021915 661.088253,582.144761 L661.088253,582.144761 L661.083091,581.574331 L661.087804,582.135744 C661.075173,581.882601 661.062059,581.629584 661.048463,581.376693 L661.006226,580.618399 L661.001522,193.266182 C644.895611,188.961364 627.970773,186.666667 610.511029,186.666667 Z M461.333333,487.31394 C516.707336,487.31394 561.95951,530.160937 565.019954,584.152415 C565.047547,586.100418 565.103692,588.041602 565.187994,589.975577 L565.187994,589.975577 L565.189374,589.996406 C565.189374,646.706366 518.691441,692.678872 461.333333,692.678872 C403.975226,692.678872 357.477292,646.706366 357.477292,589.996406 C357.477292,533.286446 403.975226,487.31394 461.333333,487.31394 Z"
          id={pathID}
        />
      </Defs>
      <G id="icon" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <Mask id={maskID} fill="white">
          <Use xlinkHref={`#${pathID}`}></Use>
        </Mask>
        <Use id="Mask-2" fill="#FFFFFF" xlinkHref={`#${pathID}`}></Use>
        <G id="Group" mask={`url(#${maskID})`}>
          <G transform="translate(541.747191, 549.056180) rotate(-50.000000) translate(-541.747191, -549.056180) translate(-132.752809, -123.443820)">
            <Ellipse fill="#29ACEE" cx="388.752809" cy="395.94382" rx="388" ry="387.5"></Ellipse>
            <Ellipse fill="#F4348E" cx="960.752809" cy="387.94382" rx="388" ry="387.5"></Ellipse>
            <Path
              d="M671.058299,130.44391 C736.595966,199.801809 776.752809,293.214706 776.752809,395.967847 C776.752809,494.797625 739.603992,584.986808 678.453628,653.442638 C612.909645,584.081195 572.752809,490.668305 572.752809,387.915173 C572.752809,289.46153 609.619396,199.582837 670.354839,131.222932 Z"
              fill="#29ACEE"
              opacity="0.632928757"
            ></Path>
            <Ellipse fill="#FFB926" cx="412.752809" cy="933.94382" rx="388" ry="387.5"></Ellipse>
            <Path
              d="M413.172765,545.44382 C516.409927,545.44382 610.231231,585.779669 679.752829,651.559479 C608.637974,732.423483 504.439987,783.44382 388.331994,783.44382 C285.095246,783.44382 191.274279,743.108294 121.752764,677.32895 C192.866786,596.464158 297.064773,545.44382 413.172765,545.44382 Z"
              fill="#29ACEE"
              opacity="0.368675595"
            ></Path>
            <Ellipse fill="#C03EFF" cx="873.752809" cy="956.94382" rx="388" ry="387.5"></Ellipse>
            <Path
              d="M658.667601,634.444222 C745.402614,705.54462 800.752809,813.568574 800.752809,934.530927 C800.752809,1069.26952 732.077174,1187.95481 627.84737,1257.43802 L627.838017,1257.44342 C541.103004,1186.34302 485.752809,1078.31907 485.752809,957.356713 C485.752809,824.600899 552.422095,707.429381 654.080005,637.548968 Z"
              fill="#FFB926"
              opacity="0.579194568"
            ></Path>
            <Path
              d="M872.565662,568.44382 C994.053786,568.44382 1102.51689,624.159665 1173.75279,711.411255 L1173.74888,711.423007 C1112.42163,751.887794 1038.93421,775.44382 959.939956,775.44382 C838.451832,775.44382 729.988729,719.727976 658.752832,632.476385 L658.757103,632.464395 C720.084281,591.999754 793.571567,568.44382 872.565662,568.44382 Z"
              fill="#F4348E"
              opacity="0.524158296"
            ></Path>
          </G>
        </G>
      </G>
    </Svg>
  )
})
