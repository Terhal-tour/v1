// This reusable modal handles both creating and editing guide requests with validation
import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

export default function GuideRequestModal({
  guideId,
  onClose,
  initialValues,
  onSubmit,
  title = "Request a Tour Guide",
}) {
  const token = sessionStorage.getItem("jwt");

  // Validation schema using Yup
  const validationSchema = yup.object().shape({
    userName: yup.string().min(3).required("Name is required"),
    userEmail: yup.string().email().required("Email is required"),
    message: yup.string().min(20).required("Message is required"),
    date: yup.string().required("Date is required"),
    time: yup.string().required("Time is required"),
    duration: yup.string().required("Duration is required"),
    groupSize: yup.number().min(1).required("Group size is required"),
  });

  // Formik form setup
  const formik = useFormik({
    initialValues: initialValues || {
      userName: "",
      userEmail: "",
      message: "",
      date: "",
      time: "",
      duration: "",
      groupSize: 1,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
        toast.success("Guide request processed successfully");
        onClose();
        formik.resetForm();
      } catch (err) {
        console.error(err);
        toast.error("Failed to process guide request");
      }
    },
  });

  return (
    <dialog open className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-md mx-auto bg-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
          <div className="w-12 h-1 bg-orange-500 mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Request Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="userName"
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none"
              onChange={formik.handleChange}
              value={formik.values.userName}
            />
            {formik.touched.userName && formik.errors.userName && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.userName}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="userEmail"
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none"
              onChange={formik.handleChange}
              value={formik.values.userEmail}
            />
            {formik.touched.userEmail && formik.errors.userEmail && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.userEmail}</p>
            )}
          </div>

          {/* Group Size and Duration Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Size *
              </label>
              <input
                type="number"
                name="groupSize"
                min={1}
                placeholder="1"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none"
                onChange={formik.handleChange}
                value={formik.values.groupSize}
              />
              {formik.touched.groupSize && formik.errors.groupSize && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.groupSize}</p>
              )}
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                placeholder="2 days, 1 week"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none"
                onChange={formik.handleChange}
                value={formik.values.duration}
              />
              {formik.touched.duration && formik.errors.duration && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.duration}</p>
              )}
            </div>
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date *
              </label>
              <input
                type="date"
                name="date"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none"
                onChange={formik.handleChange}
                value={formik.values.date}
              />
              {formik.touched.date && formik.errors.date && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.date}</p>
              )}
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time *
              </label>
              <input
                type="time"
                name="time"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none"
                onChange={formik.handleChange}
                value={formik.values.time}
              />
              {formik.touched.time && formik.errors.time && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.time}</p>
              )}
            </div>
          </div>

          {/* Message Field */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Message *
            </label>
            <textarea
              name="message"
              placeholder="Tell us about your preferences, special requirements, or what you'd like to explore..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
              rows={4}
              onChange={formik.handleChange}
              value={formik.values.message}
            ></textarea>
            {formik.touched.message && formik.errors.message && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              className="cursor-pointer flex-1 px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}