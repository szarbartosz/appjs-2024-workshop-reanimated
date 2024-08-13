import { AnimatedText } from "@/components/AnimatedText";
import { Container } from "@/components/Container";
import { hitSlop } from "@/lib/reanimated";
import { colorShades, layout } from "@/lib/theme";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  clamp,
  Extrapolation,
  interpolate,
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export function BalloonSliderLesson() {
  const aRef = useAnimatedRef<View>();

  const x = useSharedValue(0);
  const scale = useSharedValue(1);
  const balloonScale = useSharedValue(0);
  const progress = useSharedValue(0);

  const balloonSpringyX = useDerivedValue(() => {
    return withSpring(x.value, { stiffness: 200, damping: 200 });
  });

  const panGesture = Gesture.Pan()
    .onChange((ev) => {
      const size = measure(aRef);
      x.value = clamp((x.value += ev.changeX), 0, size.width);
      progress.value = (x.value / size.width) * 100;
    })
    .onFinalize(() => {
      scale.value = withSpring(1);
      balloonScale.value = withSpring(0);
    });

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(2);
      balloonScale.value = withSpring(1);
    })
    .onEnd(() => {
      scale.value = withSpring(1);
      balloonScale.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderWidth: interpolate(
        scale.value,
        [1, 2],
        [layout.knobSize / 2, 2],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          translateX: x.value,
        },
        {
          scale: scale.value,
        },
      ],
    };
  });

  const balloonStyle = useAnimatedStyle(() => {
    return {
      opacity: balloonScale.value,
      transform: [
        { translateX: balloonSpringyX.value },
        { scale: balloonScale.value },
        {
          translateY: interpolate(
            balloonScale.value,
            [0, 1],
            [0, -layout.indicatorSize]
          ),
        },
        {
          rotate: `${Math.atan2(
            balloonSpringyX.value - x.value,
            layout.indicatorSize * 2
          )}rad`,
        },
      ],
    };
  });

  const gestures = Gesture.Simultaneous(tapGesture, panGesture);

  return (
    <Container>
      <GestureDetector gesture={gestures}>
        <View ref={aRef} style={styles.slider} hitSlop={hitSlop}>
          <Animated.View style={[styles.balloon, balloonStyle]}>
            <View style={styles.textContainer}>
              <AnimatedText
                text={progress}
                style={{ color: "white", fontWeight: "600" }}
              />
            </View>
          </Animated.View>
          <Animated.View style={[styles.progress, { width: x }]} />
          <Animated.View
            style={[styles.knob, animatedStyle]}
            hitSlop={hitSlop}
          />
        </View>
      </GestureDetector>
    </Container>
  );
}

const styles = StyleSheet.create({
  knob: {
    width: layout.knobSize,
    height: layout.knobSize,
    borderRadius: layout.knobSize / 2,
    backgroundColor: "#fff",
    borderWidth: layout.knobSize / 2,
    borderColor: colorShades.purple.base,
    position: "absolute",
    left: -layout.knobSize / 2,
  },
  slider: {
    width: "80%",
    backgroundColor: colorShades.purple.light,
    height: 5,
    justifyContent: "center",
  },
  progress: {
    height: 5,
    backgroundColor: colorShades.purple.dark,
    position: "absolute",
  },
  textContainer: {
    width: 40,
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorShades.purple.base,
    position: "absolute",
    top: -layout.knobSize,
  },
  balloon: {
    alignItems: "center",
    justifyContent: "center",
    width: 4,
    height: layout.indicatorSize,
    bottom: -layout.knobSize / 2,
    borderRadius: 2,
    backgroundColor: colorShades.purple.base,
    position: "absolute",
  },
});
