import { videoSeriesConfig, videoList, VideoItem } from "@/config/videoConfig";

// Convert filename to a nice title
export const formatVideoTitle = (filename: string): string => {
  return filename
    .replace(/[-_]/g, " ") // Replace hyphens and underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
    .trim();
};

// Generate video data from the configured list
export const getVideoData = (): VideoItem[] => {
  return videoList.map((filename, index) => {
    const title = formatVideoTitle(filename);
    const videoUrl = `${videoSeriesConfig.videosPath}${filename}.mp4`; // Default to mp4
    
    // Check for custom thumbnail, otherwise use default
    const thumbnailUrl = `${videoSeriesConfig.videosPath}${filename}-thumb.jpg`;
    
    return {
      id: `video-${index + 1}`,
      title,
      filename,
      videoUrl,
      thumbnailUrl: thumbnailUrl,
      duration: "0:00", // Could be calculated if needed
      uploadDate: getRandomDate(),
    };
  });
};

// Generate random dates for demo purposes
const getRandomDate = (): string => {
  const dates = ["1 day ago", "2 days ago", "1 week ago", "2 weeks ago", "1 month ago"];
  return dates[Math.floor(Math.random() * dates.length)];
};

// Check if a video file exists (for error handling)
export const checkVideoExists = async (videoUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(videoUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};