import React, { useEffect, useRef } from 'react';
import { Canvas, Circle, RadialGradient, Group, vec, Blur } from "@shopify/react-native-skia";
import { useSharedValue, useDerivedValue, Easing, withTiming } from 'react-native-reanimated';
import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../config';

export const AnimatedBackground = () => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const r = 230;

  const loc1x =  useSharedValue(100)
  const loc1y =  useSharedValue(100)
  const loc2x =  useSharedValue(400)
  const loc2y =  useSharedValue(300)
  const loc3x =  useSharedValue(100)
  const loc3y =  useSharedValue(500)
  const loc4x =  useSharedValue(400)
  const loc4y =  useSharedValue(800)
  const loc5x =  useSharedValue(400)
  const loc5y =  useSharedValue(800)

  const combine_loc1 = useDerivedValue(() => {
    return vec(loc1x.value, loc1y.value);
  });

  const combine_loc2 = useDerivedValue(() => {
    return vec(loc2x.value, loc2y.value);
  });

  const combine_loc3 = useDerivedValue(() => {
    return vec(loc3x.value, loc3y.value);
  });

  const combine_loc4 = useDerivedValue(() => {
    return vec(loc4x.value, loc4y.value);
  });

  const combine_loc5 = useDerivedValue(() => {
    return vec(loc5x.value, loc5y.value);
  });

  const animationRefLong = useRef();
  const animationRefShort = useRef();
  const longestDuration = 5500;
  const shorterDuration = 4000;
  
  useEffect(() => {
    const animateLong = () => {
      animateToRandomPosition(loc1x, loc1y, windowHeight, longestDuration);
      animateToRandomPosition(loc3x, loc3y, windowHeight, longestDuration);
      animationRefLong.current = setTimeout(() => {
        requestAnimationFrame(animateLong);
      }, longestDuration);
    };
  
    const animateShort = () => {
      animateToRandomPosition(loc2x, loc2y, windowHeight, shorterDuration);
      animateToRandomPosition(loc4x, loc4y, windowHeight, shorterDuration);
      animateToRandomPosition(loc5x, loc5y, windowHeight, shorterDuration);
      animationRefShort.current = setTimeout(() => {
        requestAnimationFrame(animateShort);
      }, shorterDuration);
    };
  
    animateLong();
    animateShort();
  
    return () => {
      clearTimeout(animationRefLong.current);
      clearTimeout(animationRefShort.current);
    };
  }, [animateToRandomPosition, windowHeight]);

  const animateToRandomPosition = (x, y, yAdjustment, timing) => {
    const xOffset = Math.random() * 100;
    const yOffset = Math.random() * 100;

    x.value = withTiming(Math.random() * ((windowWidth - 100 + xOffset) - (100 - xOffset)) + (100 - xOffset), {
      duration: timing,
      easing: Easing.inOut(Easing.sin),
    });
    y.value = withTiming(Math.random() * ((yAdjustment - 100 + yOffset) - (100 - yOffset)) + (100 - yOffset), {
      duration: timing,
      easing: Easing.inOut(Easing.sin),
    });
  };

  return (
    <Canvas style={styles.container}>
      <Group blendMode="hue">
        <Circle cx={loc1x} cy={loc1y} r={r}>
          <RadialGradient
            c={combine_loc1}
            r={r}
            colors={[`rgba(${Theme.lightblueAlpha}, 1)`, `rgba(${Theme.lightblueAlpha}, 0.8)`, `rgba(${Theme.lightblueAlpha}, 0)`]}
            />
        </Circle>
        <Circle cx={loc2x} cy={loc2y} r={r}>
          <RadialGradient
            c={combine_loc2}
            r={r}
            colors={[`rgba(${Theme.lightblueAlpha}, 1)`, `rgba(${Theme.lightblueAlpha}, 0.8)`, `rgba(${Theme.lightblueAlpha}, 0)`]}
            />
        </Circle>
        <Circle cx={loc3x} cy={loc3y} r={r}>
          <RadialGradient
            c={combine_loc3}
            r={r}
            colors={[`rgba(${Theme.lightblueAlpha}, 1)`, `rgba(${Theme.lightblueAlpha}, 0.8)`, `rgba(${Theme.lightblueAlpha}, 0)`]}
            />
        </Circle>
        <Circle cx={loc4x} cy={loc4y} r={r}>
          <RadialGradient
            c={combine_loc4}
            r={r}
            colors={[`rgba(${Theme.lightblueAlpha}, 1)`, `rgba(${Theme.lightblueAlpha}, 0.8)`, `rgba(${Theme.lightblueAlpha}, 0)`]}
            />
        </Circle>
        <Circle cx={loc5x} cy={loc5y} r={r}>
          <RadialGradient
            c={combine_loc5}
            r={r}
            colors={[`rgba(${Theme.lightblueAlpha}, 1)`, `rgba(${Theme.lightblueAlpha}, 0.8)`, `rgba(${Theme.lightblueAlpha}, 0)`]}
            />
        </Circle>
      </Group>
      <Blur blur={20} />
    </Canvas>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    alignContent: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -5,
    backgroundColor: Theme.mediumblue,
  },
});