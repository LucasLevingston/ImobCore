import type * as React from 'react'

// SRP: só é a forma pulsante — não sabe nada sobre o layout de nenhuma
// entidade de domínio. Composições específicas (skeleton de card de imóvel,
// por exemplo) ficam no app consumidor, empilhando vários Skeleton via className.
export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>
