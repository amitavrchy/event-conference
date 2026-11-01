import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import agendaReducer from "./features/agenda/agendaSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      agenda: agendaReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
