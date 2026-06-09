import professionSources from "../data/professionSources";
import summarizeKnowledge from "../utils/summarizeKnowledge";

const CACHE_PREFIX =
  "profession_knowledge_";

const CACHE_DURATION =
  7 * 24 * 60 * 60 * 1000;

const getCacheKey = (
  profession
) =>
  `${CACHE_PREFIX}${profession}`;

const saveToCache = (
  profession,
  data
) => {
  const payload = {
    data,
    timestamp:
      Date.now(),
  };

  localStorage.setItem(
    getCacheKey(
      profession
    ),
    JSON.stringify(
      payload
    )
  );
};

const getFromCache = (
  profession
) => {
  const cached =
    localStorage.getItem(
      getCacheKey(
        profession
      )
    );

  if (!cached)
    return null;

  try {
    const parsed =
      JSON.parse(
        cached
      );

    const expired =
      Date.now() -
        parsed.timestamp >
      CACHE_DURATION;

    if (expired) {
      localStorage.removeItem(
        getCacheKey(
          profession
        )
      );

      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
};

export const loadProfessionKnowledge =
  async (
    profession
  ) => {
    if (
      !profession
    )
      return null;

    const cached =
      getFromCache(
        profession
      );

    if (cached)
      return cached;

    const source =
      professionSources[
        profession
      ];

    if (!source)
      return null;

    const summarized =
      summarizeKnowledge(
        source
      );

    saveToCache(
      profession,
      summarized
    );

    return summarized;
  };

export const getRelevantKnowledge =
  (
    profession,
    message
  ) => {
    if (
      !profession ||
      !message
    )
      return "";

    const source =
      professionSources[
        profession
      ];

    if (
      !source?.chunks
    )
      return "";

    const lowerMessage =
      message.toLowerCase();

    const matchedChunks =
      source.chunks.filter(
        (chunk) =>
          chunk.keywords.some(
            (
              keyword
            ) =>
              lowerMessage.includes(
                keyword.toLowerCase()
              )
          )
      );

    return matchedChunks
      .map(
        (
          chunk
        ) =>
          chunk.content
      )
      .join("\n\n");
  };

export const clearKnowledgeCache =
  () => {
    Object.keys(
      localStorage
    ).forEach(
      (key) => {
        if (
          key.startsWith(
            CACHE_PREFIX
          )
        ) {
          localStorage.removeItem(
            key
          );
        }
      }
    );
  };