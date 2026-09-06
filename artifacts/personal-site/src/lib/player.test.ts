import assert from "node:assert/strict";
import test from "node:test";
import { nextTape, wheelPixels } from "./player.ts";

test("advances through all four experiences and wraps", () => {
  let tape = 0;
  const sequence = Array.from({ length: 5 }, () => (tape = nextTape(tape, 1, 4)));
  assert.deepEqual(sequence, [1, 2, 3, 0, 1]);
});
test("rewinds from the beginning and handles larger steps", () => {
  assert.equal(nextTape(0, -1, 4), 3);
  assert.equal(nextTape(2, -7, 4), 3);
  assert.equal(nextTape(3, 9, 4), 0);
  assert.equal(nextTape(0, 1, 0), 0);
});
test("normalizes trackpad, line-wheel, and page-wheel deltas", () => {
  assert.equal(wheelPixels(48, 0, 900), 48);
  assert.equal(wheelPixels(3, 1, 900), 48);
  assert.equal(wheelPixels(-1, 2, 900), -900);
});
