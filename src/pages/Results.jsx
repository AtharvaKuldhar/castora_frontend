// import React, { useState } from 'react'
// import { elections as dummyElections } from '../data'
// import ResultElection from '../components/ResultElection'

// const Results = () => {
//   const [elections, setElections] = useState(dummyElections);
//   return (
//     <section className="results w-8/12 mx-auto mb-3">
//       <div className="container results_container flex flex-col">
//         {
//           elections.map(election => <ResultElection key={election.id} {...election}
//           />)
//         }

//       </div>
//     </section>
//   )
// }
// export default Results

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResultElection from '../components/ResultElection';
import { ethers } from 'ethers';
import ElectionABI from '../abi/ElectionABI.json';

const Results = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5001/pastElections', {
          headers: { token: localStorage.getItem('token') },
        });
        let allElections = res.data.flatMap(community =>
          community.elections.map(election => ({
            ...election,
            community_name: community.community_name,
          }))
        );

        // Fetch on-chain results
        const provider = new ethers.BrowserProvider(window.ethereum);
        for (let election of allElections) {
          if (election.contractAddress) {
            const contract = new ethers.Contract(election.contractAddress, ElectionABI, provider);
            const votes = await contract.getAllVotes();
            const candidates = await contract.candidates();
            election.onChainResults = candidates.map((candidate, index) => ({
              candidate_id: candidate,
              votes: Number(votes[index]),
            }));
          }
        }

        setElections(allElections);
      } catch (err) {
        console.error('Error fetching results:', err);
        setElections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <section className="results w-8/12 mx-auto mb-3">
      <div className="container results_container flex flex-col">
        {loading ? (
          <p>Loading results...</p>
        ) : (
          elections.map(election => <ResultElection key={election._id} {...election} />)
        )}
      </div>
    </section>
  );
};

export default Results;