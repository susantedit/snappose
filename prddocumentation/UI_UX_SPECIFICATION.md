#partr1\
# 🎨 UI / UX SPECIFICATION

# Snap Pose

Version: 1.0

Status: Production Ready

Owner

Susant Luitel

Platforms

Android
iOS (Future)

Framework

React Native (Expo)

---

# 1. Purpose

This document defines the complete visual and interaction experience of Snap Pose.

Every screen, animation, gesture, transition, interaction, spacing, component, loading state, accessibility behavior, and navigation rule must follow this specification.

The goal is to create an application that feels as polished as products from Apple, Airbnb, Notion, VSCO, and Pinterest.

---

# 2. UX Principles

The application must always feel

• Fast

• Clean

• Minimal

• Premium

• Intelligent

• Helpful

• Delightful

The UI should never overwhelm users.

Every screen must have one clear purpose.

---

# 3. Information Architecture

Splash

↓

Onboarding

↓

(Optional Authentication)

↓

Home

├── Categories
├── Search
├── Trending
├── Favorites
├── Downloads
├── Camera
├── Gallery
├── Premium
├── Settings

---

# 4. Navigation

Bottom Navigation

🏠 Home

🔍 Search

📷 Camera

❤️ Favorites

⚙ Settings

Glassmorphism

Blur

Floating

Rounded

Height

72px

Safe Area Supported

---

# 5. Splash Screen

Purpose

Brand introduction.

Layout

Center Logo

Tagline

Loading Indicator

Background Gradient

Duration

1.5–2 seconds

Animation

Logo Scale

0.8 → 1.0

Fade

Opacity

0 → 100%

Background

Cream Gradient

No Skip

No Buttons

---

# 6. Onboarding

Number of Pages

3

Swipe Enabled

YES

Skip Button

YES

Progress Dots

YES

Continue Button

YES

Finish Button

YES

Animation

Parallax

Fade

Slide

Hero

---

## Page 1

Title

Never Wonder How To Pose Again

Subtitle

Snap Pose helps you recreate aesthetic poses effortlessly.

Illustration

Person recreating a pose using overlay.

CTA

Next

---

## Page 2

Title

AI Guides Every Movement

Subtitle

Real-time voice coaching.

Pose matching.

Lighting guidance.

Distance suggestions.

Illustration

Camera overlay.

Skeleton tracking.

---

## Page 3

Title

Capture Perfect Photos

Subtitle

Automatic capture.

Offline pose packs.

Premium photography assistant.

CTA

Start Exploring

---

# 7. Authentication

Authentication is optional.

Users should be able to use the app without creating an account.

Premium synchronization requires login.

Supported

Google

Apple (iOS)

Email

Anonymous

Firebase Authentication

---

# 8. Home Screen

Purpose

Primary discovery screen.

Layout

Search Bar

↓

Categories

↓

Trending

↓

Recommended

↓

Recently Viewed

↓

Editor's Picks

↓

Popular

↓

Continue Browsing

---

# Search Bar

Rounded

Height

56

Leading Icon

Search

Trailing

Voice Search (Future)

Placeholder

Search poses...

Animation

Expand on Focus

---

# Categories Section

Horizontal Scroll

Rounded Cards

Real Photography

Label

Image

Shadow

Click Animation

Scale

0.96

---

Categories

Beach

Cafe

Travel

Mountain

Nature

Forest

Camping

Golden Hour

Street

Wedding

Traditional

Gym

Luxury

Fashion

Car

Bike

Family

Friends

Solo

Couple

More...

---

# Trending Section

Large Cards

Pinterest Layout

Image

Category Badge

Favorite Button

Downloads

View Count

Trending Badge

---

# Recently Viewed

Horizontal Carousel

Last 20 poses

Stored locally

MMKV

---

# Recommended

Powered by

History

Favorites

Downloads

Location (Optional)

Time of Day

Season

---

# Floating Camera Button

Position

Bottom Center

Circular

72px

Olive Green

Shadow

Tap Animation

Spring

Opens Camera Immediately

---

# 9. Search Screen

