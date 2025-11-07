import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PermissionGate from './PermissionGate';
import { PERMISSIONS } from '../constants/roles';

const DynamicForm = ({ onClose, onFormSubmit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fields: [
      { id: 1, label: '', type: 'text', required: false, placeholder: '' }
    ]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFieldChange = (fieldId, fieldName, value) => {
    setFormData({
      ...formData,
      fields: formData.fields.map(field =>
        field.id === fieldId
          ? { ...field, [fieldName]: value }
          : field
      )
    });
  };

  const addField = () => {
    const newField = {
      id: Date.now(),
      label: '',
      type: 'text',
      required: false,
      placeholder: ''
    };
    setFormData({
      ...formData,
      fields: [...formData.fields, newField]
    });
  };

  const removeField = (fieldId) => {
    if (formData.fields.length > 1) {
      setFormData({
        ...formData,
        fields: formData.fields.filter(field => field.id !== fieldId)
      });
    } else {
      showNotification('At least one field is required', 'error');
    }
  };

  const duplicateField = (fieldId) => {
    const fieldToDuplicate = formData.fields.find(field => field.id === fieldId);
    if (fieldToDuplicate) {
      const newField = {
        ...fieldToDuplicate,
        id: Date.now()
      };
      setFormData({
        ...formData,
        fields: [...formData.fields, newField]
      });
    }
  };

  const moveField = (fieldId, direction) => {
    const currentIndex = formData.fields.findIndex(field => field.id === fieldId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < formData.fields.length) {
      const newFields = [...formData.fields];
      [newFields[currentIndex], newFields[newIndex]] = [newFields[newIndex], newFields[currentIndex]];
      setFormData({
        ...formData,
        fields: newFields
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.title.trim()) {
      showNotification('Form title is required', 'error');
      setIsSubmitting(false);
      return;
    }

    if (!formData.description.trim()) {
      showNotification('Form description is required', 'error');
      setIsSubmitting(false);
      return;
    }

    // Validate fields
    const hasEmptyFields = formData.fields.some(field => !field.label.trim());
    if (hasEmptyFields) {
      showNotification('All field labels are required', 'error');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const dynamicForm = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        fields: formData.fields,
        createdBy: user.name,
        createdById: user.id,
        createdAt: new Date().toISOString(),
        submissions: []
      };

      // Store in localStorage
      const existingForms = JSON.parse(localStorage.getItem('dynamicForms') || '[]');
      existingForms.push(dynamicForm);
      localStorage.setItem('dynamicForms', JSON.stringify(existingForms));

      showNotification('Dynamic form created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        fields: [
          { id: 1, label: '', type: 'text', required: false, placeholder: '' }
        ]
      });

      // Notify parent component
      onFormSubmit && onFormSubmit(dynamicForm);

      // Close modal after a short delay
      setTimeout(() => {
        onClose && onClose();
      }, 1500);

    } catch (error) {
      showNotification('Failed to create form. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Number' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio Button' },
    { value: 'date', label: 'Date' },
    { value: 'file', label: 'File Upload' }
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Create Dynamic Form</h3>
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
            {/* Form Basic Info */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Form Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Form Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter form title"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Describe what this form is for"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Fields */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Form Fields</h4>
                <button
                  type="button"
                  onClick={addField}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <span className="mr-1">➕</span>
                  Add Field
                </button>
              </div>

              <div className="space-y-4">
                {formData.fields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Field {index + 1}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => moveField(field.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          title="Move up"
                        >
                          ⬆️
                        </button>
                        <button
                          type="button"
                          onClick={() => moveField(field.id, 'down')}
                          disabled={index === formData.fields.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          title="Move down"
                        >
                          ⬇️
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateField(field.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Duplicate field"
                        >
                          📋
                        </button>
                        <button
                          type="button"
                          onClick={() => removeField(field.id)}
                          disabled={formData.fields.length === 1}
                          className="p-1 text-red-400 hover:text-red-600 disabled:opacity-50"
                          title="Remove field"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Label *
                        </label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Field label"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          value={field.type}
                          onChange={(e) => handleFieldChange(field.id, 'type', e.target.value)}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          {fieldTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Placeholder
                        </label>
                        <input
                          type="text"
                          value={field.placeholder}
                          onChange={(e) => handleFieldChange(field.id, 'placeholder', e.target.value)}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Placeholder text"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          id={`required-${field.id}`}
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => handleFieldChange(field.id, 'required', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`required-${field.id}`} className="ml-2 block text-sm text-gray-900">
                          Required
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                    Creating Form...
                  </>
                ) : (
                  'Create Dynamic Form'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
