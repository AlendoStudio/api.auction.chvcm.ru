import * as util from "util";

import * as createError from "http-errors";
import * as marked from "marked";

/**
 * Render markdown
 * @param markdown Markdown
 * @throws HttpError
 */
export async function renderMarkdown(markdown: string): Promise<string> {
  try {
    return await util.promisify<string>((callback) =>
      marked(markdown, callback),
    )();
  } catch (error) {
    throw createError(400, error);
  }
}
