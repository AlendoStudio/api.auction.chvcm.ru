import "./common";

import {expect} from "chai";

import {ApiCodes} from "../src";

describe("ApiCodes", () => {
  Object.entries(ApiCodes).map((entry) => {
    it(`${entry[0]}`, () => {
      expect(entry[1]).equal(entry[0]);
    });
  });
});