Purpose

Find poses quickly.

Layout

Search

↓

Recent Searches

↓

Trending Keywords

↓

Popular Categories

↓

Results

---

Filters

Difficulty

Category

Body Angle

Camera Angle

Indoor

Outdoor

Solo

Couple

Landscape

Portrait

Lighting

Occasion

---

Search Suggestions

Instant

Debounced

200ms

---

Empty State

Illustration

"No poses found."

Button

Explore Categories

---

Loading

Skeleton

BlurHash

Shimmer

---

# 10. Categories Screen

Purpose

Browse all pose collections.

Grid

2 Columns

Large Cards

Rounded

Photography

Card Includes

Image

Title

Pose Count

Download Status

Premium Badge

---

Card Animation

Scale

Hero Transition

---

Example

🏖 Beach

123 Poses

↓

☕

Cafe

86 Poses

↓

🏔 Mountain

142 Poses

↓

💍 Wedding

190 Poses

↓

🏕 Camping

67 Poses

↓

🌆 Night

74 Poses

---

# 11. Global Components

Search Bar

Primary Button

Secondary Button

Pose Card

Category Card

Bottom Sheet

Snackbar

Toast

Loader

Dialog

Progress Ring

Floating Action Button

Avatar

Chips

Badges

Premium Tag

Image Placeholder

BlurHash

---

# 12. Gestures

Tap

Double Tap

Long Press

Swipe

Pinch

Rotate

Drag

Fling

Overscroll Bounce

Haptic Feedback

---

# 13. Motion

Screen Transition

300ms

Shared Element

Enabled

Hero Animation

Enabled

Fade

Enabled

Spring

Enabled

Gesture Driven

Enabled

Reduce Motion

Supported

---

# 14. Responsive Design

Small Phones

360dp

Medium Phones

411dp

Large Phones

480dp

Foldables

Supported

Tablets

Adaptive Layout

Landscape

Supported

---

# 15. Accessibility

Touch Target

48dp

Dynamic Font

YES

TalkBack

YES

VoiceOver

YES

Color Contrast

AA

Reduce Motion

YES

Screen Reader Labels

Required

---

# 16. Empty States

Favorites

"No favorites yet."

Downloads

"No downloaded packs."

Search

"No matching poses."

Gallery

"No photos captured."

Premium

"Unlock premium collections."

---

# 17. Loading States

Never show blank screens.

Use

Skeleton Cards

BlurHash

Circular Loader

Progress Ring

Image Placeholder

Shimmer

---

# 18. Error States

Permission Denied

Retry

Open Settings

Camera Failure

Restart Camera

Network Error

Retry

Storage Full

Manage Storage

AI Initialization Failed

Restart AI Engine

---

# 19. UI Performance Targets

Camera Launch

<1 second

Screen Navigation

<250ms

Search

<200ms

Animations

60 FPS

Memory

Optimized

Battery

Efficient

---

# End of Part 1

Next

UI_UX_SPECIFICATION Part 2

Includes

• Pose Detail Screen

• Camera Screen

• Overlay Engine

• AI Coaching UI

• Gallery

• Favorites

• Downloads

• Premium

#part2

# ===========================================================
# UI / UX SPECIFICATION
# PART 2
# ===========================================================

# 20. Pose Detail Screen

Purpose

Display complete information about a pose before opening the camera.

------------------------------------------------------------

Layout

Status Bar

↓

Large Hero Image (16:9)

↓

Pose Information Card

↓

Lighting Tips

↓

Camera Setup

↓

Difficulty

↓

Recommended Lens

↓

Related Poses

↓

Bottom Action Buttons

------------------------------------------------------------

Hero Image

Width

100%

Aspect Ratio

16:9

Rounded Bottom

32px

Parallax Scroll

YES

Shared Element Transition

YES

------------------------------------------------------------

Pose Information

Includes

• Pose Name

• Category

• Difficulty

• Indoor / Outdoor

• Best Time

• Estimated Duration

• Camera Angle

• Recommended Lens

• Body Orientation

• Face Direction

• Lighting

