'use client';

import { useState, useEffect } from "react";

export default function UserStatusTable() {
  const [checks, setChecks] = useState([
    { label: 'Row Level Security', status: 'N/A' },
    { label: 'MFA Check', status: 'N/A' },
    { label: 'Point In Time Recovery', status: 'N/A' }
  ]);
  const [mfaTags, setmfaTags] = useState([]);
  const [error, setError] = useState(null);
  const [rlsStatus, setRlsStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const storedUserId = sessionStorage.getItem('user_id');
  let logs = []

  useEffect(() => {
    const fetchPITRStatus = async () => {
      try {
        const response = await fetch('/api/pitr');
        if (!response.ok) {
          throw new Error(`Failed to fetch PITR status: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('pitr response: ', data)
        logs.push({'data': data, timestamp: new Date().toISOString()})
        setChecks(prevChecks => {
          const newChecks = [...prevChecks];
          const pitrCheckIndex = newChecks.findIndex(check => check.label === 'Point In Time Recovery');
          if (pitrCheckIndex !== -1) {
            const allPITREnabled = Object.values(data).every(table => table?.pitrEnabled === true);
            newChecks[pitrCheckIndex].status = allPITREnabled ? 'Pass' : 'Fail';
          }
          return newChecks;
        });
      } catch (error) {
        console.error("Error fetching PITR status:", error);
        logs.push({'error': error, timestamp: new Date().toISOString()})
        setError(error.message);
      }
    };

    fetchPITRStatus();
  }, []);

  useEffect(() => {
    const fetchRLSStatus = async () => {
      try {
        const response = await fetch('/api/tables');
        if (!response.ok) {
          throw new Error(`Failed to fetch RLS status: ${response.statusText}`);
        }
        const data = await response.json();
        logs.push({'data': data, timestamp: new Date().toISOString()})
        setRlsStatus(data);
        setChecks(prevChecks => {
          const newChecks = [...prevChecks];
          const rlsCheckIndex = newChecks.findIndex(check => check.label === 'Row Level Security');
          if (rlsCheckIndex !== -1) {
            const allRLSEnabled = Object.values(data).every(table => table?.rlsEnabled === true);
            newChecks[rlsCheckIndex].status = allRLSEnabled ? 'Pass' : 'Fail';
          }
          return newChecks;
        });
      } catch (error) {
        console.error("Error fetching RLS status:", error);
        logs.push({'error': error, timestamp: new Date().toISOString()})
        setError(error.message);
      }
    };

    fetchRLSStatus();
    
  }, []);

  useEffect(() => {
    const fetchMFAs = async () => {
      try {
        const response = await fetch('/api/mfa');
        if (!response.ok) {
          throw new Error(`Failed to fetch MFA status: ${response.statusText}`);
        }
        const data = await response.json();
        logs.push({'data': data, timestamp: new Date().toISOString()})
        console.log(data);
        let allmfatags = []
        for (const row of data) {
          if (row.id != storedUserId) {
            allmfatags.push({'email': row.email, 'mfaStatus': row.has_mfa})
          }
        }
        setmfaTags(allmfatags);
        setChecks(prevChecks => {
          const newChecks = [...prevChecks];
          const mfaCheckIndex = newChecks.findIndex(check => check.label === 'MFA Check');
          if (mfaCheckIndex !== -1) {
            const allMFAEnabled = Object.values(data).every(table => table?.has_mfa === true);
            newChecks[mfaCheckIndex].status = allMFAEnabled ? 'Pass' : 'Fail';
          }
          return newChecks;
        });
      } catch (error) {
        console.error("Error fetching MFA status:", error);
        logs.push({'error': error, timestamp: new Date().toISOString()})
        setError(error.message);
      }
    };

    fetchMFAs();
  }, []);

  useEffect(() => {
    if (Object.keys(rlsStatus).length > 0 && mfaTags.length > 0) {
      console.log(mfaTags)
      setLoading(false);
    }
  }, [rlsStatus, mfaTags]);

  const MFARenderStatus = (isEnabled) => {
    return (
      <span
        className={`px-2 py-1 rounded-md ${isEnabled ? 'bg-teal-800 text-gray-300' : 'bg-red-900 text-gray-300'}`}
      >
        {isEnabled ? 'Enabled' : 'Disabled'}
      </span>
    );
  };

  const RLSRenderStatus = (isEnabled) => {
    return (
      <span
        className={`px-2 py-1 rounded-md ${isEnabled ? 'bg-teal-800 text-gray-300' : 'bg-red-900 text-gray-300'}`}
      >
        {isEnabled ? 'Enabled' : 'Disabled'}
      </span>
    );
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-3 gap-4">
          {checks.map((check, index) => (
            <div
              key={index}
              className="p-4 m-3 rounded-lg shadow-lg text-gray-200 flex justify-center items-center"
            >
              <span
                className={`inline-block w-3 h-3 rounded-xl mr-3 ${check.status === 'Pass' ? 'bg-teal-800' : (check.status === 'Fail' ? 'bg-red-900' : 'bg-gray-600')
                  }`}
              ></span>
              <h3 className="text-md">{check.label}</h3>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center h-[60vh] mt-20">
          <div className="animate-spin h-16 w-16 border-t-4 border-blue-500 border-solid rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {checks.map((check, index) => (
          <div
            key={index}
            className="p-4 m-3 rounded-lg shadow-lg text-gray-200 flex justify-center items-center"
          >
            <span
              className={`inline-block w-3 h-3 rounded-xl mr-3 ${check.status === 'Pass' ? 'bg-teal-800' : (check.status === 'Fail' ? 'bg-red-900' : 'bg-gray-600')
                }`}
            ></span>
            <h3 className="text-md">{check.label}</h3>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        <div className="bg-black text-gray-200 shadow overflow-hidden rounded-xl flex-1">
          <h2 className="text-lg font-bold px-6 py-3">Row-Level Security Status</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider border-b border-gray-700">
                  Table Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider border-b border-gray-700">
                  RLS
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(rlsStatus).map(([tableName, status]) => (
                <tr key={tableName} className="bg-black">
                  <td className="px-6 py-4 whitespace-nowrap text-md font-extralight">
                    {tableName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-md">
                    {RLSRenderStatus(status?.rlsEnabled)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-black text-gray-200 shadow overflow-hidden rounded-xl flex-1">
          <h2 className="text-lg font-bold px-6 py-3">Multi-Factor Authentication Status</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider border-b border-gray-700">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider border-b border-gray-700">
                  MFA Status
                </th>
              </tr>
            </thead>
            <tbody>
              {mfaTags.map((user) => (
                <tr key={user.email} className="bg-black">
                  <td className="px-6 py-4 whitespace-nowrap text-md font-extralight">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-md">
                    {MFARenderStatus(user.mfaStatus)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
