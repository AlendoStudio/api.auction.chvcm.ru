import "./common";

import {expect} from "chai";

import {renderMarkdown} from "../src";

describe("renderMarkdown", () => {
  it("error", (done) => {
    renderMarkdown((undefined as unknown) as string)
      .then(() => done("error expected"))
      .catch((error) => {
        try {
          expect(error.status).equal(400);
          expect(error.message).equal(
            "marked(): input parameter is undefined or null",
          );
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it("correct", async () => {
    const result = await renderMarkdown("# Hello Markdown");

    expect(result).equal(`<h1 id="hello-markdown">Hello Markdown</h1>\n`);
  });
});