------------------------------------------------------------

Difficulty Indicator

Easy

Green

Medium

Orange

Hard

Red

------------------------------------------------------------

Lighting Tips Card

Examples

☀ Face toward sunlight

🌅 Golden hour recommended

💡 Avoid backlight

☁ Cloudy lighting supported

------------------------------------------------------------

Camera Setup Card

Recommended Distance

Example

2 meters

Recommended Height

Chest Level

Orientation

Portrait

Lens

1x

Flash

Off

HDR

On

------------------------------------------------------------

Related Poses

Horizontal Carousel

Shows

Similar

Trending

Recently Used

------------------------------------------------------------

Bottom Buttons

♡ Favorite

⬇ Download

📷 Use This Pose

Primary Button

Height

60px

Rounded

20px

Olive Green

------------------------------------------------------------

Interactions

Tap Hero

Full Screen Preview

Tap Favorite

Heart Animation

Tap Download

Download Pack

Tap Camera

Open Camera

------------------------------------------------------------

Animations

Hero Image

Scale

Fade

Shared Element

Button

Spring

Cards

Fade Up

------------------------------------------------------------

# 21. Camera Screen

Purpose

Capture photos using AI guidance.

------------------------------------------------------------

Layout

Status Bar

↓

Camera Preview

↓

Pose Overlay

↓

AI Skeleton

↓

Match Score

↓

Voice Coach Indicator

↓

Distance Meter

↓

Lighting Meter

↓

Bottom Controls

------------------------------------------------------------

Top Toolbar

Back

Flash

HDR

Grid

Golden Ratio

Settings

------------------------------------------------------------

Overlay Controls

Opacity Slider

Rotate

Scale

Flip

Lock

Reset

Snap Center

------------------------------------------------------------

Bottom Controls

Gallery

Capture

Timer

Camera Switch

------------------------------------------------------------

Capture Button

Size

84px

Circle

Olive

Pulse Animation

------------------------------------------------------------

Gallery Shortcut

Circular

56px

Latest Image Preview

------------------------------------------------------------

Camera Flip

Front

Rear

Animated Rotation

------------------------------------------------------------

Timer

3 sec

5 sec

10 sec

Off

------------------------------------------------------------

# 22. AI Pose Overlay

Pose image is converted into a transparent overlay.

User aligns body.

Opacity

0–100%

Rotation

-180°

to

180°

Scale

25%

to

250%

Position

Drag Anywhere

Snap

Enabled

Reset

One Tap

------------------------------------------------------------

# 23. AI Skeleton

Display

33 body landmarks

Animated

YES

Smooth

YES

Lines

Rounded

Semi Transparent

Colors

Green

Perfect

Orange

Close

Red

Incorrect

------------------------------------------------------------

# 24. Pose Match Score

Displayed as

Circular Ring

Range

0–100%

Color

0–40

Red

41–70

Orange

71–90

Light Green

91–100

Dark Green

Animation

Real Time

Smooth

Never Flicker

------------------------------------------------------------

# 25. AI Voice Coach

Floating Bubble

Bottom

Commands

Move left

Move right

Raise left arm

Lower shoulder

Turn body

Smile

Look at camera

Perfect!

Voice

Natural

Short

Localized

------------------------------------------------------------

# 26. Distance Meter

Display

Move Back

Move Forward

Current Distance

Recommended Distance

Visual

Horizontal Meter

Color

Green

Optimal

Orange

Close

Red

Too Far

------------------------------------------------------------

# 27. Lighting Meter

Icon

Sun

Score

0–100

Suggestions

Turn toward light

Avoid shadows

Increase exposure

Use HDR

------------------------------------------------------------

# 28. Auto Capture

When

Pose Score > 95%

Smile Detected

Face Visible

Camera Stable

Countdown

3

2

1

Capture

Animation

Ring Countdown

Haptic

YES

------------------------------------------------------------

# 29. Gallery

Grid

3 Columns

Rounded

Selection

Long Press

Multiple Delete

Share

Favorite

Download

Edit (Future)

------------------------------------------------------------

