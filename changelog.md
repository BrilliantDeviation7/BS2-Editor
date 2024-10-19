# Changelog

## 0.3.0 - October 18, 2024

### Added

- Implemented serial connection
  - Compile and flash code to board
  - Enable compile and upload hotkey

### Changes

- Navbar changes to reflect currently available features

## 0.2.0 - October 5, 2024

### Added

- Implemented "Save as..." File action (downloads file to computer)

### Fixed

- Fixed renaming a file with unsaved changes would discard changes
  - Changed to using primary key instead of file name to track current file
- Fixed deleting a file would not update the UI correctly

## 0.1.3 - October 4, 2024

### Fixed

- Fixed renaming a file would close the file

## 0.1.2 - October 4, 2024

First deployment!

### Added

- Basic file system
  - Create
  - Save
  - Rename
  - Delete
- Working menu bar File actions
- Updated menu bar info and options

### Fixed

- Fixed "Create file" Dialog closing when button is pressed via the keyboard
