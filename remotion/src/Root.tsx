import { Composition } from "remotion";
import { Intro, INTRO_FPS, INTRO_HEIGHT, INTRO_WIDTH, INTRO_DURATION_FRAMES } from "./Intro";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={INTRO_DURATION_FRAMES}
        fps={INTRO_FPS}
        width={INTRO_WIDTH}
        height={INTRO_HEIGHT}
      />
    </>
  );
};
