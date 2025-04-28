
import { cn } from "@/lib/utils";

interface CandyPieceProps {
  type: string;
  isSelected?: boolean;
  isStriped?: boolean;
  stripeDirection?: 'horizontal' | 'vertical';
  toRemove?: boolean;
  onClick: () => void;
  animateFall?: boolean;
}

const CandyPiece = ({ 
  type, 
  isSelected, 
  isStriped, 
  stripeDirection = 'horizontal',
  toRemove,
  onClick,
  animateFall
}: CandyPieceProps) => {
  // Determine candy appearance based on type
  const getCandyStyles = () => {
    switch(type) {
      case 'BLUE':
        return {
          bg: 'bg-candy-blue',
          shape: 'rounded-full',
          innerShape: 'rounded-full border-4 border-white/30 w-3/4 h-3/4 m-auto'
        };
      case 'GREEN':
        return {
          bg: 'bg-candy-green',
          shape: 'rounded-3xl',
          innerShape: ''
        };
      case 'YELLOW':
        return {
          bg: 'bg-candy-yellow',
          shape: 'candy-teardrop',
          innerShape: ''
        };
      case 'ORANGE':
        return {
          bg: 'bg-candy-orange',
          shape: 'candy-pentagon',
          innerShape: ''
        };
      case 'BROWN':
        return {
          bg: 'bg-candy-brown',
          shape: 'rounded',
          innerShape: 'bg-candy-brown/70 rounded m-1'
        };
      default:
        return {
          bg: 'bg-candy-blue',
          shape: 'rounded-full',
          innerShape: ''
        };
    }
  };

  const styles = getCandyStyles();

  return (
    <div 
      className={cn(
        "candy-piece relative w-12 h-12 m-0.5 flex items-center justify-center cursor-pointer transition-all duration-300",
        isSelected ? "scale-110 ring-2 ring-white" : "",
        toRemove ? "animate-fade-out" : "",
        animateFall ? "animate-fall-down" : "",
        "candy-glow"
      )}
      onClick={onClick}
    >
      <div 
        className={cn(
          "w-full h-full flex items-center justify-center",
          styles.bg,
          styles.shape
        )}
      >
        {/* Inner shape for layered candies */}
        {styles.innerShape && (
          <div className={styles.innerShape}></div>
        )}

        {/* Striped patterns */}
        {isStriped && stripeDirection === 'horizontal' && (
          <div className="absolute inset-0 flex flex-col justify-around">
            <div className="h-1.5 bg-white/50"></div>
            <div className="h-1.5 bg-white/50"></div>
            <div className="h-1.5 bg-white/50"></div>
          </div>
        )}

        {isStriped && stripeDirection === 'vertical' && (
          <div className="absolute inset-0 flex flex-row justify-around">
            <div className="w-1.5 bg-white/50"></div>
            <div className="w-1.5 bg-white/50"></div>
            <div className="w-1.5 bg-white/50"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandyPiece;
