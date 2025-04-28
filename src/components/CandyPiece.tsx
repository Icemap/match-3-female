
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
  // Get the appropriate image and style based on candy type
  const getCandyImage = () => {
    switch(type) {
      case 'BLUE':
        return {
          src: "/lovable-uploads/96d6c87d-cbcf-4adf-9bf6-9deb2911efd7.png",
          alt: "Music note",
          bgColor: "bg-teal-100"
        };
      case 'GREEN':
        return {
          src: "/lovable-uploads/d65d8548-3d54-4f42-87c8-694dc811d9f8.png",
          alt: "Music note",
          bgColor: "bg-transparent"
        };
      case 'YELLOW':
        return {
          src: "/lovable-uploads/781cba0e-ea47-4f23-9a5d-a339b3a291c4.png",
          alt: "Guitar",
          bgColor: "bg-transparent"
        };
      case 'ORANGE':
        return {
          src: "/lovable-uploads/a0a5e075-ab16-4fb9-943b-cc018c773b9a.png",
          alt: "Microphone",
          bgColor: "bg-transparent"
        };
      case 'BROWN':
        return {
          src: "/lovable-uploads/98ec79c1-4f33-45cf-a235-a19eac39a8e8.png",
          alt: "Graduation cap",
          bgColor: "bg-gray-100"
        };
      default:
        return {
          src: "/lovable-uploads/96d6c87d-cbcf-4adf-9bf6-9deb2911efd7.png",
          alt: "Music note",
          bgColor: "bg-teal-100"
        };
    }
  };

  const imageInfo = getCandyImage();

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
          "w-full h-full flex items-center justify-center rounded-md overflow-hidden",
          imageInfo.bgColor
        )}
      >
        {/* Image for candy */}
        <img 
          src={imageInfo.src} 
          alt={imageInfo.alt}
          className={cn(
            "w-10 h-10 object-contain",
            isSelected ? "scale-110" : ""
          )}
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
