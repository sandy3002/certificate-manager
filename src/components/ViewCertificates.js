import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { Certificate } from './Connect';




const connectDB = require('./Database');
// const Certificate = require('./models/Certificate');
connectDB();








// const ViewCertificates = () => {
//   const [certificates, setCertificates] = useState([]);

//   useEffect(() => {
//     const fetchCertificates = async () => {
//       try {
//         const response = await axios.get('https://certificate-manager-backend-bbsq.onrender.com/certificates');
//         setCertificates(response.data);
//       } catch (error) {
//         console.error('Error fetching certificates:', error);
//       }
//     };

//     fetchCertificates();
//   }, []);




const ViewCertificates = () => {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    // TODO: Fetch certificates from the backend
    const fetchCertificates = async () => {
      try {
      const response = await Certificate.find();
      // console.log("Response...............", response.data);
      
      setCertificates(response.data);
      } catch (error) {
      console.error('Error fetching certificates:', error);
      }
    };
    fetchCertificates();





    // For now, we'll use dummy data
    const dummyCertificates = [
      { id: 1, recipientName: 'John Doe', completionDate: '2023-05-15', certificateLink: 'https://example.com/certificate1' },
      { id: 2, recipientName: 'Jane Smith', completionDate: '2023-05-20', certificateLink: 'https://example.com/certificate1' },
    ];
    setCertificates(dummyCertificates);
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div>
          <h2 className="text-2xl font-semibold leading-tight">Certificates</h2>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Recipient Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Completion Date
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Certificate Link
                  </th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((certificate) => (
                  <tr key={certificate.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{certificate.recipientName}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{certificate.completionDate}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{certificate.certificateLink}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCertificates;

