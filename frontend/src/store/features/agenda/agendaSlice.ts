import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AgendaState = {
  sessionIds: string[];
  synced: boolean;
};

const initialState: AgendaState = {
  sessionIds: [],
  synced: false,
};

const agendaSlice = createSlice({
  name: "agenda",
  initialState,
  reducers: {
    setAgenda(state, action: PayloadAction<string[]>) {
      state.sessionIds = action.payload;
      state.synced = true;
    },
    addSessionOptimistic(state, action: PayloadAction<string>) {
      if (!state.sessionIds.includes(action.payload)) {
        state.sessionIds.push(action.payload);
      }
    },
    removeSessionOptimistic(state, action: PayloadAction<string>) {
      state.sessionIds = state.sessionIds.filter((id) => id !== action.payload);
    },
    clearAgenda(state) {
      state.sessionIds = [];
      state.synced = false;
    },
  },
});

export const {
  setAgenda,
  addSessionOptimistic,
  removeSessionOptimistic,
  clearAgenda,
} = agendaSlice.actions;
export default agendaSlice.reducer;
