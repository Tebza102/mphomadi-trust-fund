# Media

The appeal video on the Mpho's Story page is **self-hosted** (decided 2026-07-21),
so both files below live here rather than on YouTube or Vimeo.

Expected files — the names are what `src/content/storyTimeline.js` points at:

| File | What it is |
| --- | --- |
| `mpho-appeal.mp4` | The appeal video. H.264 / AAC in an MP4 container plays everywhere. |
| `mpho-appeal.en.vtt` | English captions, WebVTT format. Required — the page ships a `<track>` element for it. |

Once both are in place, set `ready: true` on `storyVideo` in
`src/content/storyTimeline.js`. Until then the section renders a labelled
"video pending" placeholder instead of a player pointing at a missing file.

Keep the MP4 web-sized — a multi-hundred-megabyte upload will hurt the page badly
on mobile data, which is how most South African visitors will arrive.
