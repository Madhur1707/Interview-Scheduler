import React, { createContext, useReducer, useContext, useEffect } from "react";

// Initial state: get interviews from localStorage or fallback to an empty array
const initialState = JSON.parse(localStorage.getItem("interviews")) || [];

// Reducer function to handle state changes based on action types
const interviewReducer = (state, action) => {
  switch (action.type) {
    // Add a new interview to the state
    case "ADD_INTERVIEW":
      return [...state, action.payload];

    // Update an existing interview based on its ID
    case "UPDATE_INTERVIEW":
      return state.map((interview) =>
        interview.id === action.payload.id ? action.payload : interview
      );

    // Delete an interview by its ID
    case "DELETE_INTERVIEW":
      return state.filter((interview) => interview.id !== action.payload);

    // Default case to return the current state if no matching action type
    default:
      return state;
  }
};

// Create the InterviewContext to provide and consume state
const InterviewContext = createContext();

// Provider component that wraps the app and provides state and dispatch to child components
export const InterviewProvider = ({ children }) => {
  // Use the reducer to manage interview state
  const [state, dispatch] = useReducer(interviewReducer, initialState);

  // Save the interview state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("interviews", JSON.stringify(state));
  }, [state]);

  // Return the InterviewContext provider to pass down the state and dispatch function
  return (
    <InterviewContext.Provider value={{ state, dispatch }}>
      {children}
    </InterviewContext.Provider>
  );
};

// Custom hook to access the InterviewContext easily
export const useInterviewContext = () => {
  // Get the context value
  const context = useContext(InterviewContext);

  // Throw an error if the hook is used outside of the InterviewProvider
  if (context === undefined) {
    throw new Error("useInterviewContext must be used within an InterviewProvider");
  }

  // Return the context value, which includes the state and dispatch function
  return context;
};
