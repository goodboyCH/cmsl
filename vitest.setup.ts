import '@testing-library/jest-dom'
import { vi } from 'vitest'

// framer-motion 모킹 (애니메이션 비활성화)
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
      p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
      button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
      a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
      img: (props: any) => <img {...props} />,
      ul: ({ children, ...props }: any) => <ul {...props}>{children}</ul>,
      li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
      nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
      section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
      article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
      header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
      footer: ({ children, ...props }: any) => <footer {...props}>{children}</footer>,
      main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
    },
    AnimatePresence: ({ children }: any) => children,
  }
})

// Next.js router 모킹
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Next.js Image 모킹
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />
  },
}))
