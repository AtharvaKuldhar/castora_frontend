// import React from 'react'
// import { candidates as dummyCandidates} from '../data'
// import { useParams } from 'react-router-dom'
// import Candidate from '../components/Candidate'
// import ConfirmVote from '../components/ConfirmVote'
// import { useSelector } from 'react-redux'
// const Candidates = () => {
//   const {id} = useParams();

//   const selectedVoteCandidate = useSelector(state => state.vote.selectedVoteCandidate)

//    const candidates = dummyCandidates.filter(candidate => candidate.election === "e1");
//    console.log("Filtered Candidates: ", candidates);
//   return (
//     <>
//       <section className='p-5'>
//         <header className=' flex flex-col items-center text-center p-10 w-60% mg-auto mb-3'>
//           <h1 className='text-3xl font-bold'> Vote your Candidates</h1>
//           <p className='font-light'>There are the Candidates for the selcted election. Please vote once and wisely, because you wont be allowed to vote in thei electiona again</p>
//         </header>
//         <div className='grid grid-cols-3 gap-4 '>
//         {candidates.length > 0 ? (
//             candidates.map(candidate => <Candidate key={candidate.id} {...candidate} />)
//           ) : (
//             <p>No candidates found for this election.</p>
//           )}
//         </div>
//       </section>
//       {selectedVoteCandidate && <ConfirmVote/>}
//     </>
//   )
// }

// export default Candidates

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import axios from 'axios';
import Candidate from '../components/Candidate';
import ConfirmVote from '../components/ConfirmVote';

const Candidates = () => {
  const { id } = useParams();
  const selectedVoteCandidate = useSelector(state => state.vote.selectedVoteCandidate);
  const [candidates, setCandidates] = useState([]);
  const [electionContractAddress, setElectionContractAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        setLoading(true);
        // Fetch election details from backend
        const electionRes = await axios.get(`http://localhost:5001/election/${id}`, {
          headers: { token: localStorage.getItem('token') },
        });
        const { contractAddress } = electionRes.data.election;
        if (!contractAddress) {
          throw new Error('Election contract address not found');
        }
        setElectionContractAddress(contractAddress);

        // Fetch candidates from backend
        const candidateRes = await axios.post(
          `http://localhost:5001/getCandidatesByElection`,
          { election_id: id },
          { headers: { token: localStorage.getItem('token') } }
        );
        setCandidates(candidateRes.data.candidates || []);
      } catch (err) {
        console.error('Error fetching election data:', err);
        setError(err.message || 'Failed to load election data');
      } finally {
        setLoading(false);
      }
    };

    fetchElectionData();
  }, [id]);

  const handleVote = async (candidateName) => {
    try {
      if (!window.ethereum) throw new Error('Please install MetaMask');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const voterAddress = await signer.getAddress();

      // Create the message to sign
      const message = ethers.solidityPackedKeccak256(
        ['string', 'string', 'address'],
        [voterAddress, candidateName, electionContractAddress]
      );
      const signature = await signer.signMessage(ethers.getBytes(message));

      // Split the signature into v, r, s
      const sig = ethers.Signature.from(signature);
      const { v, r, s } = sig;

      // Send the signed vote to the backend (relayer)
      await axios.post(
        'http://localhost:5001/submitVote',
        {
          voter: voterAddress,
          candidateName,
          v,
          r,
          s,
          electionId: id,
        },
        { headers: { token: localStorage.getItem('token') } }
      );

      alert('Vote signed and sent to relayer for submission.');
    } catch (err) {
      console.error('Error signing vote:', err);
      alert('Failed to sign vote. Please try again.');
    }
  };

  return (
    <>
      <section className='p-5'>
        <header className='flex flex-col items-center text-center p-10 w-60% mx-auto mb-3'>
          <h1 className='text-3xl font-bold'>Vote your Candidates</h1>
          <p className='font-light'>
            These are the candidates for the selected election. Please vote once and wisely, as you won't be allowed to vote in this election again.
          </p>
        </header>
        {loading ? (
          <p>Loading candidates...</p>
        ) : error ? (
          <p className='text-red-500 text-center'>{error}</p>
        ) : (
          <div className='grid grid-cols-3 gap-4'>
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
                <Candidate
                  key={candidate.id}
                  candidate={candidate}
                  onVote={() => handleVote(candidate.name)}
                />
              ))
            ) : (
              <p>No candidates found for this election.</p>
            )}
          </div>
        )}
      </section>
      {selectedVoteCandidate && (
        <ConfirmVote candidateName={selectedVoteCandidate} handleVote={handleVote} />
      )}
    </>
  );
};

export default Candidates;