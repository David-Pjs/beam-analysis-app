"""
Fixed End Moments (FEM) calculations for different loading conditions
"""
import numpy as np


def fem_point_load(P, a, L):
    """
    Fixed end moments for a point load on a simply supported beam

    Args:
        P (float): Point load magnitude (kN)
        a (float): Distance from left end to load (m)
        L (float): Span length (m)

    Returns:
        tuple: (M_AB, M_BA) - moments at left and right ends
    """
    b = L - a
    M_AB = -P * a * b**2 / L**2
    M_BA = P * a**2 * b / L**2
    return M_AB, M_BA


def fem_udl(w, L):
    """
    Fixed end moments for uniformly distributed load

    Args:
        w (float): Load intensity (kN/m)
        L (float): Span length (m)

    Returns:
        tuple: (M_AB, M_BA) - moments at left and right ends
    """
    M_AB = -w * L**2 / 12
    M_BA = w * L**2 / 12
    return M_AB, M_BA


def fem_partial_udl(w, a, b, L):
    """
    Fixed end moments for partial uniformly distributed load

    Args:
        w (float): Load intensity (kN/m)
        a (float): Start position from left (m)
        b (float): End position from left (m)
        L (float): Span length (m)

    Returns:
        tuple: (M_AB, M_BA) - moments at left and right ends
    """
    c = b - a  # Length of loaded portion
    # Using equivalent point load at centroid
    P = w * c
    x = a + c / 2  # Distance to centroid from left
    return fem_point_load(P, x, L)


def fem_triangular_load(w_max, L, reverse=False):
    """
    Fixed end moments for triangular distributed load

    Args:
        w_max (float): Maximum load intensity (kN/m)
        L (float): Span length (m)
        reverse (bool): If True, load decreases from left to right

    Returns:
        tuple: (M_AB, M_BA) - moments at left and right ends
    """
    if not reverse:
        # Load increases from left (0) to right (w_max)
        M_AB = -w_max * L**2 / 30
        M_BA = w_max * L**2 / 20
    else:
        # Load decreases from left (w_max) to right (0)
        M_AB = -w_max * L**2 / 20
        M_BA = w_max * L**2 / 30

    return M_AB, M_BA


def fem_trapezoidal_load(w1, w2, L):
    """
    Fixed end moments for trapezoidal distributed load

    Args:
        w1 (float): Load intensity at left end (kN/m)
        w2 (float): Load intensity at right end (kN/m)
        L (float): Span length (m)

    Returns:
        tuple: (M_AB, M_BA) - moments at left and right ends
    """
    # Decompose into rectangular and triangular parts
    w_rect = min(w1, w2)
    w_tri = abs(w2 - w1)

    # Rectangular part
    M_AB_rect, M_BA_rect = fem_udl(w_rect, L)

    # Triangular part
    reverse = w2 < w1
    M_AB_tri, M_BA_tri = fem_triangular_load(w_tri, L, reverse)

    # Superposition
    M_AB = M_AB_rect + M_AB_tri
    M_BA = M_BA_rect + M_BA_tri

    return M_AB, M_BA


def fem_support_settlement(delta, L, EI):
    """
    Fixed end moments due to support settlement

    Args:
        delta (float): Settlement difference (m) - positive if right support sinks
        L (float): Span length (m)
        EI (float): Flexural rigidity (kN⋅m²)

    Returns:
        tuple: (M_AB, M_BA) - moments at left and right ends
    """
    M = 6 * EI * delta / L**2
    M_AB = -M
    M_BA = -M
    return M_AB, M_BA


def calculate_fem_for_span(span_start, span_end, loads, supports, EI):
    """
    Calculate total fixed end moments for a span considering all loads

    Args:
        span_start (float): Start position of span (m)
        span_end (float): End position of span (m)
        loads (list): List of load objects
        supports (list): List of support objects
        EI (float): Flexural rigidity (kN⋅m²)

    Returns:
        tuple: (M_left, M_right) - total FEM at span ends
    """
    L = span_end - span_start
    M_left_total = 0.0
    M_right_total = 0.0

    # Process each load
    for load in loads:
        if load.load_type == 'point':
            # Check if load is within span
            if span_start <= load.position <= span_end:
                a = load.position - span_start
                M_AB, M_BA = fem_point_load(load.magnitude, a, L)
                M_left_total += M_AB
                M_right_total += M_BA

        elif load.load_type == 'udl':
            # Check if load overlaps with span
            load_start = max(load.start, span_start)
            load_end = min(load.end, span_end)

            if load_start < load_end:
                if load.start <= span_start and load.end >= span_end:
                    # Full span loaded
                    M_AB, M_BA = fem_udl(load.magnitude, L)
                else:
                    # Partial span loaded
                    a = load_start - span_start
                    b = load_end - span_start
                    M_AB, M_BA = fem_partial_udl(load.magnitude, a, b, L)

                M_left_total += M_AB
                M_right_total += M_BA

        elif load.load_type == 'vdl':
            # Check if load overlaps with span
            if load.start <= span_end and load.end >= span_start:
                M_AB, M_BA = fem_trapezoidal_load(
                    load.magnitude_start,
                    load.magnitude_end,
                    L
                )
                M_left_total += M_AB
                M_right_total += M_BA

    # Check for support settlements
    left_support = next((s for s in supports if abs(s.position - span_start) < 0.001), None)
    right_support = next((s for s in supports if abs(s.position - span_end) < 0.001), None)

    if left_support and right_support:
        delta = right_support.settlement - left_support.settlement
        if abs(delta) > 1e-6:
            M_AB, M_BA = fem_support_settlement(delta, L, EI)
            M_left_total += M_AB
            M_right_total += M_BA

    return M_left_total, M_right_total
