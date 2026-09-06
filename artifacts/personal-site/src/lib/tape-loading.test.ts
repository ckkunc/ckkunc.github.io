import assert from "node:assert/strict";
import test from "node:test";
import { initialTapeLoading, tapeFlightFrames, tapeFlightGeometry, tapeLoadingReducer } from "./tape-loading.ts";

const geometry = tapeFlightGeometry({ left: 850, top: 320, width: 180 }, { a: .5, b: 0, c: 0, d: .5, e: 400, f: 450 })!;
const select = (index: number, openNotes = true) => ({ type: "select" as const, index, openNotes, direction: 1, geometry });

test("liner notes open immediately when the tape lands", () => {
  const flying = tapeLoadingReducer(initialTapeLoading, select(2));
  assert.equal(flying.index, 0);
  assert.equal(flying.requestedIndex, 2);
  assert.equal(flying.storyOpen, false);
  const landed = tapeLoadingReducer(flying, { type: "land", id: flying.flight!.id });
  assert.equal(landed.index, 2);
  assert.equal(landed.storyOpen, true);
  assert.equal(landed.flight, null);
  assert.equal(landed.glint, 1);
});

test("rapid selections ignore the superseded flight's completion", () => {
  const first = tapeLoadingReducer(initialTapeLoading, select(1));
  const second = tapeLoadingReducer(first, select(3, false));
  assert.equal(tapeLoadingReducer(second, { type: "land", id: first.flight!.id }), second);
  const landed = tapeLoadingReducer(second, { type: "land", id: second.flight!.id });
  assert.equal(landed.index, 3);
  assert.equal(landed.storyOpen, false);
});

test("Escape or resize cancels deferred notes and preserves the loaded cassette", () => {
  const flying = tapeLoadingReducer(initialTapeLoading, select(1));
  const canceled = tapeLoadingReducer(flying, { type: "cancel" });
  assert.equal(canceled.requestedIndex, 0);
  assert.equal(canceled.flight, null);
  assert.equal(tapeLoadingReducer(canceled, { type: "land", id: flying.flight!.id }), canceled);
  assert.equal(canceled.storyOpen, false);
});

test("reduced motion and notes navigation select immediately without a flight", () => {
  const instant = tapeLoadingReducer(initialTapeLoading, { ...select(2), geometry: null });
  assert.equal(instant.index, 2);
  assert.equal(instant.flight, null);
  assert.equal(instant.storyOpen, true);
  const next = tapeLoadingReducer(instant, { ...select(3), geometry: null });
  assert.equal(next.index, 3);
  assert.equal(next.storyOpen, true);
});

test("a duplicate completion cannot reopen closed liner notes", () => {
  const flying = tapeLoadingReducer(initialTapeLoading, select(1));
  const landed = tapeLoadingReducer(flying, { type: "land", id: flying.requestId });
  const closed = tapeLoadingReducer(landed, { type: "notes", open: false });
  assert.equal(closed.index, 1);
  assert.equal(tapeLoadingReducer(closed, { type: "land", id: landed.requestId }), closed);
});

test("the flight path progresses continuously without intermediate holds", () => {
  for (const x of [-450, 450]) {
    const flight = { ...geometry, x };
    const frames = tapeFlightFrames(flight);
    assert.ok(Math.abs(frames.x[0]) < 1e-10);
    assert.ok(Math.abs(frames.y[0]) < 1e-10);
    assert.equal(frames.x.at(-1), x);
    assert.equal(frames.y.at(-1), flight.y);
    assert.ok(Math.abs(frames.scale.at(-1)! - flight.scale) < 1e-10);
    for (let i = 1; i < frames.x.length; i++) assert.ok((frames.x[i] - frames.x[i - 1]) * Math.sign(x) > 0);
    for (const values of [frames.x, frames.y, frames.rotate, frames.scale]) assert.ok(values.every(Number.isFinite));
  }
});

test("flight destination follows a rotated, scaled and translated SVG window", () => {
  const angle = -3.8 * Math.PI / 180, scale = .6;
  const matrix = { a: Math.cos(angle) * scale, b: Math.sin(angle) * scale, c: -Math.sin(angle) * scale, d: Math.cos(angle) * scale, e: 430, f: 370 };
  const path = tapeFlightGeometry({ left: 900, top: 280, width: 190 }, matrix)!;
  assert.ok(Math.abs(path.rotate + 3.8) < 1e-10);
  assert.ok(Math.abs(path.scale * 190 - 324.36 * scale) < 1e-10);
  assert.ok(Math.abs(path.left + path.x - (matrix.e - 3.18 * matrix.a - 16.06 * matrix.c)) < 1e-10);
  assert.ok(Math.abs(path.top + path.y - (matrix.f - 3.18 * matrix.b - 16.06 * matrix.d)) < 1e-10);
  assert.equal(tapeFlightGeometry({ left: 0, top: 0, width: 0 }, matrix), null);
  assert.equal(tapeFlightGeometry({ left: 0, top: 0, width: 100 }, null), null);
  assert.equal(tapeFlightGeometry({ left: 0, top: 5, width: 100 }, matrix)!.lift, 0);
});
