import { useEffect, useState } from "react";

interface AnimatedTextProps {
  text: string;
  animation?: "wave" | "fadeIn" | "typewriter";
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedText = ({ text, animation = "fadeIn", className = "", style = {} }: AnimatedTextProps) => {
  const [displayText, setDisplayText] = useState(animation === "typewriter" ? "" : text);

  useEffect(() => {
    if (animation === "typewriter") {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [text, animation]);

  if (animation === "wave") {
    return (
      <h1 className={className} style={style}>
        {text.split("").map((char, index) => (
          <span
            key={index}
            className="inline-block animate-wave"
            style={{
              animationDelay: `${index * 0.05}s`,
              animationDuration: "2s",
              animationIterationCount: "infinite",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
    );
  }

  if (animation === "typewriter") {
    return (
      <div className={className} style={style}>
        {displayText}
        <span className="animate-pulse">|</span>
      </div>
    );
  }

  return (
    <div className={`${className} animate-fade-in`} style={style}>
      {text}
    </div>
  );
};
