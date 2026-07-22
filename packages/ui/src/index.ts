// Contrato público do design system — apps consumidores importam só daqui.
// Nada em src/**/internal ou src/test-utils é exportado.

export { Avatar, AvatarFallback, AvatarImage } from './components/Avatar'
export { Badge, type BadgeProps } from './components/Badge'
export { Breadcrumb, type BreadcrumbItem, type BreadcrumbProps } from './components/Breadcrumb'
export { Button, type ButtonProps } from './components/Button'
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/Card'
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/DropdownMenu'
export { ErrorState, type ErrorStateProps } from './components/Error'
export {
  FilterBar,
  type FilterBarActionsProps,
  type FilterBarFieldProps,
  type FilterBarProps,
} from './components/FilterBar'
export { Footer, type FooterProps } from './components/Footer'
export { FormError, type FormErrorProps } from './components/FormError'
export {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './components/FormField'
export { Header, type HeaderProps } from './components/Header'
export {
  CurrencyInput,
  type CurrencyInputProps,
  Input,
  type InputProps,
  SearchInput,
  type SearchInputProps,
} from './components/Input'
export { Layout, type LayoutProps } from './components/Layout'
export { Loading, type LoadingProps } from './components/Loading'
export { Logo, type LogoProps } from './components/Logo'
export {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from './components/Modal'
export { Pagination, type PaginationProps } from './components/Pagination'
export { QueryBoundary, type QueryBoundaryProps } from './components/QueryBoundary'
export { Sidebar, type SidebarItem, type SidebarProps } from './components/Sidebar'
export { Skeleton, type SkeletonProps } from './components/Skeleton'
export { SubmitButton, type SubmitButtonProps } from './components/SubmitButton'
export {
  type Theme,
  type ThemeContextValue,
  ThemeProvider,
  type ThemeProviderProps,
  ThemeToggle,
  type ThemeToggleProps,
  useTheme,
} from './components/Theme'
export {
  Toast,
  ToastClose,
  type ToastData,
  ToastDescription,
  Toaster,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toast,
  useToast,
} from './components/Toast'
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './components/Tooltip'
export { cn } from './lib/utils'
