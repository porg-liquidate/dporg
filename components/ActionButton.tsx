'use client'
import React from 'react'
import { useDisconnect, useAppKit, useAppKitNetwork, useAppKitState, useAppKitAccount } from '@reown/appkit/react'
import { networks } from '@/config'

const ActionButton = () => {
  const { open } = useAppKit()
  const { disconnect } = useDisconnect()
  const { switchNetwork } = useAppKitNetwork()
  const { isConnected } = useAppKitAccount()

  const handleDisconnect = async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  }

  const isWalletConnected = isConnected.toString() === 'false' 
                                ? true : false;

  console.log(isConnected.toString())

  return (
    <>
     {/* <div className='text-red-400'>
       <button className='text-red-400' onClick={() => open()}>Open</button>
      <button onClick={handleDisconnect}>Disconnect</button>
      <button onClick={() => switchNetwork(networks[1])}>Switch</button>
    </div> */}
      {!isWalletConnected ? (
        <button
          className='text-white' 
          onClick={() => open()}
        >Connect Wallet</button>
      ) : (
        <button
          className='text-white'
          onClick={handleDisconnect}
        >Disconnect Wallet</button>
      )}
    </>
  )
}

export default ActionButton