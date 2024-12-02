import { loadAndSplitData } from "./services/data-loader";
import { indexData } from "./services/indexer";
import { setupChain } from "./services/retriever";

export const boot = async () => {
  const urls = [
    "https://aihunters.com/",
    "https://aihunters.com/services/",
    "https://aihunters.com/technology/",
    "https://aihunters.com/company/",
    "https://aihunters.com/company/about/",
    "https://aihunters.com/company/contact/",
    "https://cognitivemill.com/",
    "https://cognitivemill.com/solutions/",
    "https://cognitivemill.com/solutions/#ott",
    "https://cognitivemill.com/solutions/automated-movie-trailers/",
    "https://cognitivemill.com/solutions/end-credits-detection/",
    "https://cognitivemill.com/solutions/metadata-recognition/",
    "https://cognitivemill.com/solutions/automated-nudity-filtering/",
    "https://cognitivemill.com/solutions/automated-subtitle-generation/",
    "https://cognitivemill.com/solutions/#advertising",
    "https://cognitivemill.com/solutions/video-ad-detection/",
    "https://cognitivemill.com/solutions/video-ad-insertion/",
    "https://cognitivemill.com/solutions/logo-detection/",
    "https://cognitivemill.com/solutions/#sports",
    "https://cognitivemill.com/solutions/sports-highlights/",
    "https://cognitivemill.com/solutions/esports-highlights/",
    "https://cognitivemill.com/solutions/#promotion",
    "https://cognitivemill.com/solutions/video-clipping/",
    "https://cognitivemill.com/solutions/automated-video-summarization/",
    "https://cognitivemill.com/solutions/video-cropping/",
    "https://cognitivemill.com/products/",
    "https://cognitivemill.com/about/",
    "https://klipmeapp.com/",
    "https://klipmeapp.com/how-it-works",
  ];

  const data = await loadAndSplitData(urls);
  const vectorStore = await indexData(data);
  await setupChain(vectorStore);
};
