import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInterviewContext } from "@/context/InterviewContext";
import { format } from "date-fns";
import { ArrowRight, Pencil, Trash, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const [selectedInterview, setSelectedInterview] = useState(null);

  const { state, dispatch } = useInterviewContext();

  // Filter state
  const [filters, setFilters] = useState({
    date: "",
    candidate: "",
    interviewer: "",
  });

  // Filter logic
  const filteredInterviews = state.filter((interview) => {
    return (
      (!filters.date || interview.date === filters.date) &&
      (!filters.candidate ||
        interview.candidateName
          .toLowerCase()
          .includes(filters.candidate.toLowerCase())) &&
      (!filters.interviewer ||
        interview.interviewerName
          .toLowerCase()
          .includes(filters.interviewer.toLowerCase()))
    );
  });

  const handleDelete = (interviewId) => {
    dispatch({ type: "DELETE_INTERVIEW", payload: interviewId });
    setSelectedInterview(null); // Close the dialog after deletion
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0 sm:w-auto">
          Interview Dashboard
        </h1>
        <Link to="/create-edit" className="w-full sm:w-auto">
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 px-4 py-2 w-full sm:w-auto"
          >
            Schedule Interview <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </header>

      {/* Filters Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Candidate Filter */}
          <div>
            <label className="block text-lg font-semibold text-gray-700">
              Candidate
            </label>
            <Input
              type="text"
              placeholder="Search by candidate"
              value={filters.candidate}
              onChange={(e) =>
                setFilters({ ...filters, candidate: e.target.value })
              }
              className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* Interviewer Filter */}
          <div>
            <label className="block  text-lg font-semibold text-gray-700">
              Interviewer
            </label>
            <Input
              type="text"
              placeholder="Search by interviewer"
              value={filters.interviewer}
              onChange={(e) =>
                setFilters({ ...filters, interviewer: e.target.value })
              }
              className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          {/* Date Filter */}
          <div>
            <label className="block text-gray-700 text-lg font-semibold">
              Date
            </label>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="mt-2 w-full p-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInterviews.length === 0 ? (
          <p className="text-gray-500">No interviews scheduled yet.</p>
        ) : (
          filteredInterviews.map((interview) => (
            <Card
              key={interview.id}
              className="group relative rounded-lg overflow-hidden border border-gray-300 hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between border-b border-gray-300 p-4">
                <CardTitle className="text-lg font-medium text-cyan-700 capitalize">
                  <div className="flex justify-center items-center gap-1">
                    <span>
                      <User />
                    </span>{" "}
                    {interview.candidateName}
                    <span className="text-xs text-muted-foreground ">
                      (candidate)
                    </span>
                    {/* Edit Button */}
                    <Link to={`/create-edit?id=${interview.id}`}>
                      <Button
                        variant="ghost"
                        className="absolute top-4 w-20 right-4 p-2 rounded-lg hover:bg-gray-100"
                      >
                        <Pencil className="w-5 h-5" /> Edit
                      </Button>
                    </Link>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative  bg-white">
                {/* Delete Button */}
                <AlertDialog open={selectedInterview?.id === interview.id}>
                  <AlertDialogTrigger>
                    <Button
                      variant="destructive"
                      onClick={() => setSelectedInterview(interview)}
                      className="absolute top-14 w-20 mt-4 right-4 p-2 rounded-lg"
                    >
                      <Trash className="w-5 h-5" /> Delete
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setSelectedInterview(null)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(interview.id)}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <div className="text-lg  font-semibold text-gray-900">
                  <p>
                    <span className="font-semibold text-base text-gray-700">
                      Date:
                    </span>{" "}
                    <span className="text-gray-800 text-sm">
                      {interview.date}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-base text-gray-700">
                      Time:
                    </span>{" "}
                    <span className="text-gray-800 text-sm">
                      {interview.timeSlot
                        ? format(
                            new Date(`1970-01-01T${interview.timeSlot}:00`),
                            "hh:mm a"
                          )
                        : "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-base text-gray-700">
                      Type:
                    </span>{" "}
                    <span className="text-gray-800 text-sm">
                      {interview.type}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
