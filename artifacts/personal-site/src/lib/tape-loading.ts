export type TapeFlightGeometry = {
  left: number;
  top: number;
  width: number;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  lift: number;
};

type ScreenMatrix = { a: number; b: number; c: number; d: number; e: number; f: number };

// The window group's screen matrix includes SVG letterboxing and its -3.8° rotation.
export function tapeFlightGeometry(source: { left: number; top: number; width: number }, matrix: ScreenMatrix | null): TapeFlightGeometry | null {
  if (!matrix || source.width <= 0 || ![source.left, source.top, source.width, matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f].every(Number.isFinite)) return null;
  const unit = Math.hypot(matrix.a, matrix.b);
  if (unit <= 0) return null;
  const localX = -318 * .01, localY = -146 * .11;
  return {
    left: source.left,
    top: source.top,
    x: matrix.a * localX + matrix.c * localY + matrix.e - source.left,
    y: matrix.b * localX + matrix.d * localY + matrix.f - source.top,
    width: source.width,
    scale: unit * 318 * 1.02 / source.width,
    rotate: Math.atan2(matrix.b, matrix.a) * 180 / Math.PI,
    lift: Math.min(28, Math.max(0, source.top - 8)),
  };
}

export type TapeFlight = TapeFlightGeometry & { id: number; index: number; openNotes: boolean };

export function tapeFlightFrames(flight: TapeFlightGeometry) {
  const frames = Array.from({ length: 25 }, (_, i) => {
    const t = i / 24, u = t * t * (3 - 2 * t), v = 1 - u;
    const arc = Math.sin(Math.PI * u);
    const entry = Math.max(0, (t - .8) / .2), clip = entry * entry * (3 - 2 * entry);
    return {
      x: 3 * v * v * u * flight.x * .15 + 3 * v * u * u * flight.x * .85 + u * u * u * flight.x,
      y: -3 * v * v * u * flight.lift + 3 * v * u * u * (flight.y - flight.lift) + u * u * u * flight.y,
      scale: 1 + (flight.scale - 1) * u + arc * .06,
      rotate: flight.rotate * u - arc * 4,
      clipPath: `inset(${7.43 * clip}% ${.98 * clip}% ${25.05 * clip}% ${.98 * clip}% round ${8 * clip}px)`,
      filter: `drop-shadow(0 ${4 * v + 16 * arc}px ${3 * v + 9 * arc}px rgba(23,32,27,${.18 * v + .1 * arc}))`,
    };
  });
  return {
    x: frames.map(frame => frame.x), y: frames.map(frame => frame.y),
    scale: frames.map(frame => frame.scale), rotate: frames.map(frame => frame.rotate),
    clipPath: frames.map(frame => frame.clipPath), filter: frames.map(frame => frame.filter),
  };
}

export type TapeLoadingState = {
  index: number;
  requestedIndex: number;
  requestId: number;
  direction: number;
  flight: TapeFlight | null;
  storyOpen: boolean;
  glint: number;
  landedFromShelf: boolean;
};
export const initialTapeLoading: TapeLoadingState = {
  index: 0, requestedIndex: 0, requestId: 0, direction: 1,
  flight: null, storyOpen: false, glint: 0, landedFromShelf: false,
};
export type TapeLoadingAction =
  | { type: "select"; index: number; direction: number; geometry: TapeFlightGeometry | null; openNotes: boolean }
  | { type: "land"; id: number }
  | { type: "cancel" }
  | { type: "notes"; open: boolean };

export function tapeLoadingReducer(state: TapeLoadingState, action: TapeLoadingAction): TapeLoadingState {
  switch (action.type) {
    case "select": {
      if (action.index === state.index) {
        return { ...state, requestId: state.requestId + 1, requestedIndex: state.index, flight: null, storyOpen: action.openNotes };
      }
      if (state.flight?.index === action.index) {
        return action.openNotes && !state.flight.openNotes ? { ...state, flight: { ...state.flight, openNotes: true } } : state;
      }
      const requestId = state.requestId + 1;
      const flight = action.geometry ? { ...action.geometry, id: requestId, index: action.index, openNotes: action.openNotes } : null;
      return { ...state, requestId, requestedIndex: action.index, direction: action.direction, flight,
        index: flight ? state.index : action.index, storyOpen: flight ? false : action.openNotes,
        glint: flight ? state.glint : state.glint + 1, landedFromShelf: false };
    }
    case "land": {
      if (!state.flight || state.flight.id !== action.id) return state;
      return { ...state, index: state.flight.index, flight: null, storyOpen: state.flight.openNotes,
        glint: state.glint + 1, landedFromShelf: true };
    }
    case "cancel":
      return state.flight ? { ...state, requestId: state.requestId + 1, requestedIndex: state.index, flight: null } : state;
    case "notes":
      return { ...state, storyOpen: action.open };
  }
}
