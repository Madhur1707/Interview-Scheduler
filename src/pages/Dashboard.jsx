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

  // State for filters
  const [filters, setFilters] = useState({
    date: "",
    candidate: "",
    interviewer: "",
  });

  // Apply filters to interviews
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

  // Handle interview deletion
  const handleDelete = (interviewId) => {
    dispatch({ type: "DELETE_INTERVIEW", payload: interviewId });
    setSelectedInterview(null);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Interview Dashboard
        </h1>
        <Link to="/create-edit">
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 px-4 py-2"
          >
            Schedule Interview <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </header>

      {/* Filters Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FilterInput
            label="Candidate"
            placeholder="Search by candidate"
            value={filters.candidate}
            onChange={(value) => setFilters({ ...filters, candidate: value })}
          />
          <FilterInput
            label="Interviewer"
            placeholder="Search by interviewer"
            value={filters.interviewer}
            onChange={(value) => setFilters({ ...filters, interviewer: value })}
          />
          <FilterInput
            label="Date"
            type="date"
            value={filters.date}
            onChange={(value) => setFilters({ ...filters, date: value })}
          />
        </div>
      </div>

      {/* Interview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInterviews.length === 0 ? (
          <p className="text-black text-lg font-semibold">
            No interviews scheduled yet...
          </p>
        ) : (
          filteredInterviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Reusable Filter Input Component
const FilterInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}) => (
  <div>
    <label className="block text-lg font-semibold text-gray-700">{label}</label>
    <Input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
    />
  </div>
);

// Reusable Interview Card Component
const InterviewCard = ({ interview, onDelete }) => (
  <Card className="group relative rounded-lg overflow-hidden border border-gray-300 hover:shadow-lg transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between border-b border-gray-300 p-4">
      <CardTitle className="text-lg font-medium text-cyan-700 capitalize">
        <div className="flex items-center gap-1">
          <User className="w-5 h-5" />
          {interview.candidateName}
          <span className="text-xs text-muted-foreground">(candidate)</span>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent className="bg-white p-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-semibold">Interviewer:</span>{" "}
            {interview.interviewerName}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Date:</span> {interview.date}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Time:</span>{" "}
            {format(new Date(`1970-01-01T${interview.timeSlot}`), "h:mm a")}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Type:</span> {interview.type}
          </p>
        </div>
        <div className="space-y-8">
          <Link to={`/create-edit?id=${interview.id}`}>
            <Button variant="ghost" className="flex items-center gap-2">
              <Pencil className="w-4 h-4" /> Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash className="w-4 h-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Interview</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this interview? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(interview.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default Dashboard;
