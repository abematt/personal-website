import { useEffect, useState, useRef } from "react";
import { motion, stagger, useAnimate } from "framer-motion";

interface TextGenerateEffectProps {
  textBlocks: string[]; // Array of strings representing multiple text blocks
  className?: string; // Optional CSS class names
  filter?: boolean; // Option to apply a blur filter
  onComplete?: () => void; // Callback when animation completes
}

export const TextGenerateEffect: React.FC<TextGenerateEffectProps> = ({
  textBlocks,
  className,
  filter = true,
  onComplete, // Pass the onComplete prop
}) => {
  const [scope, animate] = useAnimate();
  const [currentBlock, setCurrentBlock] = useState(0); // Track the currently visible block
  const containerRef = useRef<HTMLDivElement>(null); // To measure height

  // Controllable variables for animation
  const animationDurationPerWord = 0.5; // Time for each word to appear
  const blockDelay = 0.3; // Delay between blocks
  const wordStaggerDelay = 0.1; // Stagger delay between words

  // Measure the height of all text blocks and set it initially
  useEffect(() => {
    if (containerRef.current) {
      const height = containerRef.current.scrollHeight; // Get total scrollable height of all blocks
      containerRef.current.style.height = `${height}px`; // Set this height on the container to prevent displacement
    }
  }, []);

  useEffect(() => {
    // Animate the current block's words
    const handleBlockAnimation = async (blockIndex: number) => {
      // Animate the block itself (container div)
      await animate(`#block-${blockIndex}`, { opacity: 1 }, { duration: 0.5 });

      // Then animate the words inside the block
      await animate(
        `#block-${blockIndex} span`,
        { opacity: 1, filter: filter ? "blur(0px)" : "none" },
        { delay: stagger(wordStaggerDelay), duration: animationDurationPerWord }
      );

      // Move to the next block after this animation completes
      if (blockIndex < textBlocks.length - 1) {
        setTimeout(() => setCurrentBlock(blockIndex + 1), blockDelay * 1000); // Delay before showing the next block
      } else if (onComplete) {
        // Call onComplete once the last block is finished
        onComplete();
      }
    };

    // Trigger the animation for the current block
    handleBlockAnimation(currentBlock);
  }, [scope, animate, currentBlock, textBlocks, filter, onComplete]);

  const renderTextBlocks = () => {
    return (
      <motion.div ref={scope}>
        {textBlocks.map((block, blockIdx) => {
          const wordsArray = block.split(" ");
          return (
            <motion.div
              key={blockIdx}
              id={`block-${blockIdx}`}
              className="opacity-0 mt-8" // Initially hidden
              style={{ opacity: blockIdx <= currentBlock ? 1 : 0 }} // Control visibility through opacity
            >
              {wordsArray.map((word, wordIdx) => (
                <motion.span
                  key={word + wordIdx}
                  className="dark:text-white text-black opacity-0"
                  style={{ filter: filter ? "blur(10px)" : "none" }}
                >
                  {word}{" "}
                </motion.span>
              ))}
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div ref={containerRef} className={className} style={{ overflow: "hidden" }}>
      <div className="mt-4">
        <div className="text-zinc-500 text-2xl font-light leading-snug tracking-wide">
          {renderTextBlocks()}
        </div>
      </div>
    </div>
  );
};
