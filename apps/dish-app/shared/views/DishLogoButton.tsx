import { AbsoluteVStack, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { G, Path, Svg } from 'react-native-svg'

import { useIsReallyNarrow } from '../hooks/useIs'
import { useSearchBarTheme } from '../hooks/useSearchBarTheme'
import { omStatic } from '../state/omStatic'
import { LinkButton } from './ui/LinkButton'
import { LinkButtonProps } from './ui/LinkProps'

const linkButtonProps: LinkButtonProps = {
  className: 'ease-in-out-fast',
  opacity: 0,
  name: 'home',
  hoverStyle: {
    transform: [{ scale: 1.05 }],
  },
  pressStyle: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
}

const styles = {
  default: { width: 1201 * 0.061, height: 544 * 0.061 },
  reallySmall: { width: 723 * 0.044, height: 898 * 0.044 },
}

export const DishLogoButton = memo(() => {
  const isReallySmall = useIsReallyNarrow()
  return (
    <VStack
      className="ease-in-out-faster"
      width={isReallySmall ? styles.reallySmall.width : styles.default.width}
      height={styles.default.height}
      onPress={() => {
        if (omStatic.state.home.currentStateType === 'home') {
          // already on home
        }
      }}
    >
      <LinkButton
        {...linkButtonProps}
        {...styles.default}
        opacity={isReallySmall ? 0 : 1}
        pointerEvents={isReallySmall ? 'none' : 'auto'}
      >
        <Logo />
      </LinkButton>
      <AbsoluteVStack
        pointerEvents="none"
        fullscreen
        alignItems="center"
        justifyContent="center"
        zIndex={-1}
      >
        <LinkButton
          {...linkButtonProps}
          {...styles.reallySmall}
          opacity={!isReallySmall ? 0 : 1}
        >
          <LogoSmall />
        </LinkButton>
      </AbsoluteVStack>
    </VStack>
  )
})

const Logo = () => {
  const { isSmall, color } = useSearchBarTheme()
  const scale = isSmall ? 0.9 : 1.025

  return (
    <VStack transform={[{ scale }]}>
      <Svg {...styles.default} viewBox="0 0 1201 544">
        <G stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <G transform="translate(-167.000000, -474.000000)" fill={color}>
            <G transform="translate(167.000000, 474.000000)">
              <G>
                <Path d="M709.7372,119.757576 C752.615653,119.757576 816.578863,140.039619 841.18392,199.737093 C821.88072,218.680667 795.429798,230.360269 766.250958,230.360269 C765.585593,230.360269 764.921646,230.354196 764.259171,230.342102 C756.859926,206.693979 727.462723,204.440604 712.517309,204.440604 C695.833388,204.440604 674.644672,213.907856 674.644672,233.118695 C674.644672,245.66283 686.853685,251.486938 712.471138,251.486938 C787.204976,251.486938 846.581515,274.731894 847.731975,340.012577 L847.749429,341.994621 C847.749429,408.189485 793.128997,458.323232 712.471138,458.323232 C656.599236,458.323232 601.797717,421.452364 581.730037,375.010645 C600.868459,353.814808 627.961236,340.205387 658.000193,340.205387 C660.639477,340.205387 663.256017,340.302938 665.846417,340.494638 C669.675777,360.551862 693.486979,368.797607 711.691029,368.797607 C731.544922,368.797607 752.563666,361.517291 752.563666,341.276918 C752.563666,327.4938 738.019423,322.951388 713.51785,322.06808 L712.7372,322.07895 C641.505994,322.07895 579.626823,299.66372 578.476363,234.383037 L578.458909,232.400992 C578.458909,170.206129 639.786486,119.757576 709.7372,119.757576 Z"></Path>
                <Path d="M473.547594,56.4612795 C490.199797,56.4612795 505.963539,60.2652348 520.017264,67.0515899 L520.017264,377.870969 C505.963539,384.657324 490.199797,388.461279 473.547594,388.461279 C456.967454,388.461279 441.268102,384.690176 427.260474,377.958906 L427.260474,66.9636527 C441.268102,60.2323825 456.967454,56.4612795 473.547594,56.4612795 Z"></Path>
                <Path d="M950.202875,0.888888889 C966.981755,0.888888889 982.862623,4.73244102 997.012504,11.5868492 L997.012026,206.56051 C1013.30592,199.925909 1031.01325,196.152065 1049.5431,195.844307 L1052.00631,195.823865 C1133.44806,195.823865 1199.62384,262.77864 1200.93922,345.884706 L1200.9491,347.201889 L1200.8781,347.201889 L1200.34426,533.029515 C1186.11103,539.984967 1170.11301,543.888889 1153.20287,543.888889 C1136.47045,543.888889 1120.63107,540.066589 1106.51081,533.247789 L1107,347.101383 L1107.0001,347.100889 L1107.00457,346.754993 C1107.00573,346.605307 1107.00631,346.45548 1107.00631,346.305517 C1107.00631,315.377571 1082.38197,290.305517 1052.00631,290.305517 C1021.8911,290.305517 997.429016,314.949453 997.011729,345.511244 L997.012104,346.977889 L997.014172,347.202865 L997.012104,347.201889 L997.013026,497.668697 C983.116437,504.223693 967.587826,507.888889 951.202875,507.888889 C933.747228,507.888889 917.263495,503.729029 902.689566,496.346882 L902.689889,11.9307468 C917.016033,4.86112965 933.145415,0.888888889 950.202875,0.888888889 Z"></Path>
                <Path d="M302.617244,2.14756837 C319.235833,2.14756837 334.973486,5.92820852 349.020872,12.6782471 L349.016532,364.939131 C352.489906,404.522803 385.156313,435.732267 425.35695,436.908722 C429.258446,448.023963 431.379079,459.975242 431.379079,472.420569 C431.379079,494.607427 424.640566,515.223602 413.093951,532.342647 C371.177109,528.874772 333.452332,510.636564 305.13649,482.845109 C273.208122,519.112099 226.398868,542 174.235734,542 C78.0078886,542 -0.000193361922,464.110279 -0.000193361922,368.028438 C-0.000193361922,271.946597 78.0078886,194.056876 174.235734,194.056876 C203.099293,194.056876 230.323617,201.064622 254.295227,213.469082 L254.294023,13.6244096 C268.821133,6.28248273 285.237445,2.14756837 302.617244,2.14756837 Z M174.235734,287.262044 C130.605239,287.262044 95.2357344,322.631549 95.2357344,366.262044 C95.2357344,409.89254 130.605239,445.262044 174.235734,445.262044 C217.86623,445.262044 253.235734,409.89254 253.235734,366.262044 C253.235734,322.631549 217.86623,287.262044 174.235734,287.262044 Z"></Path>
              </G>
            </G>
          </G>
        </G>
      </Svg>
    </VStack>
  )
}

const LogoSmall = () => {
  const { isSmall, color } = useSearchBarTheme()
  const scale = isSmall ? 0.8 : 1

  return (
    <VStack transform={[{ scale }]}>
      <Svg {...styles.reallySmall} viewBox="0 0 723 898">
        <G stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <G transform="translate(-342.000000, -229.000000)" fill={color}>
            <G transform="translate(342.000000, 229.000000)">
              <Path d="M518.627813,0 C541.817561,0 564.367998,2.7384713 585.97366,7.90980987 L585.979804,583.732957 C586.478747,590.721128 586.732492,597.777052 586.732492,604.89219 L586.713755,606.814349 C596.081684,675.935556 651.928991,730.274872 721.714858,737.260044 C723.810659,759.324402 723.377996,781.987769 720.160555,804.901897 C716.677249,829.709474 710.137306,853.334016 700.975041,875.448098 C632.176936,867.0004 570.789332,834.673072 525.386553,787.029065 L524.212765,785.788017 C470.503692,854.111691 387.06482,898 293.366246,898 C131.344542,898 0,766.771164 0,604.89219 C0,443.013217 131.344542,311.78438 293.366246,311.78438 C348.860041,311.78438 400.755037,327.179098 445.006383,353.927248 L445.000203,9.48871563 C468.503836,3.29750809 493.180914,0 518.627813,0 Z M293.366246,449.397418 C209.231582,449.397418 141.026961,517.682387 141.026961,601.916165 C141.026961,686.149943 209.231582,754.434912 293.366246,754.434912 C376.206401,754.434912 443.602947,688.235063 445.657282,605.792747 C445.271574,600.087474 445.056946,594.338092 445.011466,588.548504 L445.008306,587.73462 L445.055584,587.733277 C437.909785,510.14896 372.724309,449.397418 293.366246,449.397418 Z"></Path>
            </G>
          </G>
        </G>
      </Svg>
    </VStack>
  )
}
