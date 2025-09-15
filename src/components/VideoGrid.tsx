import VideoCard from "./VideoCard";
import { VideoItem } from "@/config/videoConfig";

interface VideoGridProps {
  title: string;
  videos: VideoItem[];
  onVideoClick?: (videoUrl: string, title: string) => void;
}

const VideoGrid = ({ title, videos, onVideoClick }: VideoGridProps) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              {...video}
              onVideoClick={onVideoClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoGrid;