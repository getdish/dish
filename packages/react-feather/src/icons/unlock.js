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

const Unlock = (props) => {
  const { color, size, ...otherProps } = props;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      class="feather feather-unlock"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <Rect
        x="3"
        y="11"
        width="18"
        height="11"
        rx="2"
        ry="2"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        class="feather feather-unlock"
      />
      <Path
        d="M7 11V7a5 5 0 0 1 9.9-1"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        class="feather feather-unlock"
      />
    </Svg>
  );
};

Unlock.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Unlock.defaultProps = {
  color: 'black',
  size: '24',
};

export default Unlock;
