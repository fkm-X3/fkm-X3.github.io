import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import VideoGrid from "@/components/VideoGrid";
import VideoPlayer from "@/components/VideoPlayer";
import { getVideoData } from "@/utils/videoUtils";
import { videoSeriesConfig } from "@/config/videoConfig";

const Index = () => {
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);
  const videos = getVideoData();

  const handleVideoClick = (videoUrl: string, title: string) => {
    setSelectedVideo({ url: videoUrl, title });
  };

  const handleClosePlayer = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <main className="pb-16">
        <VideoGrid 
          title={videoSeriesConfig.seriesName} 
          videos={videos} 
          onVideoClick={handleVideoClick}
        />
        {videos.length > 3 && (
          <VideoGrid 
            title="Recently Added" 
            videos={videos.slice(-3)} 
            onVideoClick={handleVideoClick}
          />
        )}
      </main>
      
      {selectedVideo && (
        <VideoPlayer
          isOpen={!!selectedVideo}
          onClose={handleClosePlayer}
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
        />
      )}
    </div>
  );
};

export default Index;
