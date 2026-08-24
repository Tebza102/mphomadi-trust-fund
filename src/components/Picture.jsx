/**
 * Photo with a webp primary source and a jpg fallback.
 *
 * `name` is the basename in /public/images/photos (no extension), so
 * <Picture name="01_hero_portrait_speaking" ... /> resolves both variants.
 *
 * The wrapper is the sizing element — give it the aspect ratio you want via
 * className. The image fills it with object-cover, so `focus` (any Tailwind
 * object-position class) decides what survives the crop at narrow widths.
 */
export function Picture({ name, alt, className = '', focus = 'object-center', loading = 'lazy' }) {
  const base = `/images/photos/${name}`

  return (
    <div className={`overflow-hidden ${className}`}>
      <picture>
        <source srcSet={`${base}.webp`} type="image/webp" />
        <img
          src={`${base}.jpg`}
          alt={alt}
          loading={loading}
          decoding="async"
          className={`h-full w-full object-cover ${focus}`}
        />
      </picture>
    </div>
  )
}
