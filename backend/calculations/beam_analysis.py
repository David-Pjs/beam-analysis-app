"""
Beam analysis using moment distribution method and slope-deflection
"""
import numpy as np
from .fixed_end_moments import calculate_fem_for_span


def analyze_continuous_beam(beam):
    """
    Analyze continuous beam using moment distribution method

    Args:
        beam: Beam object with supports and loads

    Returns:
        dict: Analysis results with moments, shear forces, and reactions
    """
    spans = beam.get_spans()
    n_supports = len(beam.supports)
    EI = beam.E * beam.I

    if n_supports < 2:
        raise ValueError("Beam must have at least 2 supports")

    # Calculate stiffness factors and distribution factors
    support_moments = np.zeros(n_supports)

    if n_supports == 2:
        # Simply supported or fixed beam
        return analyze_simple_beam(beam)

    # For continuous beams with more than 2 supports
    # Use moment distribution method

    # Step 1: Calculate fixed end moments for each span
    fem = []
    for i, (start, end) in enumerate(spans):
        M_left, M_right = calculate_fem_for_span(
            start, end, beam.loads, beam.supports, EI
        )
        fem.append((M_left, M_right))

    # Step 2: Calculate stiffness factors (k = 4EI/L for far end fixed)
    stiffness = []
    for start, end in spans:
        L = end - start
        k = 4 * EI / L
        stiffness.append(k)

    # Step 3: Calculate distribution factors at each interior support
    distribution_factors = []
    for i in range(n_supports):
        support = beam.supports[i]

        if i == 0 or i == n_supports - 1:
            # End supports
            if support.support_type == 'fixed':
                distribution_factors.append([1.0])
            else:
                distribution_factors.append([0.0])
        else:
            # Interior support
            if support.support_type == 'fixed':
                # Fixed support - no rotation
                distribution_factors.append([0.0, 0.0])
            else:
                # Hinged or roller - can rotate
                k_left = stiffness[i - 1] if i > 0 else 0
                k_right = stiffness[i] if i < len(stiffness) else 0
                k_total = k_left + k_right

                if k_total > 0:
                    df_left = k_left / k_total
                    df_right = k_right / k_total
                    distribution_factors.append([df_left, df_right])
                else:
                    distribution_factors.append([0.0, 0.0])

    # Step 4: Moment distribution iterations
    max_iterations = 100
    tolerance = 1e-6

    # Initialize moment array
    moments = np.zeros(n_supports)

    # Set initial moments from FEM
    for i in range(len(spans)):
        moments[i] += fem[i][0]  # Left end of span
        moments[i + 1] += fem[i][1]  # Right end of span

    # Moment distribution process
    for iteration in range(max_iterations):
        moment_changes = np.zeros(n_supports)
        max_change = 0

        for i in range(1, n_supports - 1):
            support = beam.supports[i]

            if support.support_type != 'fixed':
                # Calculate unbalanced moment
                unbalanced = -moments[i]

                if len(distribution_factors[i]) == 2:
                    df_left, df_right = distribution_factors[i]

                    # Distribute to adjacent spans
                    distributed_left = unbalanced * df_left
                    distributed_right = unbalanced * df_right

                    moment_changes[i] += unbalanced
                    if i > 0:
                        moment_changes[i - 1] += distributed_left * 0.5  # Carry-over
                    if i < n_supports - 1:
                        moment_changes[i + 1] += distributed_right * 0.5  # Carry-over

                    max_change = max(max_change, abs(unbalanced))

        moments += moment_changes

        if max_change < tolerance:
            break

    # Calculate reactions and diagram values
    reactions = calculate_reactions(beam, moments, spans)
    shear_diagram = calculate_shear_diagram(beam, reactions, moments)
    moment_diagram = calculate_moment_diagram(beam, reactions, moments)

    return {
        'support_moments': moments.tolist(),
        'reactions': reactions,
        'shear_force_diagram': shear_diagram,
        'bending_moment_diagram': moment_diagram,
        'spans': spans
    }


