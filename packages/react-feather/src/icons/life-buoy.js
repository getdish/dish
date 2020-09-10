import React from 'react';
import PropTypes from 'prop-types';
import {
  Svg,
  Circle as _Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text,
  Use,
  Defs,
  Stop,
} from 'react-native-svg';

const LifeBuoy = (props) => {
  const { color, size, ...otherProps } = props;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      class="feather feather-life-buoy"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <_Circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        class="feather feather-life-buoy"
      />
      <_Circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        class="feather feather-life-buoy"
      />
      <Line
        x1="4.93"
        y1="4.93"
        x2="9.17"
        y2="9.17"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        class="feather feather-life-buoy"
      />
      <Line
        x1="14.83"
        y1="14.83"
        x2="19.07"
        y2="19.07"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        class="feather feather-life-buoy"
      />
      <Line
        x1="14.83"
        y1="9.17"
        x2="19.07"
        y2="4.93"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        class="feather feather-life-buoy"
      />
      <Line
        x1="14.83"
        y1="9.17"
        x2="18.36"
        y2="5.64"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        class="feather feather-life-buoy"
      />
      <Line
        x1="4.93"
        y1="19.07"
        x2="9.17"
        y2="14.83"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        class="feather feather-life-buoy"
      />
    </Svg>
  );
};

LifeBuoy.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

LifeBuoy.defaultProps = {
  color: 'black',
  size: '24',
};

export default LifeBuoy;
