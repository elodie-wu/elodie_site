import type { SnakeSession } from './types'

// In-memory only. Route changes keep the run; browser refresh resets it.
let session: SnakeSession | null = null
export function loadSnakeSession(): SnakeSession | null { return session }
export function saveSnakeSession(next: SnakeSession): void { session = next }
