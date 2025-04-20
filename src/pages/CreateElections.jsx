// import { useState, useEffect } from "react";
// import axios from "axios";
// import { ethers } from "ethers";
// import ElectionFactoryABI from "../abi/ElectionFactoryABI.json";

// const ELECTION_FACTORY_ADDRESS = "0x203bFf4ba915Cc4Fe048a5527E5E34C4d35A5cF5";

// export default function CreateElection() {
//     const [electionName, setElectionName] = useState("");
//     const [candidateDropdowns, setCandidateDropdowns] = useState(["", ""]);
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     // Fetch users from backend
//     useEffect(() => {
//         const fetchCandidates = async () => {
//             const communityKey = localStorage.getItem('selectedCommunityKey');
//             const token = localStorage.getItem('token');

//             if (!communityKey) {
//                 setError('No community key found in localStorage. Please select a community again.');
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const response = await axios.post('http://localhost:5001/getCandidates', {
//                     community_key: communityKey,
//                 }, {
//                     headers: {
//                         'token': `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 });

//                 setUsers(response.data.candidates || []);
//             } catch (err) {
//                 console.error('Error fetching candidates:', err);
//                 setError('Failed to load candidates.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCandidates();
//     }, []);

//     const handleAddCandidate = () => {
//         if (candidateDropdowns.length < 5) {
//             setCandidateDropdowns([...candidateDropdowns, ""]);
//         }
//     };

//     const handleCandidateChange = (index, value) => {
//         const updated = [...candidateDropdowns];
//         updated[index] = value;
//         setCandidateDropdowns(updated);
//     };

//     const handleCreateElection = async () => {
//         try {
//             if (!window.ethereum) return alert("Please install MetaMask");
    
//             const provider = new ethers.BrowserProvider(window.ethereum);
//             const signer = await provider.getSigner();
//             const admin = await signer.getAddress();
    
//             // Filter out empty candidates
//             const candidates = candidateDropdowns.filter(candidate => candidate.trim() !== "");
//             if (candidates.length < 2) {
//                 alert("Please select at least two candidates");
//                 return;
//             }
    
//             // Ensure election name is not empty
//             if (!electionName.trim()) {
//                 alert("Please provide a valid election name");
//                 return;
//             }
    
//             // Filter out invalid users (if any)
//             const voters = users.filter(user => user.id && user.id.trim() !== "");
    
//             // Calculate deposit amount
//             const depositAmount = ((voters.length + 1) * 0.01).toString();
    
//             // Encode the data for createElection(name, voters, candidates)
//             const iface = new ethers.Interface(ElectionFactoryABI);
//             const encodedData = iface.encodeFunctionData("createElection", [
//                 electionName,
//                 voters.map(u => u.id), // Assuming voters have an id field
//                 candidates
//             ]);
    
//             // Send transaction
//             const tx = await signer.sendTransaction({
//                 to: ELECTION_FACTORY_ADDRESS,
//                 data: encodedData,
//                 value: ethers.parseEther(depositAmount),
//             });
    
//             await tx.wait();
//             alert("Election created! TX Hash: " + tx.hash);
//         } catch (err) {
//             console.error(err);
//             alert("Error creating election: " + err.message);
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     if (loading) {
//         return <div>Loading candidates...</div>;
//     }

//     return (
//         <div className="p-6 max-w-xl mx-auto">
//             <h2 className="text-2xl font-bold mb-4">Create Election</h2>

//             <input
//                 className="w-full mb-3 p-2 border rounded"
//                 placeholder="Election Name"
//                 onChange={e => setElectionName(e.target.value)}
//             />

//             <label className="font-semibold">Select Candidates:</label>
//             {candidateDropdowns.map((value, index) => (
//                 <select
//                     key={index}
//                     value={value}
//                     onChange={e => handleCandidateChange(index, e.target.value)}
//                     className="w-full mb-2 p-2 border rounded"
//                 >
//                     <option value="">-- Select a user --</option>
//                     {users.map(user => (
//                         <option key={user.id} value={user.id}>
//                             {user.username}
//                         </option>
//                     ))}
//                 </select>
//             ))}

//             <button
//                 className="mb-4 bg-gray-300 px-4 py-1 rounded"
//                 onClick={handleAddCandidate}
//                 disabled={candidateDropdowns.length >= 5}
//             >
//                 Add Another Candidate
//             </button>

//             <input
//                 className="w-full mb-3 p-2 border rounded"
//                 type="number"
//                 placeholder="Number of Voters"
//                 value={users.length}
//                 disabled
//             />

//             <button
//                 className="bg-blue-500 text-white px-4 py-2 rounded"
//                 onClick={handleCreateElection}
//                 disabled={loading}
//             >
//                 {loading ? "Creating..." : "Create Election"}
//             </button>

//             {error && <div className="text-red-500 mt-4">{error}</div>}
//         </div>
//     );
// }

import { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";
import ElectionFactoryABI from "../abi/ElectionFactoryABI.json";

const ELECTION_FACTORY_ADDRESS = "0x203bFf4ba915Cc4Fe048a5527E5E34C4d35A5cF5";

export default function CreateElection() {
    const [electionName, setElectionName] = useState("");
    const [candidateDropdowns, setCandidateDropdowns] = useState(["", ""]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch users from backend
    useEffect(() => {
        const fetchCandidates = async () => {
            const communityKey = localStorage.getItem('selectedCommunityKey');
            const token = localStorage.getItem('token');

            if (!communityKey) {
                setError('No community key found in localStorage. Please select a community again.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.post('http://localhost:5001/getCandidates', {
                    community_key: communityKey,
                }, {
                    headers: {
                        'token': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setUsers(response.data.candidates || []);
            } catch (err) {
                console.error('Error fetching candidates:', err);
                setError('Failed to load candidates.');
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    const handleAddCandidate = () => {
        if (candidateDropdowns.length < 5) {
            setCandidateDropdowns([...candidateDropdowns, ""]);
        }
    };

    const handleCandidateChange = (index, value) => {
        const updated = [...candidateDropdowns];
        updated[index] = value;
        setCandidateDropdowns(updated);
    };

    const handleCreateElection = async () => {
        try {
            if (!window.ethereum) return alert("Please install MetaMask");

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const admin = await signer.getAddress();

            // Filter out empty candidates
            const candidates = candidateDropdowns.filter(candidate => candidate.trim() !== "");
            if (candidates.length < 2) {
                alert("Please select at least two candidates");
                return;
            }

            // Ensure election name is not empty
            if (!electionName.trim()) {
                alert("Please provide a valid election name");
                return;
            }

            // Filter out invalid users (if any)
            const voters = users.filter(user => user.id && user.id.trim() !== "");

            // Calculate deposit amount
            const depositAmount = ((voters.length + 1) * 0.01).toString();

            // Encode the data for createElection(name, voters, candidates)
            const iface = new ethers.Interface(ElectionFactoryABI);
            const encodedData = iface.encodeFunctionData("createElection", [
                electionName,
                voters.map(u => u.id), // Assuming voters have an id field
                candidates
            ]);

            // Send transaction
            const tx = await signer.sendTransaction({
                to: ELECTION_FACTORY_ADDRESS,
                data: encodedData,
                value: ethers.parseEther(depositAmount),
            });

            await tx.wait();
            alert("Election created! TX Hash: " + tx.hash);
        } catch (err) {
            console.error(err);
            alert("Error creating election: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading candidates...</div>;
    }

    return (
        <div className="p-6 max-w-xl mx-auto mt-20">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Create Election</h2>

            <input
                className="w-full mb-3 p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Election Name"
                onChange={e => setElectionName(e.target.value)}
            />

            <label className="font-semibold text-gray-700 block mb-2">Select Candidates:</label>
            {candidateDropdowns.map((value, index) => (
                <select
                    key={index}
                    value={value}
                    onChange={e => handleCandidateChange(index, e.target.value)}
                    className="w-full mb-3 p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Select a user --</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.username}
                        </option>
                    ))}
                </select>
            ))}

            <button
                className="mb-4 bg-gray-200 px-6 py-2 rounded-lg text-gray-700 hover:bg-gray-300 transition-all"
                onClick={handleAddCandidate}
                disabled={candidateDropdowns.length >= 5}
            >
                Add Another Candidate
            </button>

            <input
                className="w-full mb-3 p-3 border rounded-lg bg-gray-100 text-gray-500"
                type="number"
                placeholder="Number of Voters"
                value={users.length}
                disabled
            />

            <button
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg mt-6 transition-all hover:bg-blue-600"
                onClick={handleCreateElection}
                disabled={loading}
            >
                {loading ? "Creating..." : "Create Election"}
            </button>

            {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
    );
}
