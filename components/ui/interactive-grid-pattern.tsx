"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number]; // [horizontal, vertical]
  className?: string;
  squaresClassName?: string;
}

export function InteractiveGridPattern({
  width = 20,
  height = 20,
  squares = [60, 40],
  className,
  squaresClassName,
  ...props
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares;
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);
  
  // Track adjacent squares to create a ripple effect
  const getAdjacentSquares = (index: number) => {
    const x = index % horizontal;
    const y = Math.floor(index / horizontal);
    
    // Return array of adjacent square indices
    return [
      // Direct adjacents (up, right, down, left)
      y > 0 ? index - horizontal : null, // up
      x < horizontal - 1 ? index + 1 : null, // right
      y < vertical - 1 ? index + horizontal : null, // down
      x > 0 ? index - 1 : null, // left
      
      // Diagonals
      y > 0 && x > 0 ? index - horizontal - 1 : null, // up-left
      y > 0 && x < horizontal - 1 ? index - horizontal + 1 : null, // up-right
      y < vertical - 1 && x > 0 ? index + horizontal - 1 : null, // down-left
      y < vertical - 1 && x < horizontal - 1 ? index + horizontal + 1 : null, // down-right
    ].filter((idx): idx is number => idx !== null);
  };

  return (
    <svg
      width={width * horizontal}
      height={height * vertical}
      className={cn(
        "absolute inset-0 h-full w-full opacity-30",
        className,
      )}
      {...props}
    >
      {Array.from({ length: horizontal * vertical }).map((_, index) => {
        const x = (index % horizontal) * width;
        const y = Math.floor(index / horizontal) * height;
        
        // Calculate distance from hovered square for ripple effect
        const isHovered = index === hoveredSquare;
        const isAdjacent = hoveredSquare !== null && getAdjacentSquares(hoveredSquare).includes(index);
        const isAdjacentToAdjacent = hoveredSquare !== null && 
          !isAdjacent && 
          getAdjacentSquares(hoveredSquare)
            .some(adjIdx => getAdjacentSquares(adjIdx).includes(index));
        
        // Determine opacity based on distance from hovered square
        let fillOpacity = "0.08"; // Higher base visibility
        if (isHovered) fillOpacity = "0.5";
        else if (isAdjacent) fillOpacity = "0.3";
        else if (isAdjacentToAdjacent) fillOpacity = "0.15";
        
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            className={cn(
              "stroke-zinc-500 transition-all duration-300 ease-out [&:not(:hover)]:duration-700",
              squaresClassName,
            )}
            fill="rgb(210, 210, 220)"
            fillOpacity={fillOpacity}
            strokeWidth="1"
            onMouseEnter={() => setHoveredSquare(index)}
            onMouseLeave={() => setHoveredSquare(null)}
          />
        );
      })}
    </svg>
  );
}