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
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4 text-orange-600">{title}</h3>

        {/* Request Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-3">
          {/* Name */}
          <div>
            <input
              type="text"
              name="userName"
              placeholder="Your Name"
              className="input input-bordered w-full"
              onChange={formik.handleChange}
              value={formik.values.userName}
            />
            {formik.touched.userName && formik.errors.userName && (
              <p className="text-red-500 text-sm">{formik.errors.userName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="userEmail"
              placeholder="Your Email"
              className="input input-bordered w-full"
              onChange={formik.handleChange}
              value={formik.values.userEmail}
            />
            {formik.touched.userEmail && formik.errors.userEmail && (
              <p className="text-red-500 text-sm">{formik.errors.userEmail}</p>
            )}
          </div>

          {/* Group Size */}
          <div>
            <input
              type="number"
              name="groupSize"
              min={1}
              className="input input-bordered w-full"
              placeholder="Group Size"
              onChange={formik.handleChange}
              value={formik.values.groupSize}
            />
            {formik.touched.groupSize && formik.errors.groupSize && (
              <p className="text-red-500 text-sm">{formik.errors.groupSize}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <input
              type="text"
              name="duration"
              placeholder="e.g. 2 days, 1 week"
              className="input input-bordered w-full"
              onChange={formik.handleChange}
              value={formik.values.duration}
            />
            {formik.touched.duration && formik.errors.duration && (
              <p className="text-red-500 text-sm">{formik.errors.duration}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <input
              type="date"
              name="date"
              className="input input-bordered w-full"
              onChange={formik.handleChange}
              value={formik.values.date}
            />
            {formik.touched.date && formik.errors.date && (
              <p className="text-red-500 text-sm">{formik.errors.date}</p>
            )}
          </div>

          {/* Time */}
          <div>
            <input
              type="time"
              name="time"
              className="input input-bordered w-full"
              onChange={formik.handleChange}
              value={formik.values.time}
            />
            {formik.touched.time && formik.errors.time && (
              <p className="text-red-500 text-sm">{formik.errors.time}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <textarea
              name="message"
              placeholder="What would you like the guide to know?"
              className="textarea textarea-bordered w-full"
              rows={4}
              onChange={formik.handleChange}
              value={formik.values.message}
            ></textarea>
            {formik.touched.message && formik.errors.message && (
              <p className="text-red-500 text-sm">{formik.errors.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="modal-action flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-400 text-gray-500 rounded-full text-sm hover:bg-gray-100 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-orange-500 text-orange-500 rounded-full text-sm hover:bg-orange-500 hover:text-white transition"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