Photo Details

Date

Location (Optional)

Pose Used

Match Score

Resolution

------------------------------------------------------------

# 30. Favorites

Grid

Pinterest Style

Offline

YES

Sort

Newest

Oldest

Category

Difficulty

------------------------------------------------------------

# 31. Downloads

Downloaded Packs

Storage Used

Update Available

Delete Pack

Redownload

Offline Indicator

------------------------------------------------------------

# 32. Premium

Hero Banner

Premium Features

Comparison Table

Monthly Plan

Yearly Plan

Restore Purchase

FAQ

Benefits

Unlimited Pose Packs

Exclusive Categories

No Ads

Advanced AI

Cloud Sync

Priority Support

------------------------------------------------------------

Purchase Flow

Tap Upgrade

↓

Google Play Billing

↓

Success

↓

Premium Enabled

------------------------------------------------------------

# 33. Settings

Sections

General

Appearance

Camera

Downloads

Notifications

Privacy

Developer

About

------------------------------------------------------------

Camera Settings

Grid

HDR

Flash

Default Lens

Auto Capture Threshold

Voice Guidance

Overlay Opacity

------------------------------------------------------------

Theme

Light

Dark

System

------------------------------------------------------------

Language

English

Nepali (Future)

Hindi (Future)

------------------------------------------------------------

# 34. About Developer

Profile Picture

Name

Susant Luitel

Short Bio

GitHub

YouTube

LinkedIn

Instagram

Facebook

Pinterest

TikTok

X

Reddit

CodePen

WhatsApp

Email

Open Source Projects

Version

Licenses

------------------------------------------------------------

# 35. Privacy Screen

Privacy Policy

Permissions

Collected Data

Third Party Services

Google AdMob

Firebase

Analytics

Open Source Licenses

------------------------------------------------------------

# 36. Terms

Usage

Subscriptions

Refund Policy

Copyright

User Content

------------------------------------------------------------

# 37. Feedback

Rating

Bug Report

Feature Request

Email Support

Attach Screenshot

------------------------------------------------------------

# 38. Global UI Rules

Never block navigation.

Never use intrusive popups.

Use Bottom Sheets instead of dialogs where possible.

Maintain 60 FPS.

Always provide loading indicators.

Support offline mode.

Respect Reduce Motion.

Support Dynamic Font Sizes.

Touch targets minimum 48dp.

------------------------------------------------------------

END OF PART 2


#part3
# ===========================================================
# UI / UX SPECIFICATION
# PART 3
# Motion • Interaction • Accessibility • Offline UX
# ===========================================================

# 39. Motion Philosophy

Motion should communicate.

Never animate simply for decoration.

Every animation must

• Explain navigation

• Reduce cognitive load

• Improve usability

• Feel premium

The experience should resemble

Apple

Airbnb

Notion

VSCO

Instagram

Material Motion

---

# 40. Animation System

Animation Library

React Native Reanimated v4

Target FPS

60 FPS

Reduce Motion

Supported

Duration

Quick

120ms

Medium

220ms

Long

350ms

Hero Transition

450ms

Never exceed

500ms

---

# 41. Screen Transition Rules

Push Screen

Slide Right → Left

Back

Slide Left → Right

Modal

Bottom Sheet

Fade

Dialog

Scale + Fade

Full Screen Camera

Shared Element

Gallery

Fade Through

Premium

Hero Animation

---

# 42. Shared Element Animations

Supported Screens

Home

↓

Pose Detail

↓

Camera

↓

Gallery

Image should visually continue between screens.

No flickering.

No jumping.

---

# 43. Button Animations

Primary Button

Press

Scale

100%

↓

96%

Release

Spring Back

Duration

120ms

Haptic

Light

---

Secondary Button

Opacity

100%

↓

85%

---

Danger Button

Small Shake

When validation fails

---

# 44. Card Interactions

Tap

Scale

98%

↓

100%

Long Press

Elevation Increase

Selection Border

Haptic

Medium

Swipe

Optional

Future

---

# 45. Gesture Rules

Supported Gestures

Tap

