import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useInterviewContext } from "@/context/InterviewContext";

/**
 * CreateEditInterview component for scheduling or editing interviews.
 */
const CreateEditInterview = () => {
  // Access context state and dispatch function
  const { state, dispatch } = useInterviewContext();

  // Define local state variables
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [formData, setFormData] = useState({
    candidateName: "",
    interviewerName: "",
    date: null,
    timeSlot: "",
    type: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const interviewId = queryParams.get("id");

  // Populate form data if editing an existing interview
  useEffect(() => {
    if (interviewId) {
      const interview = state.find((i) => i.id === Number(interviewId));
      if (interview) {
        setFormData({
          candidateName: interview.candidateName,
          interviewerName: interview.interviewerName,
          date: new Date(interview.date),
          timeSlot: interview.timeSlot,
          type: interview.type,
        });
      }
    }
  }, [interviewId, state]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    if (
      !formData.date ||
      !formData.timeSlot ||
      !formData.type ||
      !formData.candidateName ||
      !formData.interviewerName
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const formattedDate = format(formData.date, "yyyy-MM-dd");

    // Check for overlapping interviews
    const hasOverlap = state.some(
      (interview) =>
        interview.id !== Number(interviewId) &&
        interview.date === formattedDate &&
        interview.timeSlot === formData.timeSlot &&
        (interview.candidateName === formData.candidateName ||
          interview.interviewerName === formData.interviewerName)
    );

    if (hasOverlap) {
      toast.error("This time slot conflicts with an existing interview");
      return;
    }

    // Prepare interview data
    const interviewData = {
      id: interviewId ? Number(interviewId) : Date.now(),
      ...formData,
      date: formattedDate,
    };

    // Dispatch appropriate action
    if (interviewId) {
      dispatch({
        type: "UPDATE_INTERVIEW",
        payload: interviewData,
      });
      toast.success("Interview updated successfully");
    } else {
      dispatch({
        type: "ADD_INTERVIEW",
        payload: interviewData,
      });
      toast.success("Interview scheduled successfully");
    }

    navigate("/");
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Header Section */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          {interviewId ? "Edit Interview" : "Schedule Interview"}
        </h1>
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Back
          </Button>
        </Link>
      </header>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6">
          {/* Candidate Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Candidate Name <span className="text-red-500">*</span>
            </label>
            <Input
              required
              placeholder="Enter candidate name"
              value={formData.candidateName}
              onChange={(e) =>
                setFormData({ ...formData, candidateName: e.target.value })
              }
              className="p-3 text-gray-900 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Interviewer Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interviewer Name <span className="text-red-500">*</span>
            </label>
            <Input
              required
              placeholder="Enter interviewer name"
              value={formData.interviewerName}
              onChange={(e) =>
                setFormData({ ...formData, interviewerName: e.target.value })
              }
              className="p-3 text-gray-900 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <Popover open={isDatePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal p-3 border rounded-lg",
                    !formData.date && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5 text-indigo-500" />
                  {formData.date instanceof Date && !isNaN(formData.date)
                    ? format(formData.date, "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => {
                    setFormData({ ...formData, date });
                    setDatePickerOpen(false);
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Slot Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time <span className="text-red-500">*</span>
            </label>
            <Input
              type="time"
              required
              value={formData.timeSlot}
              onChange={(e) =>
                setFormData({ ...formData, timeSlot: e.target.value })
              }
              className="p-3 text-gray-900 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Interview Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                <SelectValue placeholder="Select interview type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="behavioral">Behavioral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          {interviewId ? "Update Interview" : "Schedule Interview"}
        </Button>
      </form>
    </div>
  );
};

export default CreateEditInterview;
