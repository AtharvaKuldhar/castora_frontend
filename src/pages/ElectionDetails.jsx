// import React from 'react'

// const ElectionDetails = () => {
//   return (
//     <section className="flex min-h-screen">
//       {/* Sidebar stays on the left */}
//       <div className="w-64 border-r border-gray-200">
//         <Sidebar />
//       </div>

//       {/* Main content next to the sidebar */}
//       <div className="flex-1 p-6">
//         <header className="flex justify-between items-center mb-8"></header>
//       </div>
//     </section>
//   )
// }

// export default ElectionDetails

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/SidebarLeft';
import { ethers } from 'ethers';
import ElectionABI from '../abi/ElectionABI.json';

const ElectionDetails = () => {
  const { id } = useParams();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElectionDetails = async () => {
      try {
        setLoading(true);
        // Fetch election from backend
        const res = await axios.get(`http://localhost:5001/election/${id}`, {
          headers: { token: localStorage.getItem('token') },
        });
        const electionData = res.data.election;
        setElection(electionData);

        // Fetch candidates
        const candidateRes = await axios.post(
          `http://localhost:5001/getCandidatesByElection`,
          { election_id: id },
          { headers: { token: localStorage.getItem('token') } }
        );
        let fetchedCandidates = candidateRes.data.candidates;

        // Verify with blockchain
        if (electionData.contractAddress) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(electionData.contractAddress, ElectionABI, provider);
          const onChainCandidates = await contract.candidates();
          fetchedCandidates = fetchedCandidates.filter(c => 
            onChainCandidates.includes(c.id.toString())
          );
        }

        setCandidates(fetchedCandidates);
      } catch (err) {
        console.error('Error fetching election details:', err);
        setElection(null);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchElectionDetails();
  }, [id]);

  return (
    <section className="flex min-h-screen">
      <div className="w-64 border-r border-gray-200">
        <Sidebar />
      </div>
      <div className="flex-1 p-6">
        {loading ? (
          <p>Loading election details...</p>
        ) : election ? (
          <div>
            <header className="mb-8">
              <h1 className="text-3xl font-bold">{election.electionName}</h1>
              <p className="text-gray-600">Status: {election.status}</p>
              <p className="text-gray-600">Contract: {election.contractAddress || 'N/A'}</p>
              <p className="text-gray-600">Start: {new Date(election.startDate).toLocaleDateString()}</p>
              <p className="text-gray-600">End: {new Date(election.endDate).toLocaleDateString()}</p>
            </header>
            <h2 className="text-2xl font-semibold mb-4">Candidates</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.length > 0 ? (
                candidates.map(candidate => (
                  <div key={candidate._id} className="p-4 border rounded">
                    <p className="font-bold">{candidate.username}</p>
                    <p className="text-gray-600">{candidate.email}</p>
                  </div>
                ))
              ) : (
                <p>No candidates found.</p>
              )}
            </div>
          </div>
        ) : (
          <p>Election not found.</p>
        )}
      </div>
    </section>
  );
};

export default ElectionDetails;