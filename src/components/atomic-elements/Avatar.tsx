import { useState, type ComponentProps } from 'react'
import { Icon } from '@/icons/Icon'
import { cn } from '@/lib/utils'
import styles from './Avatar.module.css'

export interface AvatarProps extends ComponentProps<'span'> {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  imageSrc?: string
  /** Who this is. Without it the avatar is decorative and hidden from assistive tech. */
  imageAlt?: string
  /** Shown when there is no image, or it fails to load. One or two letters. */
  initials?: string
  appearance?: 'circle' | 'square'
}

export function Avatar({
  size = 'sm',
  imageSrc,
  imageAlt,
  initials,
  appearance = 'circle',
  className,
  ...props
}: AvatarProps) {
  // Keyed by src, so a new imageSrc gets a fresh attempt instead of staying
  // on the fallback from the last one that failed.
  const [failedSrc, setFailedSrc] = useState<string>()
  const showImage = imageSrc !== undefined && failedSrc !== imageSrc

  return (
    <span
      // The label lives on the container so image, initials and placeholder
      // all announce the same thing: the person, not "S R" or nothing.
      role={imageAlt ? 'img' : undefined}
      aria-label={imageAlt}
      aria-hidden={imageAlt ? undefined : true}
      className={cn(styles.avatar, styles[size], styles[appearance], className)}
      {...props}
    >
      {showImage ? (
        <img
          src={imageSrc}
          alt=""
          className={styles.image}
          onError={() => setFailedSrc(imageSrc)}
        />
      ) : initials ? (
        <span className={styles.initials}>{initials}</span>
      ) : (
        <Icon name="user" className={styles.placeholder} />
      )}
    </span>
  )
}
