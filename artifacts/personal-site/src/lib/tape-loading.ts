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
export type TapeLoadingState = {
  index: number;
  requestedIndex: number;
  requestId: number;
  direction: number;
  flight: TapeFlight | null;
  storyOpen: boolean;
  pendingNotes: number | null;
  glint: number;
  landedFromShelf: boolean;
};
export const initialTapeLoading: TapeLoadingState = {
  index: 0, requestedIndex: 0, requestId: 0, direction: 1,
  flight: null, storyOpen: false, pendingNotes: null, glint: 0, landedFromShelf: false,
};
export type TapeLoadingAction =
  | { type: "select"; index: number; direction: number; geometry: TapeFlightGeometry | null; openNotes: boolean }
  | { type: "land"; id: number }
  | { type: "reveal-notes"; id: number }
  | { type: "cancel" }
  | { type: "notes"; open: boolean };

export function tapeLoadingReducer(state: TapeLoadingState, action: TapeLoadingAction): TapeLoadingState {
  switch (action.type) {
    case "select": {
      const requestId = state.requestId + 1;
      const flight = action.geometry ? { ...action.geometry, id: requestId, index: action.index, openNotes: action.openNotes } : null;
      return { ...state, requestId, requestedIndex: action.index, direction: action.direction, flight,
        index: flight ? state.index : action.index, storyOpen: flight ? false : action.openNotes, pendingNotes: null,
        glint: flight ? state.glint : state.glint + 1, landedFromShelf: false };
    }
    case "land": {
      if (!state.flight || state.flight.id !== action.id) return state;
      return { ...state, index: state.flight.index, flight: null, storyOpen: false, pendingNotes: state.flight.openNotes ? state.requestId : null,
        glint: state.glint + 1, landedFromShelf: true };
    }
    case "reveal-notes":
      return state.pendingNotes === action.id && state.requestId === action.id ? { ...state, pendingNotes: null, storyOpen: true } : state;
    case "cancel":
      return state.flight || state.pendingNotes !== null ? { ...state, requestId: state.requestId + 1, requestedIndex: state.index, flight: null, pendingNotes: null } : state;
    case "notes":
      return { ...state, storyOpen: action.open, pendingNotes: null };
  }
}
