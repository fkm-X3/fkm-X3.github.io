// Configuration for the video series
export const videoSeriesConfig = {
  seriesName: "My Video Collection", // Edit this to change your series name
  description: "A curated collection of amazing videos",
  
  // Videos should be placed in the public/videos folder
  // The app will automatically detect video files and use their filenames as titles
  videosPath: "/videos/",
  
  // Supported video formats
  supportedFormats: [".mp4", ".webm", ".ogg", ".mov"],
  
  // Default thumbnail (you can add custom thumbnails by naming them the same as the video file)
  defaultThumbnail: "https://images.unsplash.com/photo-1489599000852-b1c685b4e5ac?w=400",
};

// List your video files here (without extensions)
// The app will look for these files in the public/videos folder
export const videoList = [
  "sample-video-1",
  "sample-video-2", 
  "sample-video-3",
  "nature-documentary",
  "cooking-tutorial",
  // Add more video filenames here as you add videos to the public/videos folder
];

export interface VideoItem {
  id: string;
  title: string;
  filename: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration?: string;
  uploadDate: string;
}