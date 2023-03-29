import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useAccount, useContract, useSigner } from 'wagmi';
import { CONTRACT_ADDRESS } from '../../constants';
import artifacts from '../../src/artifacts/contracts/Vote.sol/Vote.json'

function Contestants() {

  const { data: signer } = useSigner()
  const { address } = useAccount()
  const contract = useContract({
      address: CONTRACT_ADDRESS,
      abi: artifacts.abi,
      signerOrProvider: signer,
  })
  
  const [registrar, setRegistrar] = useState([]);
  const getRegistrar = async () => {
    const registrar = await contract.getRegistrar();
    setRegistrar(registrar);
  }
 

  const [contestants, setContestants] = useState([]);
  const getContestants = async () => {

      const electionMap = new Map();

      const elections = await contract.getAllElections();
      elections.map(election => electionMap.set(election.electionId?.toString(), election.electionName))

      const contestants = await contract.getAllContestants();
      const filteredContestants = contestants.map(contestant => {

      console.log('elections', electionMap.get(contestant.electionID?.toString()))

      return {
        name: contestant.name,
        platform: contestant.platform,
        voteCount: contestant.voteCount?.toString(),
        contestantId: contestant.contestantId?.toString(),
        stateCode: contestant.stateCode?.toString(),
        constituencyCode: contestant.constituencyCode?.toString(),
        electionID: contestant.electionID?.toString(),
        electionName: electionMap.get(contestant.electionID?.toString()),
      }
    })
    console.log("🚀 ~ file: index.jsx:41 ~ filteredContestants ~ filteredContestants:", filteredContestants)

    setContestants(filteredContestants)

  }

  useEffect(() => {
      if(!signer) return;

      getContestants();
      getRegistrar();
  },[signer])

  return (
    <>
    <div className='flex flex-col'>
        <div className='flex justify-between items-center'>
            <h1 className='text-lg font-bold'>All Contestants</h1>
            {
              registrar === address ? (
                <Link href='/contestants/register' className='py-2 px-4 text-sm bg-vote-500 text-white rounded-md'>Add Contestant</Link>
                ) : (
                  <></>
                  )
            }
        </div>

        <div className='flex mt-12 w-full'>
            <div className='bg-white rounded-md shadow-md p-4 w-full'>
                <table className='table-auto border-collapse w-full'>
                    <thead>
                        <tr className='text-left'>
                            <th>Name</th>
                            <th>Platform</th>
                            <th>Election</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contestants && contestants.map((contestant, idx) => {
                            return  <tr key={idx} className='my-3'>
                                        <td>{contestant.name}</td>
                                        <td>{contestant.platform}</td>
                                        <td>{contestant.electionName}</td>
                                    </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </>
  )
}

export default Contestants