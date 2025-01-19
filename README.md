# Interview Scheduling App

* This app allows users to schedule, edit, and delete interviews. It provides a user-friendly interface with features such as date and time selection, candidate and interviewer management, and filtering of scheduled interviews.

* Live Demo :- https://interview-scheduler-eight.vercel.app/


## Follow these instructions to set up the project on your local machine.

## Installation
* Clone the Repository:
git clone https://github.com/Madhur1707/Interview-Scheduler.git

cd Interview-Scheduler

## Install Dependencies:

* Using npm:
npm install

## Running the App
* Start the Development Server:

npm run dev

Open your browser and navigate to:
http://localhost:3000


## Design Decisions:

* Context API for Global State The app uses React's Context API and a reducer to manage the state for scheduled interviews. This allows for efficient state management and easy access across different components.

* Local Storage Persistence The interview data is persisted in the browser’s localStorage. This ensures that even if the user refreshes the page, the data remains intact.

* UI Components The app uses Tailwind CSS for styling, providing a simple, clean, and responsive design. Shadcn UI components such as Button, Input, and Card are used for a consistent user interface.

* Modular Components The app is designed using reusable components like FilterInput, InterviewCard, and CreateEditInterview, which helps in maintaining clean and scalable code.

## Challenges Faced

* Date and Time Conflicts Handling potential date and time conflicts between scheduled interviews required additional logic to check for overlaps. This ensures that the same candidate or interviewer is not scheduled for multiple interviews at the same time.




