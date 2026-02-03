# Beam and Frame Analysis System - Complete User Manual

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Understanding Structural Concepts](#understanding-structural-concepts)
4. [Step-by-Step Guide](#step-by-step-guide)
5. [Feature Reference](#feature-reference)
6. [Examples & Tutorials](#examples--tutorials)
7. [Troubleshooting](#troubleshooting)
8. [Technical Specifications](#technical-specifications)

---

## 1. Introduction

### What is This Application?

The Beam and Frame Analysis System is a professional web-based structural engineering tool designed to analyze beams and frames under various loading conditions. It calculates support reactions, generates shear force diagrams (SFD), and bending moment diagrams (BMD) with precision.

### Who Should Use This?

- **Civil Engineering Students** (CEG 410 and related courses)
- **Structural Engineers** performing preliminary analysis
- **Educators** teaching structural mechanics
- **Anyone** needing quick beam analysis

### Key Features

✓ **Multiple Support Types:** Fixed, Hinged, Roller
✓ **Multi-Span Analysis:** Continuous beams with any number of supports
✓ **Diverse Loading:** Point loads, UDL, VDL, and combinations
✓ **Fixed End Moments:** Automatic calculation for all load types
✓ **Settlement Analysis:** Accounts for sinking supports
✓ **Visual Diagrams:** Interactive SFD and BMD charts
✓ **Real-time Results:** Instant analysis and visualization

---

## 2. Getting Started

### System Requirements

**Hardware:**
- Any modern computer or tablet
- Minimum 4GB RAM
- Internet connection

**Software:**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Screen resolution: 1024x768 or higher (recommended)

### Accessing the Application

**Online Version:**
- Open your web browser
- Navigate to the application URL
- The interface loads automatically

**Local Version:**
- Ensure backend server is running (Port 5000)
- Ensure frontend server is running (Port 3000)
- Open http://localhost:3000 in your browser

### Interface Overview

```
┌─────────────────────────────────────────────┐
│           HEADER & STATUS BAR               │
│     API Status Indicator (Green = OK)       │
└─────────────────────────────────────────────┘
┌─────────────┬───────────────────────────────┐
│             │                               │
│   INPUT     │       RESULTS PANEL           │
│   PANEL     │   - Summary Cards             │
│             │   - Reactions Table            │
│  - Beam     │   - SFD Chart                 │
│    Props    │   - BMD Chart                 │
│  - Supports │                               │
│  - Loads    │                               │
│  - Actions  │                               │
│             │                               │
└─────────────┴───────────────────────────────┘
```

---

## 3. Understanding Structural Concepts

### Support Types Explained

#### 🔴 **Fixed Support**
- **Symbol:** Red square (⬛)
- **Characteristics:**
  - Cannot move vertically or horizontally
  - Cannot rotate
  - Provides: Vertical reaction, Horizontal reaction, Moment
- **Real-world examples:** Beam embedded in wall, column base
- **When to use:** Beam fixed at one or both ends

#### 🟠 **Hinged Support (Pinned)**
- **Symbol:** Orange circle (🔘)
- **Characteristics:**
  - Cannot move vertically or horizontally
  - Can rotate freely
  - Provides: Vertical reaction, Horizontal reaction
- **Real-world examples:** Pin connection, simple joint
- **When to use:** Supports that allow rotation but no translation

#### 🟢 **Roller Support**
- **Symbol:** Green circle (⚪)
- **Characteristics:**
  - Cannot move vertically
  - Can move horizontally (rolls)
  - Can rotate freely
  - Provides: Vertical reaction only
- **Real-world examples:** Bridge expansion joint, sliding bearing
- **When to use:** Support allowing horizontal movement

### Loading Types Explained

#### 📍 **Point Load**
- **Definition:** Concentrated force at a single point
- **Units:** kN (kilonewtons)
- **Parameters:**
  - Position: Distance from left end (m)
  - Magnitude: Force value (kN)
- **Examples:** Person standing, column load, hanging weight
- **Input:** `Position: 5m, Magnitude: 50kN`

#### 📊 **Uniformly Distributed Load (UDL)**
- **Definition:** Constant load spread over a length
- **Units:** kN/m (kilonewtons per meter)
- **Parameters:**
  - Start position (m)
  - End position (m)
  - Intensity (kN/m)
- **Examples:** Floor dead load, snow on roof, uniform partition wall
- **Input:** `Start: 0m, End: 10m, Intensity: 15kN/m`

#### 📈 **Varying Distributed Load (VDL)**
- **Definition:** Load that varies linearly (triangular or trapezoidal)
- **Units:** kN/m
- **Parameters:**
  - Start position (m)
  - End position (m)
  - Intensity at start (kN/m)
  - Intensity at end (kN/m)
- **Examples:** Hydrostatic pressure, wind load, soil pressure
- **Input:** `Start: 0m, End: 5m, Start Intensity: 0kN/m, End Intensity: 20kN/m`

### Understanding Results

#### **Support Reactions**
- **Vertical Reaction (R_v):** Upward force at support (kN)
- **Horizontal Reaction (R_h):** Sideways force at support (kN)
- **Moment (M):** Rotational resistance at fixed supports (kN⋅m)

#### **Shear Force Diagram (SFD)**
- **Purpose:** Shows internal shear forces along the beam
- **Interpretation:**
  - Positive: Tends to move left part up
  - Negative: Tends to move left part down
  - Zero crossing: Point of maximum moment
- **Units:** kN

#### **Bending Moment Diagram (BMD)**
- **Purpose:** Shows internal bending moments along the beam
- **Interpretation:**
  - Positive (Sagging): Beam bends with tension at bottom
  - Negative (Hogging): Beam bends with tension at top
  - Maximum value: Critical design point
- **Units:** kN⋅m

---

## 4. Step-by-Step Guide

### Quick Start (5 Minutes)

#### Step 1: Click "Load Example"
1. Locate the green "Load Example" button
2. Click it
3. See pre-configured simply-supported beam

#### Step 2: Analyze
1. Click purple "Analyze Beam" button
2. Wait 1-2 seconds
3. View results appear on right panel

#### Step 3: Interpret Results
1. Check summary cards (beam length, spans, max forces)
2. Review reactions table
3. Study the SFD (red chart)
4. Study the BMD (blue chart)

---

### Complete Workflow (Custom Analysis)

#### PART A: Define Beam Properties

**Step 1: Set Beam Length**
```
Input: Beam Length (m)
Default: 10m
Range: 1m - 100m
Example: 12m
```

**Step 2: Set Material Properties** (Optional - Advanced)
```
Elastic Modulus (E):
- Default: 200,000,000 kN/m² (Steel)
- Concrete: 25,000,000 kN/m²
- Aluminum: 69,000,000 kN/m²

Moment of Inertia (I):
- Default: 0.0001 m⁴
- Depends on beam cross-section
- For I-beam: Use standard tables
```

#### PART B: Add Supports

**Step 1: Choose Support Type**
```
Dropdown: Select type
Options:
- Fixed (no movement, no rotation)
- Hinged (no movement, can rotate)
- Roller (can roll, can rotate)
```

**Step 2: Set Position**
```
Input: Position (m)
Range: 0 to Beam Length
Example: 0m (left end)
Note: Position measured from left end
```

**Step 3: Add Settlement** (Optional)
```
Input: Settlement (m)
Default: 0m (no settlement)
Positive: Downward (sinking)
Example: 0.01m (10mm sinking)
Note: Creates additional moments
```

**Step 4: Click "+ Add Support"**
```
Result: Support appears in list below
Minimum: 2 supports required
Maximum: No limit (continuous beams)
```

**Removing Supports:**
- Click the red × button on support card
- Note: Cannot remove if only 2 supports remain

#### PART C: Add Loads

**For Point Load:**
```
1. Load Type: Select "Point Load"
2. Position (m): Where force is applied
   Example: 3m from left
3. Magnitude (kN): Force value
   Example: 80kN
   Note: Positive = downward
4. Click "+ Add Load"
```

**For UDL:**
```
1. Load Type: Select "Uniformly Distributed Load (UDL)"
2. Start Position (m): Where UDL begins
   Example: 0m
3. End Position (m): Where UDL ends
   Example: 10m
4. Magnitude (kN/m): Load intensity
   Example: 15kN/m
5. Click "+ Add Load"
```

**For VDL:**
```
1. Load Type: Select "Varying Distributed Load (VDL)"
2. Start Position (m): Where VDL begins
   Example: 0m
3. End Position (m): Where VDL ends
   Example: 5m
4. Magnitude at Start (kN/m): Intensity at start
   Example: 0kN/m (triangular load)
5. Magnitude at End (kN/m): Intensity at end
   Example: 20kN/m
6. Click "+ Add Load"
```

**Removing Loads:**
- Click the red × button on any load card

#### PART D: Analyze & View Results

**Step 1: Click "Analyze Beam"**
```
Location: Purple button at bottom of input panel
Action: Sends data to analysis engine
Wait: 1-3 seconds for calculation
```

**Step 2: Check for Errors**
```
If error appears:
- Red error box shows below buttons
- Read error message carefully
- Common issues:
  * Too few supports (need ≥2)
  * No loads added (need ≥1)
  * Load position outside beam
  * Support positions conflicting
```

**Step 3: View Summary Cards**
```
Top of results panel shows 4 cards:
1. Beam Length (m)
2. Number of Spans
3. Max Shear Force (kN)
4. Max Moment (kN⋅m)

These are hover-interactive
```

**Step 4: Study Reactions Table**
```
Columns:
- Support Position (m)
- Vertical Reaction (kN)
- Horizontal Reaction (kN)
- Moment (kN⋅m)

Hover row: Background highlights
Use for: Design calculations
```

**Step 5: Analyze SFD**
```
Red chart = Shear Force Diagram
X-axis: Position along beam (m)
Y-axis: Shear force (kN)

Hover over chart:
- See exact values
- Identify critical points

Look for:
- Maximum positive shear
- Maximum negative shear
- Zero-crossing points
```

**Step 6: Analyze BMD**
```
Blue chart = Bending Moment Diagram
X-axis: Position along beam (m)
Y-axis: Bending moment (kN⋅m)

Hover over chart:
- See exact values
- Identify maximum moment

Look for:
- Maximum positive moment (sagging)
- Maximum negative moment (hogging)
- Zero-moment points
```

---

## 5. Feature Reference

### Button Functions

| Button | Color | Function |
|--------|-------|----------|
| **Analyze Beam** | Purple | Performs structural analysis |
| **Clear All** | Gray | Removes all supports and loads |
| **Load Example** | Green | Loads demo configuration |
| **+ Add Support** | Green | Adds support to beam |
| **+ Add Load** | Green | Adds load to beam |
| **× (on card)** | Red | Removes individual item |

### Input Validation

The system automatically validates:

✓ **Beam Length:** Must be positive
✓ **Support Position:** Must be within 0 to beam length
✓ **Load Position:** Must be within beam range
✓ **Start < End:** For distributed loads
✓ **Minimum Supports:** At least 2 required
✓ **Minimum Loads:** At least 1 required

### Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "At least 2 supports required" | Less than 2 supports | Add more supports |
| "At least 1 load required" | No loads added | Add at least one load |
| "Position out of range" | Support/load outside beam | Adjust position |
| "Start position ≥ end position" | Invalid range for distributed load | Fix start/end values |
| "API disconnected" | Backend not responding | Check server status |

---

## 6. Examples & Tutorials

### Example 1: Simply Supported Beam with Point Load

**Problem Statement:**
A 10m simply supported beam carries a 50kN point load at mid-span.

**Step-by-Step:**

1. **Set Beam Length:** 10m
2. **Add Supports:**
   - Support 1: Position = 0m, Type = Hinged
   - Support 2: Position = 10m, Type = Roller
3. **Add Load:**
   - Type: Point Load
   - Position: 5m (mid-span)
   - Magnitude: 50kN
4. **Analyze**

**Expected Results:**
- Reactions: R1 = 25kN, R2 = 25kN
- Max Moment: ~125 kN⋅m at center
- Max Shear: 25kN

---

### Example 2: Cantilever Beam with UDL

**Problem Statement:**
A 6m cantilever beam (fixed at left end) carries 10kN/m UDL over entire length.

**Step-by-Step:**

1. **Set Beam Length:** 6m
2. **Add Supports:**
   - Support 1: Position = 0m, Type = Fixed
   - Support 2: Position = 6m, Type = Free (No support - single support case)
3. **Add Load:**
   - Type: UDL
   - Start: 0m
   - End: 6m
   - Magnitude: 10kN/m
4. **Analyze**

**Expected Results:**
- Fixed End Reaction: 60kN
- Fixed End Moment: -180 kN⋅m
- Max Moment: -180 kN⋅m at fixed end

---

### Example 3: Continuous Beam (Multi-Span)

**Problem Statement:**
A 15m continuous beam with 3 supports carries mixed loading.

**Step-by-Step:**

1. **Set Beam Length:** 15m
2. **Add Supports:**
   - Support 1: Position = 0m, Type = Hinged
   - Support 2: Position = 7m, Type = Roller
   - Support 3: Position = 15m, Type = Roller
3. **Add Loads:**
   - Point Load: Position = 3m, Magnitude = 60kN
   - UDL: Start = 7m, End = 15m, Magnitude = 20kN/m
4. **Analyze**

**Result:** System analyzes as two-span continuous beam with moment redistribution.

---

### Example 4: Settlement Analysis

**Problem Statement:**
10m simply supported beam with 10mm settlement at right support.

**Step-by-Step:**

1. **Set Beam Length:** 10m
2. **Add Supports:**
   - Support 1: Position = 0m, Type = Fixed, Settlement = 0m
   - Support 2: Position = 10m, Type = Roller, Settlement = 0.01m (10mm)
3. **Add Load:**
   - UDL: Start = 0m, End = 10m, Magnitude = 12kN/m
4. **Analyze**

**Result:** Additional moments induced due to settlement differential.

---

### Example 5: Triangular Load (VDL)

**Problem Statement:**
8m beam with triangular hydrostatic load.

**Step-by-Step:**

1. **Set Beam Length:** 8m
2. **Add Supports:**
   - Support 1: Position = 0m, Type = Hinged
   - Support 2: Position = 8m, Type = Roller
3. **Add Load:**
   - Type: VDL
   - Start: 0m
   - End: 8m
   - Start Magnitude: 0kN/m
   - End Magnitude: 24kN/m (triangular)
4. **Analyze**

**Result:** Non-uniform moment distribution following triangular load pattern.

---

## 7. Troubleshooting

### Common Issues & Solutions

#### Issue: "API Disconnected" Red Badge

**Possible Causes:**
- Backend server not running
- Network connection issue
- Wrong API URL

**Solutions:**
1. Check if backend is running (Port 5000)
2. Refresh the page
3. Check browser console for errors
4. Verify API URL in settings

---

#### Issue: Results Not Appearing

**Possible Causes:**
- Analysis still processing
- Input validation failed
- Browser JavaScript disabled

**Solutions:**
1. Wait 3-5 seconds
2. Check for red error messages
3. Enable JavaScript in browser
4. Try "Clear All" and re-enter data

---

#### Issue: Unexpected Reaction Values

**Possible Causes:**
- Input error (wrong units, position)
- Settlement included accidentally
- Load magnitude too high

**Solutions:**
1. Verify all input values
2. Check unit consistency (m, kN)
3. Re-check support settlement values
4. Validate with hand calculations

---

#### Issue: Diagram Not Displaying

**Possible Causes:**
- Chart library not loaded
- Browser compatibility
- Too many data points

**Solutions:**
1. Refresh page
2. Try different browser (Chrome recommended)
3. Clear browser cache
4. Reduce number of diagram points

---

### Best Practices

#### ✅ DO:
- Start with "Load Example" to familiarize yourself
- Double-check all input values before analyzing
- Use consistent units (meters, kilonewtons)
- Save screenshots of results for reference
- Verify results with hand calculations for critical designs

#### ❌ DON'T:
- Mix units (don't use mm and m together)
- Add too many loads without organizing
- Ignore error messages
- Use unrealistic values (e.g., 1000m beam)
- Rely solely on software - understand the theory

---

## 8. Technical Specifications

### Analysis Methods

**Simple Beams:**
- Direct equilibrium equations
- Superposition principle

**Continuous Beams:**
- Moment distribution method
- Slope-deflection equations
- Iterative convergence (tolerance: 1e-6)

**Fixed End Moments:**
- Standard formulas for all load types
- Superposition for composite loading

### Accuracy

- **Calculation Precision:** 6 decimal places
- **Display Precision:** 2-3 decimal places
- **Convergence:** ε < 1×10⁻⁶
- **Diagram Points:** 100 points per span

### Limitations

**Current Version:**
- Elastic analysis only (no plastic hinge)
- Planar structures (2D only)
- Static loading (no dynamic effects)
- Small deflection theory
- Prismatic members (constant EI)

**Maximum Values:**
- Beam Length: 1000m
- Number of Supports: Unlimited
- Number of Loads: Unlimited
- Load Magnitude: No theoretical limit

### Units

**Standard SI Units:**
- Length: meters (m)
- Force: kilonewtons (kN)
- Distributed Load: kN/m
- Moment: kN⋅m
- Stress: kN/m² (optional)
- Deflection: m

### Browser Support

✓ **Fully Supported:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

⚠️ **Limited Support:**
- Internet Explorer (not recommended)
- Mobile browsers (functional but less optimal)

---

## Appendix A: Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Tab | Navigate between inputs |
| Enter | Submit current form |
| Esc | Clear current input |
| Ctrl + A | Analyze beam (when focused) |
| Ctrl + R | Reset form |

---

## Appendix B: Sign Conventions

### Forces:
- **Positive:** Downward
- **Negative:** Upward

### Moments:
- **Positive:** Counterclockwise (sagging)
- **Negative:** Clockwise (hogging)

### Shear Force:
- **Positive:** Tends to rotate element clockwise
- **Negative:** Tends to rotate element counterclockwise

### Deflection:
- **Positive:** Downward
- **Negative:** Upward

---

## Appendix C: Formula Reference

### Fixed End Moments

**Point Load (P) at distance 'a' from left, span 'L':**
```
M_AB = -(P × a × b²) / L²
M_BA = (P × a² × b) / L²
where b = L - a
```

**Uniformly Distributed Load (w) over span 'L':**
```
M_AB = -(w × L²) / 12
M_BA = (w × L²) / 12
```

**Triangular Load (w_max) over span 'L':**
```
M_AB = -(w_max × L²) / 30  (load increasing)
M_BA = (w_max × L²) / 20
```

---

## Appendix D: Support FAQs

**Q: How many supports do I need?**
A: Minimum 2 supports. More supports create continuous beams.

**Q: Can I have a cantilever?**
A: Yes, use 1 fixed support at one end only.

**Q: What's the difference between hinged and roller?**
A: Hinged prevents horizontal movement; roller allows it.

**Q: When should I use fixed supports?**
A: When the beam is embedded or welded to another member.

**Q: Can supports be at the same position?**
A: No, each support must be at a unique position.

---

## Appendix E: Loading FAQs

**Q: Can I combine different load types?**
A: Yes! Add as many loads as needed. The system uses superposition.

**Q: How do I model a partially distributed load?**
A: Use UDL with specific start and end positions.

**Q: What if my load varies non-linearly?**
A: Approximate with multiple VDL segments or equivalent point loads.

**Q: Can loads extend beyond supports?**
A: No, loads must be within the beam length.

**Q: How do I convert dead load to UDL?**
A: Multiply weight per unit length (e.g., 1.5 kN/m × beam width).

---

## Appendix F: Verification Examples

### Verification 1: Classical Hand Calculation

**Problem:** 8m simply supported beam, 40kN at 3m from left

**Hand Calculation:**
```
ΣM_A = 0: R_B × 8 - 40 × 3 = 0
R_B = 15 kN

ΣF_y = 0: R_A + R_B - 40 = 0
R_A = 25 kN

M_max = R_A × 3 = 25 × 3 = 75 kN⋅m
```

**Software Input:**
- Beam: 8m
- Supports: 0m (Hinged), 8m (Roller)
- Load: Point, 3m, 40kN

**Expected Match:** R_A = 25kN, R_B = 15kN, M_max ≈ 75kN⋅m

---

## Appendix G: Contact & Support

**Technical Support:**
- Check error messages carefully
- Review this manual thoroughly
- Verify input data accuracy

**Educational Use:**
- This tool is for educational purposes
- Always verify critical designs with licensed engineer
- Understand theory before using software

**Feedback & Issues:**
- Report bugs with specific input values
- Suggest features for future versions
- Share success stories

---

## Appendix H: CEG 410 Requirements Checklist

✅ **Support Conditions:**
- [x] Fixed supports
- [x] Hinged (pinned) supports
- [x] Roller supports

✅ **Span Analysis:**
- [x] Single span beams
- [x] Multi-span continuous beams
- [x] Any number of supports

✅ **Loading Types:**
- [x] Point loads
- [x] Uniformly distributed loads (UDL)
- [x] Varying distributed loads (VDL)
- [x] Composite loads (combinations)

✅ **Fixed End Moments:**
- [x] Automatic FEM calculation
- [x] All load type formulas implemented
- [x] Accurate results

✅ **Sinking Supports:**
- [x] Settlement input available
- [x] Additional moments calculated
- [x] Correct boundary conditions

✅ **Boundary Conditions:**
- [x] Correctly implemented
- [x] Validated output

✅ **Diagrams:**
- [x] Shear Force Diagram (SFD)
- [x] Bending Moment Diagram (BMD)
- [x] Interactive visualization
- [x] Precise calculations

---

## Document Information

**Version:** 1.0.0
**Last Updated:** 2026-02-03
**Application:** Beam and Frame Analysis System
**Course:** CEG 410 - Structural Analysis
**Pages:** 20+

**Prepared for:** All Users
**Difficulty Level:** Beginner to Advanced
**Estimated Reading Time:** 45-60 minutes

---

**END OF USER MANUAL**

For additional help or questions, refer to the application interface tooltips or consult your structural engineering textbook.
