import React, { createContext, useReducer, useContext, useEffect } from "react";

// Initial state from localStorage or empty array
const initialState = JSON.parse(localStorage.getItem("interviews")) || [];

// Reducer function
const interviewReducer = (state, action) => {
  switch (action.type) {
    case "ADD_INTERVIEW":
      return [...state, action.payload];
    case "UPDATE_INTERVIEW":
      // Ensure the interview is correctly replaced in state
      return state.map((interview) =>
        interview.id === action.payload.id ? action.payload : interview
      );
    case "DELETE_INTERVIEW":
      return state.filter((interview) => interview.id !== action.payload);
    default:
      return state;
  }
};



// Context
const InterviewContext = createContext();

// Provider
export const InterviewProvider = ({ children }) => {
  const [state, dispatch] = useReducer(interviewReducer, initialState);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("interviews", JSON.stringify(state));
  }, [state]);

  return (
    <InterviewContext.Provider value={{ state, dispatch }}>
      {children}
    </InterviewContext.Provider>
  );
};

// Custom hook to use context
export const useInterviewContext = () => useContext(InterviewContext);
