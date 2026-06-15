/**
 * Helpers for calculating the printed exam layout in @react-pdf/renderer.
 *
 * The PDF engine is based on flexbox and does not provide CSS columns or
 * automatic column/page balancing. We therefore estimate each question's
 * height in points and distribute them deterministically:
 *   - fill column 1 until the page limit
 *   - then column 2
 *   - then start a new page
 */

export const A4_HEIGHT = 841.89;
export const A4_WIDTH = 595.28;

// Page padding as defined in Simulado.jsx styles.page
const PAGE_PADDING_VERTICAL = 15 * 2;
const HEADER_HEIGHT_ESTIMATE = 50;

// Reserve a small safety buffer so we do not cut too close to the page
// bottom. This prevents questions from being clipped when the estimate
// is slightly off.
const SAFETY_BUFFER = 30;

export const AVAILABLE_CONTENT_HEIGHT =
  A4_HEIGHT - PAGE_PADDING_VERTICAL - HEADER_HEIGHT_ESTIMATE - SAFETY_BUFFER;

// Column width is ~49% of the inner width after 20pt horizontal padding.
// We estimate ~50 chars per line for the 8.5pt font used in questions.
const CHARS_PER_LINE = 50;
const CONTEXT_LINE_HEIGHT = 13;
const ALTERNATIVE_TEXT_LINE_HEIGHT = 13;
const ALTERNATIVE_BASE_HEIGHT = 14;
const QUESTION_TITLE_HEIGHT = 15;
const ALTERNATIVES_INTRO_HEIGHT = 14;
const QUESTION_MARGIN_BOTTOM = 18; // marginBottom 12 + paddingBottom 6
// Use the max rendered heights from the styles to avoid underestimating.
const CONTEXT_IMAGE_HEIGHT = 250;
const ALTERNATIVE_IMAGE_HEIGHT = 120;

function countMarkdownImages(text) {
  if (!text) return 0;
  const matches = text.match(/!\[.*?\]\(.*?\)/g);
  return matches ? matches.length : 0;
}

export function estimateQuestionHeight(question) {
  let height = QUESTION_TITLE_HEIGHT + QUESTION_MARGIN_BOTTOM;

  if (question.context) {
    const imageCount = countMarkdownImages(question.context);
    const textOnly = question.context.replace(/!\[.*?\]\(.*?\)/g, "");
    const textLines = Math.max(1, Math.ceil(textOnly.length / CHARS_PER_LINE));
    height += textLines * CONTEXT_LINE_HEIGHT;
    height += imageCount * CONTEXT_IMAGE_HEIGHT;
  }

  if (question.alternativesIntroduction) {
    height += ALTERNATIVES_INTRO_HEIGHT;
  }

  if (question.alternatives?.length) {
    for (const alt of question.alternatives) {
      height += ALTERNATIVE_BASE_HEIGHT;

      if (alt.text) {
        const lines = Math.max(1, Math.ceil(alt.text.length / CHARS_PER_LINE));
        height += lines * ALTERNATIVE_TEXT_LINE_HEIGHT;
      }

      // `alt.file` is a direct image URL from the API, not Markdown syntax.
      if (alt.file) {
        height += ALTERNATIVE_IMAGE_HEIGHT;
      }
    }
  }

  return Math.ceil(height);
}

/**
 * Distributes questions into pages with two columns each.
 *
 * The algorithm follows the requested printed-exam behaviour:
 *   1. Fill column 1 until the page limit.
 *   2. Then fill column 2.
 *   3. Only when both columns are full, start a new page.
 *
 * @returns {Array<{left: Array<{question, index}>, right: Array<{question, index}>}>}
 */
export function distributeQuestions(questions, maxHeight = AVAILABLE_CONTENT_HEIGHT) {
  const pages = [];
  let currentPage = { left: [], right: [] };
  let leftHeight = 0;
  let rightHeight = 0;

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const height = estimateQuestionHeight(question);
    const item = { question, index: i };

    if (leftHeight + height <= maxHeight) {
      currentPage.left.push(item);
      leftHeight += height;
    } else if (rightHeight + height <= maxHeight) {
      currentPage.right.push(item);
      rightHeight += height;
    } else {
      if (currentPage.left.length > 0 || currentPage.right.length > 0) {
        pages.push(currentPage);
      }
      currentPage = { left: [item], right: [] };
      leftHeight = height;
      rightHeight = 0;
    }
  }

  if (currentPage.left.length > 0 || currentPage.right.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

export function isValidImageUrl(url) {
  if (!url || typeof url !== "string") return false;
  return /^https?:\/\//i.test(url);
}

/**
 * Resolves alternative image URLs to absolute URLs.
 * The external API already returns absolute URLs, but this keeps the
 * frontend resilient in case relative paths ever appear.
 */
export function resolveImageUrl(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (isValidImageUrl(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("/")) return `https://enem.dev${trimmed}`;
  return `https://enem.dev/${trimmed}`;
}
