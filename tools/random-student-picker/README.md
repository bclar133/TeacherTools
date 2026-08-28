# Random Student Picker

A classroom-friendly random picker and random group maker for Chalkbox.

## V2 highlights

- Maximum class size: 28 students, with an explicit warning and disabled START / MAKE GROUPS controls if the roster is over the limit.
- Smart name cleaning for common school-list formats such as `Smith, John`; duplicate first names receive the shortest surname prefix required to distinguish them.
- Nine animated picker modes: Slots, Wheel, Pointer, Shuffle, Race, Duck Race, Boxes, Rockets and Elimination.
- Remove-winner and keep-whole-class modes. When remove-winner is active, every preview and animation shows only students who are still eligible.
- Mode-specific Web Audio sounds, plus a master Mute control.
- Fireworks and confetti winner celebration.
- Light and Dark modes.
- True presentation mode that hides setup controls and enlarges the projected randomiser.
- Random Groups with direct name entry, copy and print controls.
- Explicitly saved classes stored only in the current browser; no roster is saved automatically.
- Secure browser randomness uses `crypto.getRandomValues()` where available.
- Responsive layouts and compact adaptations for phones, including dense race, pointer and rocket layouts.

## Privacy note

Saved class rosters are only written to browser storage after the teacher explicitly chooses **Save class**. They can be deleted from the Saved classes controls. Pasted rosters are not automatically persisted.
