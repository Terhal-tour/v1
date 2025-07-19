import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import "../../css/adminCrudPlacesPage.css";
import { toast } from "react-toastify";

export default function PlaceForm({ initialData, onSubmitSuccess }) {
    const token = sessionStorage.getItem("jwt");
    const [categories, setCategories] = useState([])

    // fetch categories 
    useEffect(() => {

        axios.get(`http://localhost:3000/categories`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                console.log(res.data.categories);
                setCategories(res.data.categories)
            })
            .catch((err) => console.error("Error fetching categories:", err))

    }, []);

    const [imagePreview, setImagePreview] = useState(initialData?.image || '');

    const initialValues = {
        name: initialData?.name || '',
        description: initialData?.description || '',
        location: initialData?.location || '',
        address: initialData?.address || '',
        category: initialData?.category || '',
        coordinates: initialData?.coordinates || '',
        image: initialData?.image || '',
        rating: initialData?.rating || 0,
        visible: initialData?.visible || false,
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        description: Yup.string().required('Required'),
        location: Yup.string().url('Must be a valid URL').required('Required'),
        address: Yup.string().required('Required'),
        category: Yup.string().required('Required'),
        coordinates: Yup.string().required('Required'),
        image: Yup.string().url('Must be a valid URL').required('Required'),
        rating: Yup.number().min(0).max(5).required('Required'),
        visible: Yup.boolean(),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            if (initialData?._id) {
                await axios.put(`http://localhost:3000/admin/place/${initialData._id}`, values, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                await axios.post(`http://localhost:3000/admin/place`, values, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            toast.success("success");

            onSubmitSuccess?.();
            resetForm();
        } catch (error) {
            console.error('Error saving place:', error);
            toast.error("Error saving place.");

        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white border border-[var(--temple-gray)] rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 space-y-6">
            <h2 className="text-2xl font-bold text-[var(--oasis-green)]">
                {initialData?._id ? 'Edit Place' : 'Add Place'}
            </h2>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values, setFieldValue }) => (
                    <Form className="space-y-4">
                        <div>
                            <label className="block text-[var(--text-color)] font-semibold mb-1">Name</label>
                            <Field name="name" className="input input-bordered w-full transition duration-200 focus:shadow-lg" />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block text-[var(--text-color)] font-semibold mb-1">Description</label>
                            <Field as="textarea" name="description" className="textarea textarea-bordered w-full transition duration-200 focus:shadow-lg" />
                            <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block text-[var(--text-color)] font-semibold mb-1">Location URL</label>
                            <Field name="location" className="input input-bordered w-full transition duration-200 focus:shadow-lg" />
                            <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block text-[var(--text-color)] font-semibold mb-1">Address</label>
                            <Field name="address" className="input input-bordered w-full transition duration-200 focus:shadow-lg" />
                            <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block text-[var(--text-color)] font-semibold mb-1">Category</label>
                            <Field as="select" name="category" className="select select-bordered w-full transition duration-200 focus:shadow-lg">
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.title} value={cat.title}>{cat.title}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="category" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block text-[var(--text-color)] font-semibold mb-1">Coordinates</label>
                            <Field name="coordinates" className="input input-bordered w-full transition duration-200 focus:shadow-lg" />
                            <ErrorMessage name="coordinates" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block text-[var(--text-color)] font-semibold mb-1">Image URL</label>
                            <Field
                                name="image"
                                className="input input-bordered w-full transition duration-200 focus:shadow-lg"
                                onChange={(e) => {
                                    const url = e.target.value;
                                    setFieldValue('image', url);
                                    setImagePreview(url);
                                }}
                            />
                            <ErrorMessage name="image" component="div" className="text-red-500 text-sm" />

                            {imagePreview && (
                                <div className="mt-3">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-w-full max-h-64 border border-[var(--temple-gray)] rounded-lg shadow"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-[var(--text-color)] font-semibold mb-1">Rating (0-5)</label>
                            <Field
                                name="rating"
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                className="input input-bordered w-full transition duration-200 focus:shadow-lg"
                            />
                            <ErrorMessage name="rating" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-[var(--text-color)] font-semibold">Visible</label>
                            <Field name="visible">
                                {({ field, form }) => (
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-success"
                                        checked={field.value}
                                        onChange={() => form.setFieldValue('visible', !field.value)}
                                    />
                                )}
                            </Field>                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn bg-[var(--oasis-green)] hover:bg-green-700 text-white transition duration-300"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Place'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>

    );
}
