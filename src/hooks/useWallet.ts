import { useConnect, useDisconnect, useAccount } from 'wagmi'
import { useDispatch } from 'react-redux'
import { setConnecting, setConnected, setDisconnected, setError } from '../store/slices/walletSlice'
import { useCallback, useEffect } from 'react'

export const useWallet = () => {
  const dispatch = useDispatch()
  const { address, isConnected, isConnecting } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()

  // Update Redux state based on wallet connection status
  useEffect(() => {
    if (isConnecting) {
      dispatch(setConnecting(true))
    } else if (isConnected && address) {
      dispatch(setConnected({ address }))
    } else if (!isConnected) {
      dispatch(setDisconnected())
    }
  }, [isConnected, isConnecting, address, dispatch])

  // Handle connection errors
  useEffect(() => {
    if (error) {
      dispatch(setError(error.message))
    }
  }, [error, dispatch])

  // Connect wallet using specified connector or default
  const connectWallet = useCallback(
    (connectorId?: string) => {
      const connector = connectorId
        ? connectors.find(c => c.id === connectorId)
        : connectors[0]

      if (connector) {
        connect({ connector })
      } else {
        console.warn('No valid connector found')
      }
    },
    [connect, connectors]
  )

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    disconnect()
  }, [disconnect])

  return {
    address,
    isConnected,
    isConnecting: isConnecting || isPending,
    connectWallet,
    disconnectWallet,
    connectors,
    error
  }
}
