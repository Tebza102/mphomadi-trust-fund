# Sponsor Video — Structure & Script

Production reference for `mpho-appeal.mp4` (see `public/media/README.md` for the
technical file requirements and how it wires into `storyVideo` in
`src/content/storyTimeline.js`). Target runtime: 2 minutes.

## Visual flow

Mpho to camera → rehabilitation footage + Mpho voiceover → journey and Trust
purpose → transition back to Mpho → Mpho appeals directly to sponsors.

The opening and closing direct-to-camera sections are the strongest moments —
that's where the viewer connects with Mpho directly. The middle section
provides evidence and context; the ending converts the story into an
invitation to act.

## 1. Opening — direct to camera (~15–20s)

Mpho looks directly into the camera.

> "Perhaps the greatest limitation a person can face is not a physical one,
> but the limitation we place on what we believe is possible."

Then a brief self-introduction:

> "Hi, my name is Mpho…"

Purpose: create an immediate personal connection with the viewer.

## 2. Mpho's journey — voiceover over rehabilitation footage (~35–45s)

Video transitions away from direct-to-camera as Mpho begins speaking about
his own journey. This is where the rehabilitation footage comes in — it
should support the story rather than become the story itself.

Voiceover briefly covers:
- Growing up with limb differences.
- The barriers and assumptions faced.
- The support received.
- How that support helped challenge what might otherwise have been seen as
  limitations.

Key message: the assistance Mpho received was not only physical support — it
helped create confidence, independence, opportunity, and a belief in what was
possible.

## 3. From Mpho's story to other children (~25–30s)

Visuals continue with suitable footage or photographs while the narration
transitions from personal experience to the purpose of the Trust.

> "The opportunities and support that helped me should not end with me."

Explain that other children living with limb differences deserve the
opportunity to discover their abilities, develop confidence, and pursue their
own ambitions. This is where the viewer starts to understand why the Trust
exists.

## 4. Transition back to Mpho (~10s)

As the message moves toward sponsorship, cut back to Mpho on camera. This
marks the shift from "here is part of my journey" to "here is the person
whose life shows what that support makes possible."

## 5. Sponsor appeal — direct to camera (final 20–30s)

Delivered straight into the camera — no rehabilitation footage or other
visuals competing for attention here.

> "A child may be born with a physical limitation, but that should never
> determine the limits of their dreams, their ability, or what they can
> become."

The appeal:

> "With your support, the Mpho Madi Trust Fund can help more children
> overcome those barriers and discover what is possible for their lives."

The invitation:

> "I invite you to partner with us and help give another child the
> opportunity to realise their full potential."

Hold Mpho's position for a moment after the final line before the video ends.

## Production notes

- Once the final edit is ready, drop `mpho-appeal.mp4` and
  `mpho-appeal.en.vtt` into `public/media/` per the existing README, then set
  `videoReady: true` on `storyVideo` in `src/content/storyTimeline.js`.
- Keep the file web-sized for mobile data.
