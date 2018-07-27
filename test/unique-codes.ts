import "./common";

function checkForUnique(codes: any, src: {
  [key: string]: any;
}) {
  for (const item in src) {
    if (item.endsWith("Codes")) {
      it(item, () => {
        for (const key in src[item]) {
          if (!src[item].hasOwnProperty(key)) {
            continue;
          }
          if (codes.hasOwnProperty(src[item][key])) {
            throw new Error(`"${src[item][key]}" is duplicate in "${codes[src[item][key]]}"!`);
          } else {
            codes[src[item][key]] = item;
          }
        }
      });
    }
  }
}

describe("unique codes", () => {
  const codes: any = {};
  checkForUnique(codes, require("../src"));
  checkForUnique(codes, require("@alendo/express-res-chain"));
  checkForUnique(codes, require("@alendo/express-req-validator"));
});
