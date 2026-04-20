import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play, Square } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

type Point = { x: number; y: number };

export default function SnakeGame({ 
  score, 
  setScore, 
  highScore, 
  setHighScore 
}: { 
  score: number; 
  setScore: (s: number | ((prev: number) => number)) => void;
  highScore: number;
  setHighScore: (s: number) => void;
}) {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection({ x: 0, y: -1 });
    setIsGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        setSpeed(s => Math.max(50, s - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood, setScore, setHighScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver, speed]);

  return (
    <div className="relative">
      {/* Game Board Container - Matches "Artistic Flair" Console style */}
      <div 
        className="relative bg-[#050505] border-4 border-[#111] shadow-[0_0_40px_rgba(0,243,255,0.1)] p-1 overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20, 
          display: 'grid', 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Subtle Console Grid Lines from Theme */}
        <div className="absolute inset-0 pointer-events-none grid-pattern opacity-10"></div>
        <div className="absolute w-full h-[1px] bg-neon-cyan/10 top-1/4"></div>
        <div className="absolute w-full h-[1px] bg-neon-cyan/10 top-1/2"></div>
        <div className="absolute w-full h-[1px] bg-neon-cyan/10 top-3/4"></div>
        <div className="absolute h-full w-[1px] bg-neon-cyan/10 left-1/4"></div>
        <div className="absolute h-full w-[1px] bg-neon-cyan/10 left-1/2"></div>
        <div className="absolute h-full w-[1px] bg-neon-cyan/10 left-3/4"></div>

        {/* Render Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            className="absolute"
            initial={false}
            animate={{
              x: segment.x * 20,
              y: segment.y * 20,
              backgroundColor: i === 0 ? '#39ff14' : `rgba(57, 255, 20, ${1 - (i / snake.length) * 0.8})`,
              boxShadow: i === 0 ? '0 0 10px #39ff14' : 'none',
              zIndex: i === 0 ? 10 : 1,
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 300, duration: 0.1 }}
            style={{ width: 19, height: 19, margin: 0.5 }}
          />
        ))}

        {/* Render Food */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            boxShadow: ['0 0 10px #ff00ff', '0 0 20px #ff00ff', '0 0 10px #ff00ff'],
          }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute bg-neon-pink rounded-full"
          style={{ 
            x: food.x * 20, 
            y: food.y * 20,
            width: 14, 
            height: 14, 
            margin: 3,
            zIndex: 5
          }}
        />

        {/* Game Over / Pause Overlay */}
        <AnimatePresence mode="wait">
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-3xl font-bold tracking-tighter italic neon-text-pink mb-4">SYSTEM FAILURE</h2>
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-6">Neural Link Severed</p>
                  <button 
                    onClick={resetGame}
                    className="px-6 py-2 border border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-black transition-all font-mono uppercase tracking-[0.2em] text-[11px]"
                  >
                    Re-Initialize
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold tracking-tighter italic neon-text-cyan mb-8 uppercase">Standby</h2>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="px-8 py-3 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all font-mono uppercase tracking-[0.2em] text-[11px]"
                  >
                    Resume Link
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