Double Tap

Long Press

Drag

Pinch

Rotate

Swipe

Edge Swipe

Overscroll Bounce

Two Finger Rotate

Double Tap Zoom

---

Camera Overlay Gestures

Pinch

Resize Overlay

Rotate

Rotate Overlay

Drag

Move Overlay

Double Tap

Reset Overlay

Long Press

Lock Overlay

---

# 46. Camera Interaction

When camera opens

Animation

Fade

Camera Preview

↓

Overlay

↓

Skeleton

↓

Buttons

↓

AI Score

All appear sequentially.

Total

500ms

---

Capture Animation

Flash

White Overlay

50ms

↓

Haptic

↓

Thumbnail Animation

↓

Gallery Update

---

# 47. Pose Match Animation

Score

Updates

30 FPS

Smooth interpolation.

Never jump

72%

↓

91%

Instead

Animate

72

73

74

...

91

---

Color Transition

Red

↓

Orange

↓

Green

---

# 48. Voice Coach UI

Voice Bubble

Bottom Center

Rounded

Floating

Blur Background

Animation

Slide Up

Dismiss

Fade

Speech Wave

Animated

Commands

Raise left arm

Turn right

Smile

Perfect

Move back

Move closer

---

# 49. AI Feedback Chips

Small floating chips.

Examples

✅ Great!

⬅ Move Left

➡ Move Right

⬆ Raise Arm

🙂 Smile

👀 Look Here

Disappear after

2 seconds

---

# 50. Notifications

Never intrusive.

Preferred

Snackbars

Bottom Sheets

Small Toasts

Avoid

Blocking dialogs.

---

Success

Green

Error

Red

Warning

Orange

Information

Olive

---

# 51. Loading UX

Never display blank screens.

Use

Skeleton Cards

BlurHash

Progress Rings

Animated Placeholder

Shimmer

Estimated Loading

Examples

Downloading pose pack...

Analyzing pose...

Preparing AI...

Opening camera...

---

# 52. Empty States

Favorites

"No favorite poses yet."

Illustration

Button

Explore Poses

---

Gallery

"No photos captured."

Button

Open Camera

---

Downloads

"No downloaded packs."

Button

Browse Packs

---

Premium

"Unlock advanced AI features."

CTA

Upgrade

---

# 53. Error Recovery

Camera Failed

Retry

Restart Camera

---

No Internet

Offline Mode

Continue

---

Permission Denied

Explain why permission is required.

Button

Open Settings

---

AI Failed

Restart AI Engine

Fallback

Overlay Only

---

Storage Full

Delete old downloads

Open Storage

---

# 54. Offline Experience

Supported

Downloaded Pose Packs

Favorites

Gallery

Camera

Pose Overlay

AI (Limited)

Not Supported

Cloud Sync

Premium Validation

Recommendations

Updates

Search Online

---

Offline Banner

Small

Top

Dismissible

---

# 55. Connectivity States

Online

Green Dot

Offline

Gray Dot

Syncing

Animated Dot

Downloading

Circular Progress

---

# 56. Theme Behavior

Themes

Light

Dark

System

Animation

Cross Fade

200ms

Icons

Automatically switch

Illustrations

Adaptive

---

# 57. Foldables

Portrait

Supported

Landscape

Supported

Dual Pane

Future

Camera

Center

Controls

Right Panel

---

# 58. Tablet Layout

Navigation Rail

Instead of Bottom Bar

Categories

Grid

4 Columns

Camera Controls

Side Panel

Gallery

5 Columns

---

# 59. Accessibility

TalkBack

Required

VoiceOver

Required

Dynamic Font

Supported

Minimum Touch

48dp

Contrast

WCAG AA

Reduce Motion

Supported

Screen Reader Labels

Required

Focus Order

Logical

---

# 60. Haptic Feedback

Selection

Light

Capture

Heavy

Success

Medium

Failure

Heavy

Premium Purchase

Success

Favorite

Light

Download Complete

Medium

---

# 61. Sound Design

Capture

Soft DSLR Sound

Download Complete

Soft Bell

