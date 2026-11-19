import test from "node:test";
import assert from "node:assert/strict";
import { koiWidth, pondFish, rippleAt } from "./pond.ts";

test("ripples spread out and disappear without leaving a bright stationary ring", () => {
  assert.equal(rippleAt(0.1, -1), 0);
  assert.equal(rippleAt(0.1, 10), 0);
  assert.equal(rippleAt(0.018, 0), 0);
  assert.ok(rippleAt(0.018 + 4 * 0.037, 4) > 0.9);
  assert.ok(rippleAt(0.018 + 4 * 0.037, 7) < 0.01);
});
test("koi have full shoulders and tapered tail stocks", () => {
  assert.equal(koiWidth(-0.1), 0); assert.equal(koiWidth(1.1), 0);
  assert.ok(koiWidth(0.3) > koiWidth(0.05));
  assert.ok(koiWidth(0.3) > koiWidth(0.8) * 2);
  assert.ok(koiWidth(1) > 0 && koiWidth(1) < 0.2);
});
test("koi travel around the pond and face the direction they swim", () => {
  const mobile = pondFish(390, 844, 0);
  assert.equal(mobile.length, 2);
  for (const fish of mobile) {
    assert.ok(fish.x > 0 && fish.x < 390);
    assert.ok(fish.y < 844 * 0.5);
  }
  const start = pondFish(1440, 900, 0), next = pondFish(1440, 900, 1 / 24);
  assert.equal(start.length, 3);
  const later = pondFish(1440, 900, 12);
  for (let i = 0; i < start.length; i++) {
    const dx = next[i].x - start[i].x, dy = next[i].y - start[i].y;
    assert.ok(Math.hypot(dx, dy) < 2);
    assert.ok(dx * Math.cos(start[i].angle) + dy * Math.sin(start[i].angle) > 0);
    assert.ok(Math.hypot(later[i].x - start[i].x, later[i].y - start[i].y) > start[i].length * 0.5);
  }
  for (let t = 0; t <= 120; t += 2) {
    for (const fish of pondFish(390, 844, t)) {
      assert.ok(fish.x > 0 && fish.x < 390);
      assert.ok(fish.y > 0 && fish.y < 844 * 0.57);
    }
  }
});
