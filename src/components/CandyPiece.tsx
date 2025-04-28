
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
  const getCandyImage = () => {
    switch(type) {
      case 'BLUE':
        return '/lovable-uploads/218165ba-c13a-4116-b6f8-77fd74d4952d.png'; // Music note
      case 'GREEN':
        return '/lovable-uploads/149eda67-27c0-4b6e-a35d-2ee11e394664.png'; // Graduation cap
      case 'YELLOW':
        return '/lovable-uploads/056cb97b-ab1b-45b7-9b76-73ca5bead359.png'; // Guitar
      case 'ORANGE':
        return '/lovable-uploads/1f159eb1-bc1a-49cd-82f2-9e880299da71.png'; // Microphone
      case 'BROWN':
        return '/lovable-uploads/ef654987-2ff4-4461-aed8-e9b6fd4aa5d8.png'; // Black circle (used as blocker)
      default:
        return '/lovable-uploads/218165ba-c13a-4116-b6f8-77fd74d4952d.png'; // Default to music note
    }
  };

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
      <div className="w-full h-full flex items-center justify-center p-1.5">
        <img 
          src={getCandyImage()} 
          alt={`${type} piece`} 
          className="w-full h-full object-contain"
        />
        
        {/* Striped patterns overlay */}
        {isStriped && stripeDirection === 'horizontal' && (
          <div className="absolute inset-0 flex flex-col justify-around pointer-events-none">
            <div className="h-1.5 bg-white/50"></div>
            <div className="h-1.5 bg-white/50"></div>
            <div className="h-1.5 bg-white/50"></div>
          </div>
        )}

        {isStriped && stripeDirection === 'vertical' && (
          <div className="absolute inset-0 flex flex-row justify-around pointer-events-none">
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
