import { useEffect } from 'react'

import { DELETE_TEXT, ENTER_TEXT } from '../../constants/strings'
import { getStatuses } from '../../lib/statuses'
import { ws } from '../../lib/websocket'
import { localeAwareUpperCase } from '../../lib/words'
import { Key } from './Key'

type Props = {
  onChar: (value: string) => void
  onDelete: () => void
  onEnter: () => void
  solution: string
  guesses: string[]
  isRevealing?: boolean
}

// Relays key / click event to the server via WebSocket,
// which in turn broadcasts those events to relevant clients.
// Upon receiving those events via websocket, each client
// re-renders the page in response.
export const Keyboard = ({
  onChar,
  onDelete,
  onEnter,
  solution,
  guesses,
  isRevealing,
}: Props) => {
  const charStatuses = getStatuses(solution, guesses)

  // handler for the click event.
  const onClick = (value: string) => {
    if (value === 'ENTER') {
      ws.send(JSON.stringify({ key: 'ENTER' }))
    } else if (value === 'DELETE') {
      ws.send(JSON.stringify({ key: 'DELETE' }))
    } else {
      ws.send(JSON.stringify({ key: value }))
    }
  }

  // handler for the key press event.
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        ws.send(JSON.stringify({ key: 'ENTER' }))
      } else if (e.code === 'Backspace') {
        ws.send(JSON.stringify({ key: 'DELETE' }))
      } else {
        const key = localeAwareUpperCase(e.key)
        // TODO: check this test if the range works with non-english letters
        if (key.length === 1 && key >= 'A' && key <= 'Z') {
          ws.send(JSON.stringify({ key }))
        }
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
  }, [onEnter, onDelete, onChar])

  // handler for the websocket message receive.
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      const { key } = JSON.parse(event.data)
      if (key === 'ENTER') {
        onEnter()
      } else if (key === 'DELETE') {
        onDelete()
      } else {
        onChar(key)
      }
    }
    ws.addEventListener('message', listener)
    return () => {
      ws.removeEventListener('message', listener)
    }
  }, [onEnter, onDelete, onChar])

  return (
    <div>
      <div className="mb-1 flex justify-center">
        {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
          />
        ))}
      </div>
      <div className="mb-1 flex justify-center">
        {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <Key width={65.4} value="ENTER" onClick={onClick}>
          {ENTER_TEXT}
        </Key>
        {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
          />
        ))}
        <Key width={65.4} value="DELETE" onClick={onClick}>
          {DELETE_TEXT}
        </Key>
      </div>
    </div>
  )
}
