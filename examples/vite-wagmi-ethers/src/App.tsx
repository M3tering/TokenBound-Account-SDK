import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { TokenboundClient } from '@tokenbound/sdk'

import { Account } from './components'

import { useCallback, useEffect } from 'react'
import { useEthersSigner } from './hooks'

export function App() {
  const { isConnected, address } = useAccount()
  const signer = useEthersSigner({ chainId: 5 })
  // or useSigner() from legacy wagmi versions: const { data: signer } = useSigner()

  const tokenboundClient = new TokenboundClient({ signer, chainId: 5 })

  useEffect(() => {
    async function testTokenboundClass() {
      const account = await tokenboundClient.getAccount({
        tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
        tokenId: '9',
      })

      const preparedExecuteCall = await tokenboundClient.prepareExecuteCall({
        account: account,
        to: account,
        value: 0n,
        data: '',
      })

      const preparedAccount = await tokenboundClient.prepareCreateAccount({
        tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
        tokenId: '1',
      })

      // console.log('getAccount', account)
      // console.log('prepareExecuteCall', preparedExecuteCall)
      // console.log('preparedAccount', preparedAccount)

      // if (signer) {
      // signer?.sendTransaction(preparedAccount)
      // signer?.sendTransaction(preparedExecuteCall)
      // }
    }

    testTokenboundClass()
  }, [tokenboundClient])

  const createAccount = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const createdAccount = await tokenboundClient.createAccount({
      tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
      tokenId: '1',
    })
    alert(`new account: ${createdAccount}`)
  }, [tokenboundClient])

  // const transferNFT = useCallback(async () => {
  //   if (!tokenboundClient || !address) return

  //   const bjGoerliSapienz = tokenboundClient.getAccount({
  //     // BJ's Goerli Sapienz
  //     tokenContract: '0x26c55c8d83d657b2fc1df497f0c991e3612bc6b2',
  //     tokenId: '5',
  //   })

  //   // console.log('goerli sapienz tbaccount', bjGoerliSapienz)

  //   const transferredNFTHash = await tokenboundClient.transferNFT({
  //     account: bjGoerliSapienz,
  //     tokenType: 'ERC721',
  //     tokenContract: '0xbbabef539cad957f1ecc9ee56f38588e24b3dcf3',
  //     tokenId: '0',
  //     recipientAddress: '0x9FefE8a875E7a9b0574751E191a2AF205828dEA4', // BJ's main wallet
  //   })
  //   alert(`transferred: ${transferredNFTHash}`)
  // }, [tokenboundClient])

  // const transferETH = useCallback(async () => {
  //   if (!tokenboundClient || !address) return

  //   const bjGoerliSapienz = tokenboundClient.getAccount({
  //     tokenContract: '0x26c55c8d83d657b2fc1df497f0c991e3612bc6b2',
  //     tokenId: '5',
  //   })

  //   console.log('goerli sapienz tbaccount', bjGoerliSapienz)

  //   const transferredNFTHash = await tokenboundClient.transferETH({
  //     account: bjGoerliSapienz,
  //     amount: 0.01,
  //     recipientAddress: '0x9FefE8a875E7a9b0574751E191a2AF205828dEA4', // BJ's main wallet
  //   })

  //   alert(`transferred: ${transferredNFTHash}`)
  // }, [tokenboundClient])

  const transferERC20 = useCallback(async () => {
    if (!tokenboundClient || !address) return

    const bjGoerliSapienz = tokenboundClient.getAccount({
      tokenContract: '0x26c55c8d83d657b2fc1df497f0c991e3612bc6b2',
      tokenId: '5',
    })

    console.log('goerli sapienz tbaccount', bjGoerliSapienz)

    const DRUBLES_ERC20 = {
      tokenAddress: '0x1faae4d3181284fdec56d48e20298682152d139f',
      decimals: 18,
    }

    const transferredERC20Hash = await tokenboundClient.transferERC20({
      account: bjGoerliSapienz,
      amount: 10,
      recipientAddress: '0x33D622b211C399912eC0feaaf1caFD01AFA53980', // BJ's account under assets/goerli/0x26c55c8d83d657b2fc1df497f0c991e3612bc6b2/0
      erc20tokenAddress: DRUBLES_ERC20.tokenAddress as `0x${string}`,
      erc20tokenDecimals: DRUBLES_ERC20.decimals,
    })

    alert(`transferred: ${transferredERC20Hash}`)
  }, [tokenboundClient])

  const executeCall = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const executedCall = await tokenboundClient.executeCall({
      account: address,
      to: address,
      value: 0n,
      data: '0x',
    })
  }, [tokenboundClient])

  return (
    <>
      <h1>Ethers 5 Signer + ConnectKit + Vite</h1>
      <ConnectKitButton />
      {isConnected && <Account />}
      {address && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            margin: '32px 0 0',
            maxWidth: '320px',
          }}
        >
          <button onClick={() => executeCall()}>EXECUTE CALL</button>
          <button onClick={() => createAccount()}>CREATE ACCOUNT</button>
          {/* <button onClick={() => transferNFT()}>TRANSFER NFT</button> */}
          {/* <button onClick={() => transferETH()}>TRANSFER ETH</button> */}
          <button onClick={() => transferERC20()}>TRANSFER ERC20</button>
        </div>
      )}
    </>
  )
}
