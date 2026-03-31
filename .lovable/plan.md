

# Intelkin UI Refinements

## Problems Identified
1. Too much empty space, especially in the brain visualization area and Neural Insight panel
2. Fonts too small — not using available space well
3. Brain images are red/green blobs that don't match the region colors — should be a grey brain with colored region overlays
4. Too many colors on screen — visual noise
5. Upload dropzone not prominent enough
6. Channel toggles (VIDEO/AUDIO/TEXT) should be auto-detected status indicators, not interactive buttons

## Plan

### 1. Replace brain images with grey brain + colored region overlays
- Replace the current red/green blob images with a single neutral grey brain SVG/image
- Overlay colored dots or highlighted zones on the brain corresponding to each region's assigned color
- Use a muted, monochrome palette for the brain base — only the active regions get subtle color
- Reduce the region bar colors to a single accent color (e.g. soft blue or white/grey gradient) instead of 5 different rainbow colors (red, orange, yellow, blue, purple) — this drastically cuts visual noise

### 2. Tighten spacing and increase font sizes
- Increase region names and percentages from `text-xs` to `text-sm`
- Increase Neural Insight region names and interpretations from `text-xs` to `text-sm`
- Increase Cognitive Load Score numbers from `text-2xl` to `text-4xl`
- Increase card headings from `text-sm` to `text-base` or `text-lg`
- Reduce padding/gaps in the main grid and within cards
- Remove excess vertical spacing in the Neural Insight card
- Make the brain visualization fill more of its column (remove `max-w-[320px]` constraint)

### 3. Improve upload dropzone clarity
- Make the dropzone taller with a larger icon
- Add a more prominent label like "Drag & drop your video file here" with a secondary "or click to browse" line
- Use a slightly brighter dashed border color for better visibility
- Add a file type hint (e.g. "MP4, MOV, AVI")

### 4. Convert channel toggles to auto-detected status indicators
- Change from interactive buttons to static badges/pills
- Show them as greyed-out by default, auto-highlighted when content is detected
- Remove click handlers — they become read-only status indicators
- E.g. when a video is uploaded, VIDEO pill lights up automatically

### 5. Reduce color palette
- Region bars: use a single muted accent color (e.g. all bars in a soft blue-grey) or at most 2 tones, instead of 5 distinct colors
- Neural Insight dots: keep green/red for winner indication (this is functional)
- Remove the rainbow effect from bars — the differentiation comes from labels, not color

### Files to modify
- `src/components/BrainVisualization.tsx` — grey brain with region color mapping
- `src/components/RegionBars.tsx` — unified color, larger fonts
- `src/components/NeuralInsightCard.tsx` — larger fonts, tighter spacing
- `src/components/DesignColumn.tsx` — reduced gaps
- `src/components/UploadDropzone.tsx` — more prominent
- `src/components/ChannelToggles.tsx` — convert to non-interactive status indicators
- `src/pages/Index.tsx` — reduce outer padding/gaps
- `src/assets/` — new grey brain base image (generated or SVG)

