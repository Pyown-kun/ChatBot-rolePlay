/**
 * Summarize profession knowledge
 * agar prompt tidak terlalu besar
 */

const MAX_ITEMS = 5;
const MAX_TEXT_LENGTH = 350;

const truncateText = (
  text,
  maxLength =
    MAX_TEXT_LENGTH
) => {
  if (!text)
    return "";

  if (
    text.length <=
    maxLength
  ) {
    return text;
  }

  return (
    text.slice(
      0,
      maxLength
    ) + "..."
  );
};

const limitArray = (
  arr,
  limit =
    MAX_ITEMS
) => {
  if (
    !Array.isArray(
      arr
    )
  )
    return [];

  return arr.slice(
    0,
    limit
  );
};

/**
 * Main summarizer
 */
export const summarizeKnowledge =
  (
    knowledge
  ) => {
    if (
      !knowledge
    ) {
      return "";
    }

    const summary =
      {
        profession:
          knowledge.profession,

        description:
          truncateText(
            knowledge.description,
            220
          ),

        expertise:
          truncateText(
            knowledge.expertise,
            300
          ),

        workplace:
          limitArray(
            knowledge.workplace,
            3
          ),

        tools:
          limitArray(
            knowledge.tools,
            5
          ),

        workflow:
          limitArray(
            knowledge.workflow,
            5
          ),

        jargon:
          limitArray(
            knowledge.jargon,
            6
          ),

        commonProblems:
          limitArray(
            knowledge.commonProblems,
            5
          ),
      };

    /**
     * Convert ke compact string
     * supaya hemat token
     */
    return `
Profession:
${summary.profession}

Description:
${summary.description}

Expertise:
${summary.expertise}

Tools:
${summary.tools.join(
  ", "
)}

Workflow:
${summary.workflow.join(
  ", "
)}

Jargon:
${summary.jargon.join(
  ", "
)}

Common Problems:
${summary.commonProblems.join(
  ", "
)}
`;
  };

export default
  summarizeKnowledge;