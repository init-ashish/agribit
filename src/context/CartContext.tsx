/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import type { Dispatch, ReactNode } from 'react'
import type { CartItem } from '../types'
import { cartCount, cartTotal, resolveCart } from '../utils/cart'
import type { CartLine } from '../utils/cart'
import { loadJSON, saveJSON } from '../utils/storage'

export type CartAction =
  | { type: 'ADD'; productId: string; variantId: string; qty: number }
  | { type: 'REMOVE'; productId: string; variantId: string }
  | { type: 'SET_QTY'; productId: string; variantId: string; qty: number }
  | { type: 'CLEAR' }

const STORAGE_KEY = 'agribit:cart'
const MAX_QTY = 99

const same = (i: CartItem, productId: string, variantId: string): boolean =>
  i.productId === productId && i.variantId === variantId

function reducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD': {
      const exists = state.some((i) => same(i, action.productId, action.variantId))
      if (exists) {
        return state.map((i) =>
          same(i, action.productId, action.variantId)
            ? { ...i, qty: Math.min(MAX_QTY, i.qty + action.qty) }
            : i,
        )
      }
      return [
        ...state,
        { productId: action.productId, variantId: action.variantId, qty: Math.min(MAX_QTY, action.qty) },
      ]
    }
    case 'REMOVE':
      return state.filter((i) => !same(i, action.productId, action.variantId))
    case 'SET_QTY':
      if (action.qty <= 0) return state.filter((i) => !same(i, action.productId, action.variantId))
      return state.map((i) =>
        same(i, action.productId, action.variantId) ? { ...i, qty: Math.min(MAX_QTY, action.qty) } : i,
      )
    case 'CLEAR':
      return []
  }
}

function init(): CartItem[] {
  const stored = loadJSON<unknown>(STORAGE_KEY, [])
  if (!Array.isArray(stored)) return []
  return stored.filter(
    (i): i is CartItem =>
      typeof i === 'object' &&
      i !== null &&
      typeof (i as CartItem).productId === 'string' &&
      typeof (i as CartItem).variantId === 'string' &&
      typeof (i as CartItem).qty === 'number' &&
      (i as CartItem).qty > 0,
  )
}

interface CartValue {
  items: CartItem[]
  lines: CartLine[]
  count: number
  total: number
  dispatch: Dispatch<CartAction>
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  /** Increments each time something is added; drives the navbar bounce */
  addTick: number
  addItem: (productId: string, variantId: string, qty: number) => void
}

const CartContext = createContext<CartValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, undefined, init)
  const [isOpen, setOpen] = useState(false)
  const [addTick, setAddTick] = useState(0)

  useEffect(() => {
    saveJSON(STORAGE_KEY, items)
  }, [items])

  const value = useMemo<CartValue>(() => {
    const lines = resolveCart(items)
    return {
      items,
      lines,
      count: cartCount(lines),
      total: cartTotal(lines),
      dispatch,
      isOpen,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      addTick,
      addItem: (productId, variantId, qty) => {
        dispatch({ type: 'ADD', productId, variantId, qty })
        setAddTick((n) => n + 1)
      },
    }
  }, [items, isOpen, addTick])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
