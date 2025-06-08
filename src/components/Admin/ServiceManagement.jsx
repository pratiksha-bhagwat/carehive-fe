import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import TextField from "../TextField";
import Button from "../Button";
import * as Yup from "yup";
import { useFormik } from "formik";

const ServiceManagement = () => {
    const [servicesList, setServicesList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get("/service/list", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setServicesList(response.data);
        } catch {
            toast.error("Failed to fetch services.");
        } finally {
            setIsLoading(false);
        }
    };

    const validationSchema = Yup.object({
        serviceTitle: Yup.string().required("Service title is required"),
        serviceDescription: Yup.string().required("Service description is required"),
        hourlyPrice: Yup.number().required("Hourly price is required").min(0, "Hourly price must be non-negative"),
    });

    const formik = useFormik({
        initialValues: {
            serviceTitle: "",
            serviceDescription: "",
            hourlyPrice: 0,
        },
        validationSchema,
        onSubmit: async (values) => {
            const url = selectedServiceId ? `/service/update/${selectedServiceId}` : "/service/create";
            const method = selectedServiceId ? "patch" : "post";
            const action = selectedServiceId ? "updated" : "created";

            try {
                await axios[method](url, values, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success(`Service ${action} successfully!`);
                resetForm();
                fetchServices();
            } catch {
                toast.error(`Failed to ${action} service.`);
            } finally {
                setIsCreating(false);
                setIsUpdating(false);
            }
        }
    });

    const resetForm = () => {
        formik.resetForm();
        setSelectedServiceId(null);
    };

    const handleSelectService = (service) => {
        setSelectedServiceId(service.serviceId);
        formik.setFieldValue("serviceTitle", service.serviceTitle);
        formik.setFieldValue("serviceDescription", service.serviceDescription);
        formik.setFieldValue("hourlyPrice", service.hourlyPrice);
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen bg-gradient-to-r from-blue-100 to-gray-300">
            <h2 className="text-2xl font-bold text-blue-700 text-center mt-4 mb-6">Service Management</h2>
            <div className="grid md:grid-cols-2 gap-8">
                {/* Service List */}
                <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
                    <h3 className="text-lg font-semibold text-blue-600 mb-4">Available Services</h3>
                    {isLoading ? (
                        <p className="text-gray-500">Loading services...</p>
                    ) : servicesList.length ? (
                        <div className="space-y-4">
                            {servicesList.map((service) => (
                                <div key={service.serviceId} className="p-4 bg-gray-50 rounded-lg shadow">
                                    <h4 className="font-semibold text-blue-700">{service.serviceTitle}</h4>
                                    <p className="text-gray-600 text-sm">{service.serviceDescription}</p>
                                    <p className="text-gray-800 font-bold">₹{service.hourlyPrice} /hr</p>
                                    <Button
                                        onClick={() => handleSelectService(service)}
                                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    >
                                        Edit
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No services available.</p>
                    )}
                </div>

                {/* Service Form */}
                {/* Service Form */}
                <div className=" bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500 h-[500px] overflow-y-auto">
                    <h3 className="text-lg font-semibold text-blue-600 mb-4">
                        {selectedServiceId ? "Update Service" : "Create Service"}
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <TextField
                                label="Service Title"
                                value={formik.values.serviceTitle}
                                onChange={formik.handleChange}
                                fullWidth
                            />
                        </div>
                        <div>
                            <TextField
                                label="Service Description"
                                value={formik.values.serviceDescription}
                                onChange={formik.handleChange}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <TextField
                                label="Hourly Price (₹)"
                                value={formik.values.hourlyPrice}
                                onChange={formik.handleChange}
                                type="number"
                                fullWidth
                            />
                        </div>
                        <Button
                            onClick={formik.handleSubmit}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full"
                            disabled={!formik.isValid || isCreating || isUpdating}
                        >
                            {selectedServiceId ? "Update Service" : "Create Service"}
                        </Button>
                        {selectedServiceId && (
                            <Button
                                onClick={formik.resetForm}
                                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 w-full mt-2"
                            >
                                Cancel Edit
                            </Button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ServiceManagement;