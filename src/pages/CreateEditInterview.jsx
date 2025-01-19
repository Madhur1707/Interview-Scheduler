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
import { useInterviewContext } from "@/context/InterviewContext";
import { toast } from "sonner";

const CreateEditInterview = () => {
  const { state, dispatch } = useInterviewContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the interview id from query params
  const queryParams = new URLSearchParams(location.search);
  const interviewId = queryParams.get("id");

  const [formData, setFormData] = useState({
    candidateName: "",
    interviewerName: "",
    date: null,
    timeSlot: "",
    type: "",
  });

  // Popover open state for the date picker
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    if (interviewId) {
      const interview = state.find((i) => i.id === Number(interviewId));
      if (interview) {
        setFormData({
          candidateName: interview.candidateName,
          interviewerName: interview.interviewerName,
          date: new Date(interview.date), // Ensure it's a Date object
          timeSlot: interview.timeSlot,
          type: interview.type,
        });
      }
    }
  }, [interviewId, state]); // Listen for changes in both `interviewId` and `state`

  const handleSubmit = (e) => {
    e.preventDefault();

    // Overlap validation
    const hasOverlap = state.some(
      (interview) =>
        interview.date === format(formData.date, "PPP") &&
        interview.timeSlot === formData.timeSlot &&
        (interview.candidateName === formData.candidateName ||
          interview.interviewerName === formData.interviewerName)
    );

    if (hasOverlap) {
      alert("Overlap detected: The selected time slot is already booked!");
      return;
    }

    if (interviewId) {
      // If editing, update the interview
      dispatch({
        type: "UPDATE_INTERVIEW",
        payload: {
          id: interviewId,
          ...formData,
          date: format(formData.date, "PPP"), // Format the date using date-fns
        },
      });
    } else {
      // If adding a new interview
      dispatch({
        type: "ADD_INTERVIEW",
        payload: {
          id: Date.now(),
          ...formData,
          date: format(formData.date, "PPP"), // Format the date using date-fns
        },
      });
      toast.success("Interview scheduled successfully!");
    }

    // Navigate back to Dashboard
    navigate("/");
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">
          {interviewId ? "Edit Interview" : "Schedule Interview"}
        </h1>
        <Link to="/" className="w-full sm:w-auto">
          <Button
            variant="secondary"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>
      </header>

      {/* Form Section */}
      <form
        className="bg-white shadow rounded p-6 space-y-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block font-medium mb-1">Candidate Name</label>
          <Input
            type="text"
            placeholder="Enter candidate's name"
            value={formData.candidateName}
            onChange={(e) =>
              setFormData({ ...formData, candidateName: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Interviewer Name</label>
          <Input
            type="text"
            placeholder="Enter interviewer's name"
            value={formData.interviewerName}
            onChange={(e) =>
              setFormData({ ...formData, interviewerName: e.target.value })
            }
          />
        </div>

        {/* Date Picker */}
        <div>
          <label className="block font-medium mb-1">Date</label>
          <Popover
            open={isDatePickerOpen}
            onOpenChange={(open) => setDatePickerOpen(open)}
          >
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date instanceof Date && !isNaN(formData.date)
                  ? format(formData.date, "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => {
                  setFormData({ ...formData, date });
                  setDatePickerOpen(false); // Close popover on selection
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Slot */}
        <div>
          <label className="block font-medium mb-1">Time Slot</label>
          <Input
            type="time"
            value={formData.timeSlot}
            onChange={(e) =>
              setFormData({ ...formData, timeSlot: e.target.value })
            }
          />
        </div>

        {/* Interview Type */}
        <div>
          <label className="block font-medium mb-1">Interview Type</label>
          <Select
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="behavioral">Behavioral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full"
        >
          {interviewId ? "Update Interview" : "Save Interview"}
        </Button>
      </form>
    </div>
  );
};

export default CreateEditInterview;
