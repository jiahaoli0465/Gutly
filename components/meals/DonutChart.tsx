import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

interface DonutChartProps {
  data: Array<{
    value: number;
    color: string;
    name: string;
  }>;
  radius?: number;
  strokeWidth?: number;
  centerText?: string;
  centerSubText?: string;
  textColor?: string;
  subTextColor?: string;
}

/**
 * A reusable donut chart component for React Native
 */
export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  radius = 70,
  strokeWidth = 15,
  centerText,
  centerSubText,
  textColor = '#000',
  subTextColor = '#666',
}) => {
  // Calculate total value
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Calculate inner radius
  const innerRadius = radius - strokeWidth;

  // Calculate the center of the SVG
  const center = radius;

  // Generate the SVG paths for the donut segments
  const generateSegments = () => {
    if (total === 0) {
      // If total is 0, just draw an empty circle
      return (
        <Circle
          cx={center}
          cy={center}
          r={innerRadius + strokeWidth / 2}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
        />
      );
    }

    let segments: React.ReactElement[] = [];
    let currentAngle = 0;

    // Calculate and create a path for each data point
    data.forEach((item, index) => {
      if (item.value === 0) return;

      // Calculate the angle for this segment
      const segmentAngle = (item.value / total) * 360;

      // Calculate start and end angles in radians
      const startAngle = (currentAngle * Math.PI) / 180;
      const endAngle = ((currentAngle + segmentAngle) * Math.PI) / 180;

      // Calculate points on the arc
      const startX = center + innerRadius * Math.sin(startAngle);
      const startY = center - innerRadius * Math.cos(startAngle);
      const endX = center + innerRadius * Math.sin(endAngle);
      const endY = center - innerRadius * Math.cos(endAngle);

      const outerStartX = center + radius * Math.sin(startAngle);
      const outerStartY = center - radius * Math.cos(startAngle);
      const outerEndX = center + radius * Math.sin(endAngle);
      const outerEndY = center - radius * Math.cos(endAngle);

      // Determine if the segment is more than 180 degrees
      const largeArcFlag = segmentAngle > 180 ? 1 : 0;

      // Construct the SVG path
      const path = [
        `M ${startX} ${startY}`, // Move to inner start point
        `L ${outerStartX} ${outerStartY}`, // Line to outer start point
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`, // Outer arc
        `L ${endX} ${endY}`, // Line to inner end point
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startX} ${startY}`, // Inner arc
        'Z', // Close path
      ].join(' ');

      segments.push(<Path key={index} d={path} fill={item.color} />);

      // Update the current angle for the next segment
      currentAngle += segmentAngle;
    });

    return segments;
  };

  return (
    <View style={styles.container}>
      <Svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      >
        <G>{generateSegments()}</G>
      </Svg>
      {centerText && (
        <View style={[styles.centerTextContainer, { width: innerRadius * 2 }]}>
          <Text style={[styles.centerText, { color: textColor }]}>
            {centerText}
          </Text>
          {centerSubText && (
            <Text style={[styles.centerSubText, { color: subTextColor }]}>
              {centerSubText}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centerSubText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
