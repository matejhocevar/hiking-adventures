import { useEffect, useState } from "react";

const ANIMATION_FRAMES_START = [-320, -180, -120, -80, -60, -30];
const ANIMATION_FRAMES_END = [0, 0, 0, 0, 0, -30];
const FOOTER_INITIAL_HEIGHT = 519;
const FOOTER_INITIAL_WIDTH = 1750;

export default function PageFooter({}) {
  const [scrollPositions, setScrollPositions] = useState(
    ANIMATION_FRAMES_START
  );
  const [footerHeight, setFooterHeight] = useState(FOOTER_INITIAL_HEIGHT);
  const [footerWidth, setFooterWidth] = useState(FOOTER_INITIAL_WIDTH);

  const handleScroll = () => {
    const startTAnimationThreshold = 600;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const scrolled = winScroll / height;
    const scrollLeft = height - winScroll;
    const startPct = 1 - startTAnimationThreshold / height;

    if (scrollLeft < startTAnimationThreshold) {
      const pct = dynamicPct(startPct, 1, scrolled);
      const positions = [];
      for (let i = 0; i < ANIMATION_FRAMES_END.length; i++) {
        let start = ANIMATION_FRAMES_START[i];
        let end = ANIMATION_FRAMES_END[i];

        debugger;

        const width = document.documentElement.clientWidth;
        if (width > 819 && i === ANIMATION_FRAMES_END.length - 1) {
          end = -80;
        }

        const position = start + (end - start) * pct || 0;
        positions.push(position);
      }

      setScrollPositions(positions);
    }
  };

  const handleResize = () => {
    const width = document.documentElement.clientWidth;
    setFooterWidth(width);

    let height = (width * FOOTER_INITIAL_HEIGHT) / FOOTER_INITIAL_WIDTH;

    if (width < 420) {
      height = Math.min(Math.max(height, 210), 210);
    } else if (width < 919) {
      height = Math.min(Math.max(height, 440), 440);
    }

    setFooterHeight(height);
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="footer" style={{ height: footerHeight }}>
      <section
        style={{
          bottom: scrollPositions[0],
          backgroundSize: footerWidth > 1749 ? "cover" : "contain",
          backgroundImage: "url('/footer/p0.png')",
        }}
      ></section>
      <section
        style={{
          bottom: scrollPositions[1],
          backgroundSize: footerWidth > 1749 ? "cover" : "contain",
          backgroundImage: "url('/footer/p1.png')",
        }}
      ></section>
      <section
        style={{
          bottom: scrollPositions[2],
          backgroundSize: footerWidth > 1749 ? "cover" : "contain",
          backgroundImage: "url('/footer/p2.png')",
        }}
      ></section>
      <section
        style={{
          bottom: scrollPositions[3],
          backgroundSize: footerWidth > 1749 ? "cover" : "contain",
          backgroundImage: "url('/footer/p3.png')",
        }}
      ></section>
      <section
        style={{
          bottom: scrollPositions[4],
          backgroundSize: footerWidth > 1749 ? "cover" : "contain",
          backgroundImage: "url('/footer/p4.png')",
        }}
      ></section>
      <section
        style={{
          bottom: scrollPositions[5],
          height: footerWidth > 1749 ? footerHeight : 600,
          backgroundSize: footerWidth > 1749 ? "cover" : "contain",
          backgroundPositionY: footerWidth > 1749 ? "top" : "bottom",
          backgroundImage: "url('/footer/p5.png')",
        }}
      ></section>
    </div>
  );
}

function dynamicPct(start, end, current) {
  if (current < start) {
    return 0;
  } else if (current > end) {
    return 1;
  }
  return (current - start) / (end - start);
}
