import { useState } from 'react';
import { motion } from 'framer-motion';

interface ExpandingButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ExpandingButton: React.FC<ExpandingButtonProps> = ({ onClick }) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExpanded(!expanded);

    // If there's an additional onClick action, call it
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`flex items-center justify-center p-2 rounded-full bg-neutral-950 text-white ${
        expanded ? 'w-32 h-32' : 'w-12 h-12'
      } transition-all duration-500 ease-in-out`}
      initial={{ scale: 1 }}
      animate={{ scale: expanded ? 1.2 : 1 }}
    >
      {!expanded ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      ) : (
        <></>
      )}
    </motion.button>
  );
};

export default ExpandingButton;
