import React, { useState } from 'react';
import axios from 'axios';


const CreateCertificate = () => {

  const [formData, setFormData] = useState({
    recipientName: '',
    completionDate: '',
  });

  const [response, setResponse] = useState(null);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    
console.log("Response...................", formData);
    e.preventDefault();
    console.log("Form data being sent:", formData);

    try {
      const res = await axios.post(
        'https://certificate-manager-backend-bbsq.onrender.com/submit',
        {"name":formData.recipientName,"date":formData.completionDate}, // Request body
        {
          headers: { 'Content-Type': 'application/json' }, // Ensure JSON content type
        }
      );
      setResponse(res.data);
      console.log('Response from server:', res.data);
      alert("Certificate Created Successfully");
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Create Certificate</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <form onSubmit={handleSubmit} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input
                    id="recipientName"
                    name="recipientName"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Recipient Name"
                    value={formData.recipientName}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="recipientName" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Recipient Name</label>
                </div>

                <div className="relative">
                  <input
                    id="completionDate"
                    name="completionDate"
                    type="date"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    value={formData.completionDate}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="completionDate" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Completion Date</label>
                </div>
                <div className="relative">
                  <button className="bg-blue-500 text-white rounded-md px-2 py-1">Create Certificate</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCertificate;

