"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ReportForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files?.[0] || null, // Safer null check
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      if (!session?.user?.user_id) {
        throw new Error("You must be logged in to submit a report");
      }

      if (!formData.title || !formData.description) {
        throw new Error("Title and description are required");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("user_id", session.user.user_id);

      if (formData.image) {
        if (formData.image.size > 5 * 1024 * 1024) {
          throw new Error("File size must be less than 5MB");
        }
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch("http://127.0.0.1:8000/api/reports/", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit report");
      }

      setFormData({ title: "", description: "", image: null });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(formData);
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
        <h1 className="text-2xl font-bold text-center text-gray-100 mb-6">
          Report Your Problem
          <span className="block mt-1 text-sm font-normal text-gray-400">
            We&rsquo;ll help you resolve it quickly
          </span>
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 text-red-300 rounded-lg border border-red-800/50">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-900/30 text-green-300 rounded-lg border border-green-800/50">
            ✅ Report submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-gray-300 font-medium">Report Title</Label>
            <Input
              type="text"
              className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief summary of the issue"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300 font-medium">Details</Label>
            <Textarea
              className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
              placeholder="Describe the problem in detail..."
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300 font-medium">Attachments</Label>
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <Input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={isSubmitting}
                />
                <div className="w-full p-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors">
                  <span className="text-gray-300 text-sm flex items-center gap-2">
                    <PaperclipIcon className="w-4 h-4" />
                    {formData.image ? formData.image.name : "Choose file..."}
                  </span>
                </div>
              </label>
              {formData.image && (
                <span className="text-sm text-gray-400">
                  {(formData.image.size / 1024).toFixed(1)}KB
                </span>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-gray-50 font-semibold py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2Icon className="w-4 h-4 animate-spin" />
                Submitting...
              </div>
            ) : (
              "Submit Report"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

// Icons
const PaperclipIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const Loader2Icon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default ReportForm;