def analyze_simple_beam(beam):
    """
    Analyze simply supported or single-span beam

    Args:
        beam: Beam object

    Returns:
        dict: Analysis results
    """
    L = beam.length
    supports = beam.supports

    # Calculate reactions using equilibrium
    total_load = 0
    moment_about_left = 0

    for load in beam.loads:
        if load.load_type == 'point':
            total_load += load.magnitude
            moment_about_left += load.magnitude * load.position

        elif load.load_type == 'udl':
            length = load.end - load.start
            load_total = load.magnitude * length
            centroid = load.start + length / 2
            total_load += load_total
            moment_about_left += load_total * centroid

        elif load.load_type == 'vdl':
            length = load.end - load.start
            # Trapezoidal area
            load_total = (load.magnitude_start + load.magnitude_end) / 2 * length
            # Centroid calculation for trapezoid
            if abs(load.magnitude_start - load.magnitude_end) < 1e-6:
                centroid = load.start + length / 2
            else:
                h1, h2 = load.magnitude_start, load.magnitude_end
                centroid = load.start + length * (h1 + 2*h2) / (3 * (h1 + h2))

            total_load += load_total
            moment_about_left += load_total * centroid

    # Solve for reactions
    if len(supports) >= 2:
        R_B = moment_about_left / L
        R_A = total_load - R_B

        reactions = [
            {'position': supports[0].position, 'vertical': R_A, 'horizontal': 0, 'moment': 0},
            {'position': supports[1].position, 'vertical': R_B, 'horizontal': 0, 'moment': 0}
        ]
    else:
        reactions = []

    # Generate diagrams
    shear_diagram = calculate_shear_diagram(beam, reactions, [0, 0])
    moment_diagram = calculate_moment_diagram(beam, reactions, [0, 0])

    return {
        'support_moments': [0, 0],
        'reactions': reactions,
        'shear_force_diagram': shear_diagram,
        'bending_moment_diagram': moment_diagram,
        'spans': [(0, L)]
    }


def calculate_reactions(beam, support_moments, spans):
    """Calculate support reactions"""
    reactions = []

    for i, support in enumerate(beam.supports):
        # For each support, calculate reaction
        R_v = 0

        # From left span (if exists)
        if i > 0:
            span_start, span_end = spans[i - 1]
            L = span_end - span_start
            # Add reactions from this span

        # From right span (if exists)
        if i < len(spans):
            span_start, span_end = spans[i]
            L = span_end - span_start
            # Add reactions from this span

        reactions.append({
            'position': support.position,
            'vertical': R_v,
            'horizontal': 0,
            'moment': support_moments[i] if support.support_type == 'fixed' else 0
        })

    return reactions


def calculate_shear_diagram(beam, reactions, support_moments, num_points=100):
    """Calculate shear force diagram"""
    diagram = []
    L = beam.length

    for i in range(num_points):
        x = i * L / (num_points - 1)
        shear = calculate_shear_at_point(x, beam, reactions)
        diagram.append({'x': x, 'value': shear})

    return diagram


def calculate_moment_diagram(beam, reactions, support_moments, num_points=100):
    """Calculate bending moment diagram"""
    diagram = []
    L = beam.length

    for i in range(num_points):
        x = i * L / (num_points - 1)
        moment = calculate_moment_at_point(x, beam, reactions)
        diagram.append({'x': x, 'value': moment})

    return diagram


def calculate_shear_at_point(x, beam, reactions):
    """Calculate shear force at a specific point"""
    shear = 0

    # Add reactions from supports to the left
    for reaction in reactions:
        if reaction['position'] < x:
            shear += reaction['vertical']

    # Subtract loads to the left
    for load in beam.loads:
        if load.load_type == 'point' and load.position < x:
            shear -= load.magnitude

        elif load.load_type == 'udl':
            if load.start < x:
                length = min(load.end, x) - load.start
                shear -= load.magnitude * length

        elif load.load_type == 'vdl':
            if load.start < x:
                length = min(load.end, x) - load.start
                avg_magnitude = (load.magnitude_start + load.magnitude_end) / 2
                shear -= avg_magnitude * length

    return shear


def calculate_moment_at_point(x, beam, reactions):
    """Calculate bending moment at a specific point"""
    moment = 0

    # Add moments from reactions to the left
    for reaction in reactions:
        if reaction['position'] < x:
            moment += reaction['vertical'] * (x - reaction['position'])
            moment += reaction['moment']

    # Subtract moments from loads to the left
    for load in beam.loads:
        if load.load_type == 'point' and load.position < x:
            moment -= load.magnitude * (x - load.position)

        elif load.load_type == 'udl':
            if load.start < x:
                end = min(load.end, x)
                length = end - load.start
                centroid = load.start + length / 2
                total_load = load.magnitude * length
                moment -= total_load * (x - centroid)

        elif load.load_type == 'vdl':
            if load.start < x:
                end = min(load.end, x)
                length = end - load.start
                # Approximate with trapezoidal area
                avg_magnitude = (load.magnitude_start + load.magnitude_end) / 2
                total_load = avg_magnitude * length
                centroid = load.start + length / 2
                moment -= total_load * (x - centroid)

    return moment
