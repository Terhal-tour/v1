import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AdminForm({ initialData, onSubmitSuccess }) {
  const token = sessionStorage.getItem("jwt");

  const initialValues = {
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: '', // Only set on create or if admin wants to reset
    isSuper: initialData?.isSuper || false,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: initialData?._id ? Yup.string() : Yup.string().min(6, 'Min 6 chars').required('Password is required'),
    isSuper: Yup.boolean(),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = { ...values };
      console.log(payload);

      if (!payload.password) {
        delete payload.password; // Don’t send empty password on update
      }

      if (initialData?._id) {
        await axios.put(`https://backend-mu-ten-26.vercel.app/admin/${initialData._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`https://backend-mu-ten-26.vercel.app/admin`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      toast.success("Admin saved successfully!");
      onSubmitSuccess?.();
      resetForm();
    } catch (error) {
      console.error("Error saving admin:", error);
      toast.error("Error saving admin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border border-[var(--temple-gray)] rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 space-y-6">
      <h2 className="text-2xl font-bold text-[var(--oasis-green)]">
        {initialData?._id ? 'Edit Admin' : 'Add Admin'}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-[var(--text-color)] font-semibold mb-1">Name</label>
              <Field name="name" className="input input-bordered w-full" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-[var(--text-color)] font-semibold mb-1">Email</label>
              <Field name="email" type="email" className="input input-bordered w-full" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-[var(--text-color)] font-semibold mb-1">
                {initialData?._id ? 'New Password (optional)' : 'Password'}
              </label>
              <Field name="password" type="password" className="input input-bordered w-full" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="flex items-center gap-2">
              {!initialData ? (
                // ✅ If creating → show the isSuper checkbox
                <div className="flex items-center gap-2">
                  <label className="text-[var(--text-color)] font-semibold">Is Super Admin</label>
                  <Field name="isSuper">
                    {({ field, form }) => (
                      <input
                        type="checkbox"
                        className="checkbox checkbox-success"
                        checked={field.value}
                        onChange={() => form.setFieldValue('isSuper', !field.value)}
                      />
                    )}
                  </Field>
                </div>
              ) : (
                // ✅ If editing → just show the status tag
                <div className="flex items-center gap-2">
                  <label className="text-[var(--text-color)] font-semibold"> Admin Status:</label>
                  {initialData.isSuper ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Super Admin</span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">Ordinary Admin</span>
                  )}
                </div>
              )}

            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn bg-[var(--oasis-green)] hover:bg-green-700 text-white transition duration-300"
            >
              {isSubmitting ? 'Saving...' : 'Save Admin'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
