import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PermissionGate from './PermissionGate';
import DynamicForm from './DynamicForm';
import { PERMISSIONS } from '../constants/roles';

const FormBuilder = () => {
  const { user } = useAuth();
  const [showFormCreator, setShowFormCreator] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [dynamicForms, setDynamicForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showFormPreview, setShowFormPreview] = useState(false);

  useEffect(() => {
    // Load existing forms from localStorage
    const existingForms = JSON.parse(localStorage.getItem('dynamicForms') || '[]');
    setDynamicForms(existingForms);
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleFormCreated = (newForm) => {
    setDynamicForms(prev => [...prev, newForm]);
    showNotification('Dynamic form created successfully!');
  };

  const handleDeleteForm = (formId) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      const updatedForms = dynamicForms.filter(form => form.id !== formId);
      setDynamicForms(updatedForms);
      localStorage.setItem('dynamicForms', JSON.stringify(updatedForms));
      showNotification('Form deleted successfully!');
    }
  };

  const handlePreviewForm = (form) => {
    setSelectedForm(form);
    setShowFormPreview(true);
  };

  const handleFormSubmission = (formId, submissionData) => {
    const updatedForms = dynamicForms.map(form => {
      if (form.id === formId) {
        return {
          ...form,
          submissions: [...form.submissions, {
            id: Date.now(),
            data: submissionData,
            submittedAt: new Date().toISOString(),
            submittedBy: user.name
          }]
        };
      }
      return form;
    });
    setDynamicForms(updatedForms);
    localStorage.setItem('dynamicForms', JSON.stringify(updatedForms));
    showNotification('Form submitted successfully!');
    setShowFormPreview(false);
  };

  const getFormStats = (form) => {
    return {
      totalSubmissions: form.submissions.length,
      lastSubmission: form.submissions.length > 0 
        ? new Date(form.submissions[form.submissions.length - 1].submittedAt).toLocaleDateString()
        : 'No submissions yet'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Notification */}
        {notification.show && (
          <div className={`mb-6 p-4 rounded-md ${
            notification.type === 'error' 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dynamic Form Builder</h1>
              <p className="mt-2 text-gray-600">
                Create and manage dynamic forms with customizable fields
              </p>
            </div>
            <PermissionGate permission="create_content">
              <button
                onClick={() => setShowFormCreator(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <span className="mr-2">➕</span>
                Create New Form
              </button>
            </PermissionGate>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📝</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Forms
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dynamicForms.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Submissions
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dynamicForms.reduce((total, form) => total + form.submissions.length, 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      My Forms
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dynamicForms.filter(form => form.createdById === user.id).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forms List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {dynamicForms.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {dynamicForms.map((form) => {
                const stats = getFormStats(form);
                return (
                  <li key={form.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <span className="text-2xl">📋</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {form.title}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">
                              {form.description}
                            </p>
                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                              <span>{form.fields.length} fields</span>
                              <span>•</span>
                              <span>{stats.totalSubmissions} submissions</span>
                              <span>•</span>
                              <span>Created by {form.createdBy}</span>
                              <span>•</span>
                              <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePreviewForm(form)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          👁️ Preview
                        </button>
                        <button
                          onClick={() => handlePreviewForm(form)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          📝 Fill Form
                        </button>
                        {form.createdById === user.id && (
                          <button
                            onClick={() => handleDeleteForm(form.id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-6 py-12 text-center">
              <span className="text-6xl">📝</span>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No forms created yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Get started by creating your first dynamic form.
              </p>
              <PermissionGate permission="create_content">
                <div className="mt-6">
                  <button
                    onClick={() => setShowFormCreator(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <span className="mr-2">➕</span>
                    Create Your First Form
                  </button>
                </div>
              </PermissionGate>
            </div>
          )}
        </div>

        {/* Form Creator Modal */}
        {showFormCreator && (
          <DynamicForm
            onClose={() => setShowFormCreator(false)}
            onFormSubmit={handleFormCreated}
          />
        )}

        {/* Form Preview/Submission Modal */}
        {showFormPreview && selectedForm && (
          <FormPreview
            form={selectedForm}
            onClose={() => setShowFormPreview(false)}
            onSubmit={(data) => handleFormSubmission(selectedForm.id, data)}
          />
        )}
      </div>
    </div>
  );
};

// Form Preview Component
const FormPreview = ({ form, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleInputChange = (fieldId, value) => {
    setFormData({
      ...formData,
      [fieldId]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    const requiredFields = form.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.id]);
    
    if (missingFields.length > 0) {
      showNotification('Please fill in all required fields', 'error');
      setIsSubmitting(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(formData);
      showNotification('Form submitted successfully!');
    } catch (error) {
      showNotification('Failed to submit form', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const commonProps = {
      id: field.id,
      name: field.id,
      placeholder: field.placeholder,
      required: field.required,
      value: formData[field.id] || '',
      onChange: (e) => handleInputChange(field.id, e.target.value),
      className: "mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    };

    switch (field.type) {
      case 'textarea':
        return <textarea {...commonProps} rows={4} />;
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            {...commonProps}
            checked={formData[field.id] || false}
            onChange={(e) => handleInputChange(field.id, e.target.checked)}
          />
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {['Option 1', 'Option 2', 'Option 3'].map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={formData[field.id] === option}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      default:
        return <input type={field.type} {...commonProps} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{form.title}</h3>
              <p className="text-sm text-gray-500">{form.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Notification */}
          {notification.show && (
            <div className={`mb-6 p-4 rounded-md ${
              notification.type === 'error' 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {notification.message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Form'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;

