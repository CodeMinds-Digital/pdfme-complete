# Unified Sidebar Implementation

## Overview

The left and right sidebars in the PDFme Designer have been successfully merged into a single unified sidebar component with a two-row layout as requested.

## New Layout Structure

### Row 1: Schema Tools (Horizontal Scroll)
- **Height**: Fixed 60px
- **Content**: Schema tool icons from the former LeftSidebar
- **Behavior**: Horizontal scrollable strip
- **Features**: Drag-and-drop functionality for adding schema elements

### Row 2: Field Properties (Vertical Scroll)
- **Height**: Remaining vertical space
- **Content**: Field properties and settings from the former RightSidebar
- **Behavior**: Vertical scrollable area
- **Features**: Dynamic property panels based on selected schema

## Files Modified

### 1. `src/ui/constants.ts`
- Added `UNIFIED_SIDEBAR_WIDTH = 400` constant

### 2. `src/ui/components/Designer/UnifiedSidebar.tsx` (NEW)
- Created new unified sidebar component
- Combines functionality from both LeftSidebar and RightSidebar
- Implements two-row layout with proper scrolling behavior
- Maintains all existing drag-and-drop and property editing features

### 3. `src/ui/components/Designer/index.tsx`
- Updated imports to use UnifiedSidebar instead of separate sidebars
- Modified canvas sizing logic to work with unified sidebar
- Removed left sidebar positioning (canvas now takes full width)
- Updated sidebar props to include both scale/basePdf and SidebarProps

### 4. `src/ui/components/Designer/RightSidebar/ListView/index.tsx`
- Updated width reference from `RIGHT_SIDEBAR_WIDTH` to `UNIFIED_SIDEBAR_WIDTH`

## Technical Details

### Component Structure
```
UnifiedSidebar
├── SchemaToolsRow (horizontal scroll)
│   ├── Draggable schema tool buttons
│   └── PluginIcon components
└── PropertiesRow (vertical scroll)
    ├── ListView (when no schema selected)
    └── DetailView (when schema selected)
```

### Props Interface
```typescript
interface UnifiedSidebarProps extends SidebarProps {
  scale: number;
  basePdf: BasePdf;
}
```

### Styling
- **Position**: Absolute, right-aligned
- **Width**: 400px (same as original RightSidebar)
- **Height**: 100% of container
- **Layout**: Flexbox column with two rows
- **Overflow**: Horizontal scroll for Row 1, vertical scroll for Row 2

## Benefits

1. **Space Efficiency**: Better utilization of sidebar space
2. **Improved UX**: Schema tools always visible at top
3. **Consistent Width**: Maintains 400px width for adequate property panel space
4. **Simplified Layout**: Single sidebar instead of two separate components
5. **Maintained Functionality**: All existing features preserved

## Backward Compatibility

- All existing Designer API remains unchanged
- Template and schema functionality unaffected
- Drag-and-drop behavior preserved
- Property editing capabilities maintained

## Testing

- TypeScript compilation: ✅ Successful
- Build process: ✅ Successful
- Component structure: ✅ Verified
- Import/export paths: ✅ Updated

## Usage

The unified sidebar works exactly like the previous implementation from a user perspective:

1. **Adding Elements**: Drag schema tools from the top row to the canvas
2. **Editing Properties**: Select an element to see its properties in the bottom row
3. **Toggle Sidebar**: Use the arrow button to show/hide the entire sidebar
4. **Scrolling**: Horizontal scroll for tools, vertical scroll for properties

The implementation successfully meets all the requirements:
- ✅ Single unified sidebar component
- ✅ Top row with horizontal scrollable schema icons
- ✅ Bottom row with vertical scrollable field properties
- ✅ Preserved all existing functionality
