import { Play, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { VideoItem } from "@/config/videoConfig";

interface VideoCardProps extends VideoItem {
  onVideoClick?: (videoUrl: string, title: string) => void;
}

const VideoCard = ({ title, thumbnailUrl, duration, uploadDate, videoUrl, onVideoClick }: VideoCardProps) => {
  const handleClick = () => {
    onVideoClick?.(videoUrl, title);
  };
  return (
    <Card className="video-card group cursor-pointer" onClick={handleClick}>
      <div className="relative aspect-video">
        <img 
          src={thumbnailUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {duration}
        </div>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center text-sm text-muted-foreground space-x-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {uploadDate}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;