Success

Pop

Error

Muted Click

Voice Coach

Natural Female/Male Voice

Configurable

---

# 62. AI Guidance States

Idle

Searching

Tracking

Good Pose

Excellent

Perfect

Auto Capture

Lost Tracking

Reposition User

Every state should have

Animation

Voice

Visual

Color

---

# 63. Security UX

Never ask for permissions at launch.

Request only when needed.

Camera

Before Camera

Location

When user enables recommendations

Microphone

Only if voice features require it

Storage

Only when saving photos

---

# 64. Privacy UX

Every permission includes

Reason

Example

Benefit

Never use dark patterns.

Users can continue without optional permissions.

---

# 65. Performance UX

Screen Load

<250ms

Camera Launch

<1 second

Animations

60 FPS

Scrolling

120Hz supported

Memory

Low

Battery

Optimized

---

# 66. Delight Moments

Achievement

100 Perfect Poses

Confetti

Premium Purchase

Celebration

First Photo

Animated Badge

Daily Streak

Fire Animation

Downloaded Pack

Flying Card Animation

---

# 67. UX Success Checklist

Every screen must

✓ Load quickly

✓ Support accessibility

✓ Support dark mode

✓ Support offline

✓ Show loading state

✓ Show empty state

✓ Show error state

✓ Support gestures

✓ Use animations

✓ Respect safe areas

✓ Be responsive

✓ Follow Design System

---

END OF PART 3

# ===========================================================
# UI / UX SPECIFICATION
# PART 4
# Components • Design Tokens • Acceptance Criteria
# ===========================================================

# 68. Component Library

Every UI component must be reusable.

Avoid duplicate code.

Follow Atomic Design principles.

Structure

Atoms

↓

Molecules

↓

Organisms

↓

Templates

↓

Screens

---

# 69. Atoms

SPButton

SPIcon

SPText

SPImage

SPAvatar

SPBadge

SPChip

SPDivider

SPProgressRing

SPSkeleton

SPLoader

SPTooltip

SPTag

SPSwitch

SPCheckbox

SPRadio

SPSlider

SPTextInput

SPIconButton

SPFloatingButton

---

# 70. Molecules

Search Bar

Category Card

Pose Card

Favorite Button

Premium Banner

Download Card

Loading Card

Camera Control

AI Status Chip

Notification Card

Bottom Navigation Item

Settings Row

Language Selector

Theme Selector

Permission Card

Statistic Card

---

# 71. Organisms

Home Header

Categories Section

Trending Section

Recommended Section

Camera Overlay

Gallery Grid

Settings List

Premium Hero

Developer Profile

Downloads Manager

Search Results

Bottom Navigation

Top Navigation

Camera Toolbar

AI Coach Panel

---

# 72. Templates

Home

Search

Category

Pose Detail

Camera

Gallery

Downloads

Favorites

Premium

Settings

About

Privacy

Feedback

---

# 73. Component Naming

Prefix

SP

Examples

SPButton

SPCard

SPOverlay

SPGallery

SPCamera

SPCategoryCard

SPPoseCard

SPToast

SPDialog

SPBottomSheet

SPAvatar

---

# 74. Icon Rules

Library

Lucide

Fallback

Material Icons

Stroke Width

2

Rounded

YES

Filled

Only Active Icons

Never mix icon styles.

---

# 75. Images

Use

Real Photography

Never

AI Placeholder Images

Low Resolution

Watermarked Images

Preferred Sources

Unsplash

Pexels

Pixabay

Compression

WebP

BlurHash

FastImage

---

# 76. Illustration Rules

Minimal

Outline

Monochrome

No Cartoon Style

No 3D Characters

No Stock Illustration Packs

---

# 77. Buttons

Primary

Filled Olive

Height

56

Radius

18

Elevation

2

Animation

Scale

Spring

Secondary

Outlined

Ghost

Text Only

Danger

Red

Success

Green

Disabled

Gray

---

# 78. Cards

Radius

24

Shadow

Soft

Padding

20

Spacing

16

Elevation

2

Image Radius

