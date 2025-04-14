export const getEmotion = (score) => {
  if (score > 4) return "😊";
  if (score > 0) return "🙂";
  if (score === 0) return "😐";
  if (score > -2) return "😟";
  return "😠";
};

export const getBackgroundColor = (label) => {
  switch (label.toLowerCase()) {
    case "positive":
      return "bg-green-400/20";
    case "negative":
      return "bg-red-400/20";
    case "neutral":
      return "bg-gray-400/10";
    default:
      return "bg-gray-800";
  }
};
