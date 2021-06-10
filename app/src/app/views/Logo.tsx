import React, { memo, useRef } from 'react'
import { Defs, Ellipse, G, Mask, Path, Svg, Use } from 'react-native-svg'
import { useTheme } from 'snackui'

import { logoHeight, logoWidth, logoXsHeight, logoXsWidth } from '../../constants/constants'

export const LogoColor = ({ scale = 1, color }: { scale?: number; color?: string }) => {
  const theme = useTheme()
  return (
    <Svg width={logoWidth * scale} height={logoHeight * scale} viewBox={`0 0 1303 608`}>
      <G transform="translate(-124.000000, -446.000000)">
        <Path
          d="M876.7372,593.757576 C919.615653,593.757576 983.578863,614.039619 1008.18392,673.737093 C988.88072,692.680667 962.429798,704.360269 933.250958,704.360269 C932.585593,704.360269 931.921646,704.354196 931.259171,704.342102 C923.859926,680.693979 894.462723,678.440604 879.517309,678.440604 C862.833388,678.440604 841.644672,687.907856 841.644672,707.118695 C841.644672,719.66283 853.853685,725.486938 879.471138,725.486938 C954.204976,725.486938 1013.58151,748.731894 1014.73198,814.012577 L1014.74943,815.994621 C1014.74943,882.189485 960.128997,932.323232 879.471138,932.323232 C823.599236,932.323232 768.797717,895.452364 748.730037,849.010645 C767.868459,827.814808 794.961236,814.205387 825.000193,814.205387 C827.639477,814.205387 830.256017,814.302938 832.846417,814.494638 C836.675777,834.551862 860.486979,842.797607 878.691029,842.797607 C898.544922,842.797607 919.563666,835.517291 919.563666,815.276918 C919.563666,801.4938 905.019423,796.951388 880.51785,796.06808 L879.7372,796.07895 C808.505994,796.07895 746.626823,773.66372 745.476363,708.383037 L745.458909,706.400992 C745.458909,644.206129 806.786486,593.757576 876.7372,593.757576 Z"
          fill={color || theme.color || '#FFB926'}
        />
        <Path
          d="M640.547594,530.461279 C657.595477,530.461279 673.712174,534.448157 688.016164,541.54039 L688.016164,851.382169 C673.712174,858.474402 657.595477,862.461279 640.547594,862.461279 C623.570716,862.461279 607.517283,858.507544 593.257848,851.470625 L593.257848,541.451933 C607.517283,534.415015 623.570716,530.461279 640.547594,530.461279 Z"
          fill={color || theme.color || '#29ACEE'}
        />
        <Path
          d="M1117.20287,474.888889 C1133.98215,474.888889 1149.86337,478.732623 1164.01351,485.587335 L1164.01302,680.560104 C1180.30664,673.925755 1198.01363,670.152058 1216.5431,669.844307 L1219.00631,669.823865 C1300.44806,669.823865 1366.62384,736.77864 1367.93922,819.884706 L1367.94857,821.201889 L1367.87857,821.201889 L1367.34426,1007.02952 C1353.11103,1013.98497 1337.11301,1017.88889 1320.20287,1017.88889 C1303.47045,1017.88889 1287.63107,1014.06659 1273.51081,1007.24779 L1273.99957,821.202889 L1273.99938,821.20363 C1274.00399,820.904821 1274.00631,820.605444 1274.00631,820.305517 C1274.00631,789.377571 1249.38197,764.305517 1219.00631,764.305517 C1188.89635,764.305517 1164.43754,788.940864 1164.01195,819.495266 L1164.01257,821.089889 L1164.01417,821.202865 L1164.01257,821.201889 L1164.01403,971.668225 C1150.11718,978.223517 1134.58822,981.888889 1118.20287,981.888889 C1100.74704,981.888889 1084.26315,977.728941 1069.6891,970.346648 L1069.68973,485.930828 C1084.01591,478.86116 1100.14535,474.888889 1117.20287,474.888889 Z"
          fill={color || theme.color || '#C03EFF'}
        />
        <Path
          d="M469.617244,476.147568 C486.235833,476.147568 501.973486,479.928209 516.020872,486.678247 L516.016532,838.939131 C519.489906,878.522803 552.156313,909.732267 592.35695,910.908722 C596.258446,922.023963 598.379079,933.975242 598.379079,946.420569 C598.379079,968.607427 591.640566,989.223602 580.093951,1006.34265 C538.177109,1002.87477 500.452332,984.636564 472.13649,956.845109 C440.208122,993.112099 393.398868,1016 341.235734,1016 C245.007889,1016 166.999807,938.110279 166.999807,842.028438 C166.999807,745.946597 245.007889,668.056876 341.235734,668.056876 C370.099293,668.056876 397.323617,675.064622 421.295227,687.469082 L421.294023,487.62441 C435.821133,480.282483 452.237445,476.147568 469.617244,476.147568 Z M341.235734,761.262044 C297.605239,761.262044 262.235734,796.631549 262.235734,840.262044 C262.235734,883.89254 297.605239,919.262044 341.235734,919.262044 C384.86623,919.262044 420.235734,883.89254 420.235734,840.262044 C420.235734,796.631549 384.86623,761.262044 341.235734,761.262044 Z"
          fill={color || theme.color || '#F4348E'}
        />
      </G>
    </Svg>
  )
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

// export const Logo = (props: { scale?: number; color?: string }) => {
//   const { color } = useSearchBarTheme()
//   const scale = props.scale ?? 1
//   return (
//     <VStack scale={scale}>
//       <Svg width={logoWidth} height={logoHeight} viewBox={`0 0 1201 544`}>
//         <G stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
//           <G transform="translate(-167.000000, -474.000000)" fill={props.color ?? color ?? '#fff'}>
//             <G transform="translate(167.000000, 474.000000)">
//               <G>
//                 <Path d="M709.7372,119.757576 C752.615653,119.757576 816.578863,140.039619 841.18392,199.737093 C821.88072,218.680667 795.429798,230.360269 766.250958,230.360269 C765.585593,230.360269 764.921646,230.354196 764.259171,230.342102 C756.859926,206.693979 727.462723,204.440604 712.517309,204.440604 C695.833388,204.440604 674.644672,213.907856 674.644672,233.118695 C674.644672,245.66283 686.853685,251.486938 712.471138,251.486938 C787.204976,251.486938 846.581515,274.731894 847.731975,340.012577 L847.749429,341.994621 C847.749429,408.189485 793.128997,458.323232 712.471138,458.323232 C656.599236,458.323232 601.797717,421.452364 581.730037,375.010645 C600.868459,353.814808 627.961236,340.205387 658.000193,340.205387 C660.639477,340.205387 663.256017,340.302938 665.846417,340.494638 C669.675777,360.551862 693.486979,368.797607 711.691029,368.797607 C731.544922,368.797607 752.563666,361.517291 752.563666,341.276918 C752.563666,327.4938 738.019423,322.951388 713.51785,322.06808 L712.7372,322.07895 C641.505994,322.07895 579.626823,299.66372 578.476363,234.383037 L578.458909,232.400992 C578.458909,170.206129 639.786486,119.757576 709.7372,119.757576 Z"></Path>
//                 <Path d="M473.547594,56.4612795 C490.199797,56.4612795 505.963539,60.2652348 520.017264,67.0515899 L520.017264,377.870969 C505.963539,384.657324 490.199797,388.461279 473.547594,388.461279 C456.967454,388.461279 441.268102,384.690176 427.260474,377.958906 L427.260474,66.9636527 C441.268102,60.2323825 456.967454,56.4612795 473.547594,56.4612795 Z"></Path>
//                 <Path d="M950.202875,0.888888889 C966.981755,0.888888889 982.862623,4.73244102 997.012504,11.5868492 L997.012026,206.56051 C1013.30592,199.925909 1031.01325,196.152065 1049.5431,195.844307 L1052.00631,195.823865 C1133.44806,195.823865 1199.62384,262.77864 1200.93922,345.884706 L1200.9491,347.201889 L1200.8781,347.201889 L1200.34426,533.029515 C1186.11103,539.984967 1170.11301,543.888889 1153.20287,543.888889 C1136.47045,543.888889 1120.63107,540.066589 1106.51081,533.247789 L1107,347.101383 L1107.0001,347.100889 L1107.00457,346.754993 C1107.00573,346.605307 1107.00631,346.45548 1107.00631,346.305517 C1107.00631,315.377571 1082.38197,290.305517 1052.00631,290.305517 C1021.8911,290.305517 997.429016,314.949453 997.011729,345.511244 L997.012104,346.977889 L997.014172,347.202865 L997.012104,347.201889 L997.013026,497.668697 C983.116437,504.223693 967.587826,507.888889 951.202875,507.888889 C933.747228,507.888889 917.263495,503.729029 902.689566,496.346882 L902.689889,11.9307468 C917.016033,4.86112965 933.145415,0.888888889 950.202875,0.888888889 Z"></Path>
//                 <Path d="M302.617244,2.14756837 C319.235833,2.14756837 334.973486,5.92820852 349.020872,12.6782471 L349.016532,364.939131 C352.489906,404.522803 385.156313,435.732267 425.35695,436.908722 C429.258446,448.023963 431.379079,459.975242 431.379079,472.420569 C431.379079,494.607427 424.640566,515.223602 413.093951,532.342647 C371.177109,528.874772 333.452332,510.636564 305.13649,482.845109 C273.208122,519.112099 226.398868,542 174.235734,542 C78.0078886,542 -0.000193361922,464.110279 -0.000193361922,368.028438 C-0.000193361922,271.946597 78.0078886,194.056876 174.235734,194.056876 C203.099293,194.056876 230.323617,201.064622 254.295227,213.469082 L254.294023,13.6244096 C268.821133,6.28248273 285.237445,2.14756837 302.617244,2.14756837 Z M174.235734,287.262044 C130.605239,287.262044 95.2357344,322.631549 95.2357344,366.262044 C95.2357344,409.89254 130.605239,445.262044 174.235734,445.262044 C217.86623,445.262044 253.235734,409.89254 253.235734,366.262044 C253.235734,322.631549 217.86623,287.262044 174.235734,287.262044 Z"></Path>
//               </G>
//             </G>
//           </G>
//         </G>
//       </Svg>
//     </VStack>
//   )
// }
