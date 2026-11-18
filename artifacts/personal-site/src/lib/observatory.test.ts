import test from "node:test";
import assert from "node:assert/strict";
import { grassWind, observatoryFrame, observatoryProgress } from "./observatory.ts";

test("sticky travel uses actual viewport dimensions and clamps overscroll", () => {
  assert.equal(observatoryProgress(100, 1680, 800), 0);
  assert.equal(observatoryProgress(-440, 1680, 800), 0.5);
  assert.equal(observatoryProgress(-880, 1680, 800), 1);
  assert.equal(observatoryProgress(-2000, 1680, 800), 1);
  assert.equal(observatoryProgress(-10, 800, 800), 0);
});
test("opening and hilltop have distinct, complete states", () => {
  const opening = observatoryFrame(0), hilltop = observatoryFrame(1);
  assert.equal(opening.titleOpacity, 1); assert.equal(opening.landscape, 0);
  assert.equal(hilltop.titleOpacity, 0); assert.equal(hilltop.pullback, 1);
  assert.equal(hilltop.landscape, 1);
});
test("the whole pullback is continuous and monotonic", () => {
  let previous = observatoryFrame(0);
  for (let step = 1; step <= 1000; step++) {
    const next = observatoryFrame(step / 1000);
    assert.ok(next.pullback >= previous.pullback);
    assert.ok(next.landscape >= previous.landscape);
    assert.ok(next.titleOpacity <= previous.titleOpacity);
    assert.ok(next.pullback - previous.pullback < 0.003);
    previous = next;
  }
});
test("reduced motion shows the landscape and name without a scroll animation", () => {
  const still = observatoryFrame(0, true);
  assert.equal(still.pullback, 1); assert.equal(still.landscape, 1);
  assert.equal(still.titleOpacity, 1); assert.equal(still.hintOpacity, 0);
  assert.deepEqual(observatoryFrame(1, true), still);
});
test("grass has calm intervals and a gust travels across the hill", () => {
  for (const x of [0, 0.25, 0.5, 0.75, 1]) assert.equal(grassWind(0, x), 0);
  assert.ok(grassWind(10.5, 0) > 0.6);
  assert.equal(grassWind(10.5, 1), 0);
  assert.ok(grassWind(16, 1) > 0.6);
  for (const x of [0, 0.5, 1]) assert.equal(grassWind(25, x), 0);
  for (let t = 0; t < 56; t += 0.25) assert.ok(grassWind(t, 0.5) >= 0 && grassWind(t, 0.5) <= 1);
});
