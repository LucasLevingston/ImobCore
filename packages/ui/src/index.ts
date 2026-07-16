// Contrato público do design system — apps consumidores importam só daqui.
// Nada em src/**/internal ou src/test-utils é exportado.

export { cn } from './lib/utils'

export { Button, type ButtonProps } from './components/Button'
export { SubmitButton, type SubmitButtonProps } from './components/SubmitButton'
export { Input, type InputProps } from './components/Input'
export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from './components/FormField'
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/Card'
export { Loading, type LoadingProps } from './components/Loading'
export { ErrorState, type ErrorStateProps } from './components/Error'
export {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from './components/Modal'
export {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  Toaster,
  ToastTitle,
  ToastViewport,
  toast,
  useToast,
  type ToastData,
} from './components/Toast'
export { Layout, type LayoutProps } from './components/Layout'
export { Header, type HeaderProps } from './components/Header'
export { Sidebar, type SidebarItem, type SidebarProps } from './components/Sidebar'
export { Footer, type FooterProps } from './components/Footer'
export { Breadcrumb, type BreadcrumbItem, type BreadcrumbProps } from './components/Breadcrumb'
export { Avatar, AvatarFallback, AvatarImage } from './components/Avatar'
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/DropdownMenu'
export {
  ThemeProvider,
  useTheme,
  ThemeToggle,
  type Theme,
  type ThemeContextValue,
  type ThemeProviderProps,
  type ThemeToggleProps,
} from './components/Theme'
