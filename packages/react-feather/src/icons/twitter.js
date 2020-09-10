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

const Twitter = (props) => {
  const { color, size, ...otherProps } = props;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      class="feather feather-twitter"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <Path
        d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        class="feather feather-twitter"
      />
    </Svg>
  );
};

Twitter.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Twitter.defaultProps = {
  color: 'black',
  size: '24',
};

export default Twitter;