20

---

# 79. Bottom Sheets

Rounded Top

32

Blur Background

Dismiss Swipe

YES

Dismiss Tap Outside

YES

Animation

Spring

Height

Adaptive

---

# 80. Dialogs

Centered

Blur Background

Rounded

24

Primary CTA

Secondary CTA

Escape Back Button

YES

---

# 81. Snackbars

Bottom

Rounded

Auto Hide

3 Seconds

Action Button

Optional

---

# 82. Toasts

Top

Small

Icon

Short Message

Duration

2 Seconds

---

# 83. Navigation

Bottom Bar

Glassmorphism

Blur

Floating

Rounded

Icons

Labels

Safe Area

YES

Landscape

Adaptive

---

# 84. Scroll Behavior

Bounce

Enabled

Pull To Refresh

Enabled

Infinite Scroll

Supported

Momentum Scroll

Enabled

---

# 85. Search Experience

Debounce

200ms

Suggestions

Live

History

Stored

Clear Button

Voice Search

Future

---

# 86. Camera Controls

Flash

HDR

Timer

Grid

Golden Ratio

Exposure

Zoom

Flip Camera

Settings

Capture

Gallery

Overlay Controls

---

# 87. Overlay Controls

Opacity

Rotate

Resize

Flip

Reset

Lock

Snap

Guide Toggle

---

# 88. AI Widgets

Pose Score

Voice Bubble

Distance Meter

Lighting Meter

Tracking Status

Skeleton

Auto Capture Ring

---

# 89. Gallery Components

Photo Card

Selection Mode

Delete

Share

Export

Favorite

Metadata

Future Edit

---

# 90. Downloads Manager

Progress

Pause

Resume

Delete

Storage Usage

Update Available

---

# 91. Premium Components

Hero Banner

Feature List

Pricing Cards

Comparison Table

Restore Purchase

FAQ

Testimonials

Upgrade Button

---

# 92. Settings Components

Switches

Dropdowns

Language

Theme

Privacy

Notifications

Camera

Downloads

Developer

---

# 93. Empty State Components

Illustration

Headline

Description

Primary CTA

Secondary CTA

---

# 94. Error Components

Icon

Title

Description

Retry

Support

Open Settings

---

# 95. Loading Components

Skeleton

BlurHash

Progress Ring

Circular Loader

Linear Progress

Shimmer

---

# 96. Notification UX

Download Complete

Pose Saved

Permission Needed

Premium Active

New Pose Pack

Daily Suggestion

Weekly Challenge

---

# 97. Design Tokens

Spacing

4

8

12

16

20

24

32

40

48

64

Radius

8

16

24

32

Typography

Display

48

H1

36

H2

30

H3

24

Body

16

Caption

12

---

# 98. Screen Acceptance Criteria

Every screen must

✓ Load within target time

✓ Display loading state

✓ Display empty state

✓ Display error state

✓ Work offline when applicable

✓ Respect dark mode

✓ Respect accessibility

✓ Follow spacing rules

✓ Follow typography rules

✓ Use design tokens

✓ Pass responsive testing

---

# 99. AI Coding Rules

Any generated UI code must

Use React Native

Use Expo

Use TypeScript

Use NativeWind

Use React Native Reanimated

Use Gesture Handler

Use reusable components

Avoid duplicated UI

Follow folder structure

Use absolute imports

Write strongly typed components

No inline styles unless necessary

Support dark mode

Support accessibility

Use semantic naming

Avoid unnecessary re-renders

Optimize FlatLists

Lazy load images

Cache assets

Follow SOLID principles

---

# 100. Final UX Goal

A first-time user should be able to

Install the app

Understand its purpose within 10 seconds

Find a pose within 30 seconds

Open the camera within 45 seconds

Capture a guided photo within 60 seconds

Share it immediately

The interface should feel

Elegant

Fast

Professional

Natural

Photography-first

Premium

Accessible

Consistent

Delightful

Every interaction should reinforce confidence and make users feel like they have a personal AI photography coach.

---

# END OF UI_UX_SPECIFICATION.md